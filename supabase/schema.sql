-- ============================================================
-- MaratonArq — tabela de inscrições
--
-- Rode isto uma vez no SQL Editor do Supabase (painel do projeto).
-- É idempotente: pode rodar de novo sem quebrar nada.
-- ============================================================

create table if not exists public.inscricoes (
  id           uuid primary key default gen_random_uuid(),
  criado_em    timestamptz not null default now(),

  -- comum aos dois caminhos do formulário
  perfil       text not null check (perfil in ('Estudante', 'Arquiteto')),
  nome         text not null check (length(btrim(nome)) > 0),

  -- ramo estudante
  email        text,
  telefone     text,
  universidade text,
  modalidade   text,

  -- ramo arquiteto
  cidade       text,
  descoberta   text,
  escritorio   text,

  -- de qual card a inscrição partiu, quando partiu de um
  lote         text
);

-- O formulário do site exige e-mail do estudante, mas não do arquiteto.
-- Esta checagem garante a mesma regra no banco, para o caso de alguém
-- inserir por fora do site.
alter table public.inscricoes drop constraint if exists inscricoes_estudante_precisa_email;
alter table public.inscricoes add constraint inscricoes_estudante_precisa_email
  check (perfil <> 'Estudante' or (email is not null and length(btrim(email)) > 0));

create index if not exists inscricoes_criado_em_idx on public.inscricoes (criado_em desc);
create index if not exists inscricoes_email_idx      on public.inscricoes (email);

-- ============================================================
-- Segurança
--
-- A chave que vai no site é pública: qualquer visitante consegue lê-la no
-- código. Por isso o RLS libera SÓ a inserção. Não existe política de
-- select/update/delete, então ninguém consegue listar nem alterar inscrições
-- pela API — nem com a chave em mãos.
--
-- Você continua vendo tudo pelo painel do Supabase (Table Editor), que roda
-- por fora do RLS.
-- ============================================================

alter table public.inscricoes enable row level security;

drop policy if exists "qualquer um pode se inscrever" on public.inscricoes;
create policy "qualquer um pode se inscrever"
  on public.inscricoes
  for insert
  to anon, authenticated
  with check (true);

-- ============================================================
-- Conferência rápida (opcional): quantos inscritos, por perfil
--
--   select perfil, count(*) from public.inscricoes group by perfil;
--   select * from public.inscricoes order by criado_em desc;
-- ============================================================
