/* ============================================================
   Gravação das inscrições no Supabase.

   Usa a API REST direto, sem o pacote @supabase/supabase-js: o site só
   precisa inserir uma linha, e o SDK completo somava mais de 200 KB ao
   bundle — mais que o site inteiro.

   As variáveis ficam em .env.local. A chave anon é pública por natureza:
   vai embutida no site e qualquer visitante consegue lê-la. Quem protege os
   dados é o RLS (ver supabase/schema.sql), que só permite inserir — não dá
   para listar nem alterar inscrições com ela. A chave `service_role` NUNCA
   pode aparecer aqui, porque ignora o RLS.
   ============================================================ */

const url = import.meta.env.VITE_SUPABASE_URL;
// O Supabase renomeou a chave pública de "anon" para "publishable". Aceitamos
// os dois nomes para não quebrar conforme a idade do projeto.
const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  ?? import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfigurado = Boolean(url && anonKey);

if (!supabaseConfigurado && import.meta.env.DEV) {
  console.warn(
    '[MaratonArq] Supabase não configurado: copie .env.example para .env.local '
    + 'e preencha VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY. '
    + 'Enquanto isso o formulário recusa o envio em vez de fingir sucesso.',
  );
}

const limpo = (v) => {
  const s = String(v ?? '').trim();
  return s === '' ? null : s;
};

/** Grava uma inscrição. Devolve { ok: true } ou { ok: false, erro }. */
export async function salvarInscricao(dados) {
  if (!supabaseConfigurado) {
    return { ok: false, erro: 'O formulário ainda não está conectado ao banco.' };
  }

  const linha = {
    perfil: dados.perfil,
    nome: limpo(dados.nome),
    email: limpo(dados.email),
    telefone: limpo(dados.telefone),
    universidade: limpo(dados.universidade),
    modalidade: limpo(dados.modalidade),
    cidade: limpo(dados.cidade),
    descoberta: limpo(dados.descoberta),
    escritorio: limpo(dados.escritorio),
    lote: limpo(dados.lote),
  };

  try {
    const resposta = await fetch(`${url}/rest/v1/inscricoes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(linha),
    });

    if (!resposta.ok) {
      const detalhe = await resposta.text().catch(() => '');
      console.error('[MaratonArq] Supabase recusou a inscrição:', resposta.status, detalhe);
      return { ok: false, erro: 'Não conseguimos registrar sua inscrição. Tente de novo.' };
    }
    return { ok: true };
  } catch (e) {
    // Rede fora do ar, DNS, bloqueio de extensão…
    console.error('[MaratonArq] falha de rede ao gravar inscrição:', e);
    return { ok: false, erro: 'Sem conexão com o servidor. Verifique sua internet e tente de novo.' };
  }
}
