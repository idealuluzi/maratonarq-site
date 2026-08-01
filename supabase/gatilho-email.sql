-- ============================================================
-- Gatilho: a cada inscrição nova, chama a Edge Function que manda o e-mail.
--
-- Substitui o "Database Webhook" do painel, que falha em projetos novos com
-- 'schema "supabase_functions" does not exist'. Aqui o mesmo efeito é feito
-- direto com pg_net, sem depender daquele schema.
--
-- ANTES DE RODAR: troque TROQUE-PELA-SUA-SENHA pelo mesmo valor que você
-- colocou no secret WEBHOOK_SEGREDO da Edge Function.
--
-- E na Edge Function (Edge Functions > enviar-confirmacao > Settings),
-- DESLIGUE o "Verify JWT". Quem protege a função é o cabeçalho secreto abaixo.
-- ============================================================

create extension if not exists pg_net with schema extensions;

create or replace function public.notificar_inscricao()
returns trigger
language plpgsql
security definer
set search_path = public, extensions, net
as $$
begin
  perform net.http_post(
    url     := 'https://urbzcehpmdkuixcislor.supabase.co/functions/v1/enviar-confirmacao',
    headers := jsonb_build_object(
      'Content-Type',      'application/json',
      'x-webhook-segredo', 'TROQUE-PELA-SUA-SENHA'
    ),
    body    := jsonb_build_object('record', to_jsonb(new))
  );
  return new;
end;
$$;

drop trigger if exists inscricoes_envia_confirmacao on public.inscricoes;

create trigger inscricoes_envia_confirmacao
  after insert on public.inscricoes
  for each row
  execute function public.notificar_inscricao();

-- ============================================================
-- Conferir os envios depois de testar:
--
--   select id, status_code, content, created
--     from net._http_response
--    order by created desc
--    limit 10;
--
-- status_code 200 = e-mail enviado. 401 = o segredo não bate.
-- ============================================================
