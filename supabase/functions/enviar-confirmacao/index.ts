/* ============================================================
   Edge Function — e-mail de confirmação da inscrição

   Disparada por um Database Webhook do Supabase, a cada INSERT em
   public.inscricoes. Envia o e-mail pela Resend.

   Por que aqui e não no site: a chave da Resend não pode ir para o
   navegador. Qualquer visitante leria o código e passaria a mandar e-mail
   em nome do evento. Aqui ela fica como secret, só no servidor.

   Segredos necessários (Project Settings > Edge Functions > Secrets):
     RESEND_API_KEY     chave da Resend
     EMAIL_REMETENTE    ex.: MaratonArq <contato@maratonarq.com.br>
                        o domínio precisa estar verificado na Resend
     WEBHOOK_SEGREDO    string qualquer; a mesma configurada no cabeçalho
                        do webhook, para ninguém chamar a função por fora
   ============================================================ */

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const EMAIL_REMETENTE = Deno.env.get('EMAIL_REMETENTE') ?? 'MaratonArq <onboarding@resend.dev>';
const WEBHOOK_SEGREDO = Deno.env.get('WEBHOOK_SEGREDO');

const EVENTO = {
  nome: 'MaratonArq 2026',
  datas: '11 a 13 de setembro de 2026',
  local: 'UDESC — Laguna',
};

function corpoHtml(inscricao: Record<string, unknown>) {
  const nome = String(inscricao.nome ?? '').trim().split(' ')[0] || 'tudo bem';
  const modalidade = inscricao.modalidade
    ? `<tr>
         <td style="padding:6px 0;color:#7C6E97;font-size:14px">Modalidade</td>
         <td style="padding:6px 0;color:#1A0A3D;font-size:14px;text-align:right">${escapar(String(inscricao.modalidade))}</td>
       </tr>`
    : '';

  return `<!doctype html>
<html lang="pt-BR"><body style="margin:0;padding:0;background:#F5F0E3">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0E3;padding:32px 16px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
             style="max-width:520px;background:#FBF8F0;border:1px solid #E0D7C0;border-radius:18px;overflow:hidden">
        <tr>
          <td style="background:#230564;padding:18px 32px;text-align:left">
            <img src="https://www.maratonarq.com.br/assets/logo-email.png" alt="MaratonArq"
                 width="160" style="display:block;width:160px;height:auto" />
          </td>
        </tr>
        <tr>
          <td style="padding:32px">
            <h1 style="margin:0 0 12px;font-family:Georgia,serif;font-size:26px;color:#1A0A3D">
              Inscrição confirmada!
            </h1>
            <p style="margin:0 0 20px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#463568">
              Oi, ${escapar(nome)}. Sua inscrição no <strong>${EVENTO.nome}</strong> está registrada.
              Guarde as datas — a gente se vê lá.
            </p>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                   style="background:#EDE6D4;border-radius:8px;padding:16px 18px;font-family:Helvetica,Arial,sans-serif">
              <tr>
                <td style="padding:6px 0;color:#7C6E97;font-size:14px">Quando</td>
                <td style="padding:6px 0;color:#1A0A3D;font-size:14px;text-align:right">${EVENTO.datas}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#7C6E97;font-size:14px">Onde</td>
                <td style="padding:6px 0;color:#1A0A3D;font-size:14px;text-align:right">${EVENTO.local}</td>
              </tr>
              ${modalidade}
            </table>

            <p style="margin:22px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:1.6;color:#7C6E97">
              Recebeu este e-mail sem ter se inscrito? Pode ignorar, nenhuma vaga foi reservada em seu nome.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#15033C;padding:18px 32px;font-family:Helvetica,Arial,sans-serif;font-size:12px;color:rgba(245,240,227,.6)">
            MaratonArq · iDealizejr — Empresa Júnior de Arquitetura e Urbanismo
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function escapar(s: string) {
  return s.replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string
  ));
}

Deno.serve(async (req) => {
  // Só o webhook pode chamar. Sem isso, qualquer um dispararia e-mails.
  if (WEBHOOK_SEGREDO && req.headers.get('x-webhook-segredo') !== WEBHOOK_SEGREDO) {
    return new Response('não autorizado', { status: 401 });
  }
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY não configurada');
    return new Response('remetente não configurado', { status: 500 });
  }

  const payload = await req.json().catch(() => null);
  const inscricao = payload?.record;
  if (!inscricao) return new Response('payload inválido', { status: 400 });

  const destino = String(inscricao.email ?? '').trim();
  if (!destino) {
    // Arquiteto não informa e-mail no formulário: não há para onde mandar.
    console.log('inscrição sem e-mail, nada a enviar:', inscricao.id);
    return new Response(JSON.stringify({ enviado: false, motivo: 'sem e-mail' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: EMAIL_REMETENTE,
      to: [destino],
      subject: `Inscrição confirmada — ${EVENTO.nome}`,
      html: corpoHtml(inscricao),
    }),
  });

  if (!r.ok) {
    const detalhe = await r.text().catch(() => '');
    console.error('Resend recusou o envio:', r.status, detalhe);
    return new Response('falha ao enviar', { status: 502 });
  }

  return new Response(JSON.stringify({ enviado: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
