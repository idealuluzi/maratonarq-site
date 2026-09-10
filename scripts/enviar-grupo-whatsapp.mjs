/* ============================================================
   Disparo único — e-mail com o grupo de WhatsApp para quem JÁ se inscreveu

   Não faz parte do site. Roda uma vez, na sua máquina, com Node.
   O e-mail de confirmação dos PRÓXIMOS inscritos já leva o grupo por conta
   própria (supabase/functions/enviar-confirmacao). Este script é só para
   alcançar quem se inscreveu antes disso existir.

   ---------------------------------------------------------------
   Como rodar

   1. Crie um arquivo `.env.broadcast` na raiz do projeto (o git já ignora
      qualquer .env), com:

        SUPABASE_URL=https://SEU-PROJETO.supabase.co
        SUPABASE_SERVICE_ROLE_KEY=...      (Supabase > Project Settings > API,
                                            campo "service_role" — chave secreta,
                                            só usada aqui, nunca no site)
        RESEND_API_KEY=...                 (a mesma da Edge Function)
        EMAIL_REMETENTE=MaratonArq <contato@maratonarq.com.br>

   2. Primeiro veja quem receberia, sem enviar nada:

        node scripts/enviar-grupo-whatsapp.mjs

   3. Conferiu a lista? Então dispare de verdade:

        node scripts/enviar-grupo-whatsapp.mjs --enviar
   ============================================================ */

import { readFileSync } from 'node:fs';

const GRUPO_URL = 'https://chat.whatsapp.com/GWSNHNn5dOW4nzigP9Eynm';
const QR_URL = 'https://www.maratonarq.com.br/assets/whatsapp-qr.png';
const LOGO_URL = 'https://www.maratonarq.com.br/assets/logo-email.png';
const ASSUNTO = 'Entre no grupo do MaratonArq no WhatsApp';

// ---- carrega .env.broadcast (formato CHAVE=valor, uma por linha) ----
function carregarEnv(arquivo) {
  let texto;
  try {
    texto = readFileSync(new URL(`../${arquivo}`, import.meta.url), 'utf8');
  } catch {
    return;
  }
  for (const linha of texto.split('\n')) {
    const limpa = linha.trim();
    if (!limpa || limpa.startsWith('#')) continue;
    const i = limpa.indexOf('=');
    if (i === -1) continue;
    const chave = limpa.slice(0, i).trim();
    const valor = limpa.slice(i + 1).trim();
    if (!(chave in process.env)) process.env[chave] = valor;
  }
}
carregarEnv('.env.broadcast');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_REMETENTE = process.env.EMAIL_REMETENTE;

const ENVIAR = process.argv.includes('--enviar');

for (const [nome, valor] of Object.entries({
  SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY: SERVICE_KEY, RESEND_API_KEY, EMAIL_REMETENTE,
})) {
  if (!valor) {
    console.error(`Falta ${nome}. Preencha o .env.broadcast (veja o topo deste arquivo).`);
    process.exit(1);
  }
}

function corpoHtml(primeiroNome) {
  const ola = primeiroNome ? `Oi, ${primeiroNome}` : 'Oi';
  return `<!doctype html>
<html lang="pt-BR"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light">
<style>:root{color-scheme:light;supported-color-schemes:light}body,table,td{color-scheme:light !important}</style>
</head>
<body style="margin:0;padding:0;background:#F5F0E3">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#F5F0E3" style="background:#F5F0E3;padding:32px 16px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#FBF8F0"
             style="max-width:520px;background:#FBF8F0;border:1px solid #E0D7C0;border-radius:18px;overflow:hidden">
        <tr>
          <td bgcolor="#230564" style="background:#230564;padding:18px 32px;text-align:left">
            <img src="${LOGO_URL}" alt="MaratonArq" width="160" style="display:block;width:160px;height:auto" />
          </td>
        </tr>
        <tr>
          <td bgcolor="#FBF8F0" style="padding:32px;background:#FBF8F0">
            <h1 style="margin:0 0 12px;font-family:Georgia,serif;font-size:24px;color:#1A0A3D">
              O grupo de avisos está no ar
            </h1>
            <p style="margin:0 0 20px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#463568">
              ${ola}! Sua inscrição no <strong>MaratonArq 2026</strong> já está confirmada.
              Criamos um grupo no WhatsApp para os avisos oficiais do evento — programação,
              horários, orientações do hackathon. Entre para não perder nada.
            </p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px">
              <tr>
                <td width="120" valign="middle" style="padding-right:16px">
                  <a href="${GRUPO_URL}">
                    <img src="${QR_URL}" alt="QR do grupo do MaratonArq no WhatsApp"
                         width="120" style="display:block;width:120px;height:120px;border-radius:8px" />
                  </a>
                </td>
                <td valign="middle" style="font-family:Helvetica,Arial,sans-serif">
                  <p style="margin:0 0 6px;font-size:14px;font-weight:bold;color:#1A0A3D">Entrar no grupo</p>
                  <p style="margin:0;font-size:13px;line-height:1.5;color:#7C6E97">
                    Aponte a câmera para o qr code ou
                    <a href="${GRUPO_URL}" style="color:#9d833f;font-weight:bold;text-decoration:none">clique aqui</a>.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td bgcolor="#15033C" style="background:#15033C;padding:18px 32px;font-family:Helvetica,Arial,sans-serif;font-size:12px;color:rgba(245,240,227,.6)">
            MaratonArq · iDealizejr — Empresa Júnior de Arquitetura e Urbanismo
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- 1. puxa todos os inscritos ----
const resp = await fetch(`${SUPABASE_URL}/rest/v1/inscricoes?select=nome,email`, {
  headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
});
if (!resp.ok) {
  console.error('Falha ao ler inscrições:', resp.status, await resp.text());
  process.exit(1);
}
const linhas = await resp.json();

// ---- 2. um e-mail por endereço (o primeiro nome que aparecer para ele) ----
const porEmail = new Map();
for (const { nome, email } of linhas) {
  const e = String(email ?? '').trim().toLowerCase();
  if (!e || !e.includes('@')) continue;
  if (!porEmail.has(e)) {
    porEmail.set(e, String(nome ?? '').trim().split(/\s+/)[0] || '');
  }
}
const destinatarios = [...porEmail.entries()];

console.log(`${linhas.length} inscrições • ${destinatarios.length} e-mails únicos\n`);
for (const [email, nome] of destinatarios) console.log(`  ${email}${nome ? `  (${nome})` : ''}`);

if (!ENVIAR) {
  console.log('\nModo teste — nada foi enviado. Rode de novo com --enviar para disparar.');
  process.exit(0);
}

// ---- 3. envia, um a um, com folga para o limite da Resend ----
console.log('\nEnviando...\n');
let ok = 0;
const falhas = [];
for (const [email, nome] of destinatarios) {
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: EMAIL_REMETENTE, to: [email], subject: ASSUNTO, html: corpoHtml(nome) }),
    });
    if (r.ok) { ok++; console.log(`  ok    ${email}`); }
    else { const d = await r.text(); falhas.push([email, `${r.status} ${d}`]); console.log(`  FALHA ${email} — ${r.status}`); }
  } catch (e) {
    falhas.push([email, String(e)]);
    console.log(`  FALHA ${email} — ${e}`);
  }
  await dormir(600);
}

console.log(`\n${ok} enviados, ${falhas.length} falhas.`);
if (falhas.length) {
  console.log('\nFalhas:');
  for (const [email, motivo] of falhas) console.log(`  ${email} — ${motivo}`);
  process.exit(1);
}
