# Inscrições — banco e e-mail

Passo a passo do que precisa ser feito no painel do Supabase. Enquanto o item 2
não estiver pronto, o formulário **recusa o envio** e mostra um erro, em vez de
fingir que deu certo.

## 1. Criar a tabela

No painel do Supabase, **SQL Editor** → cole o conteúdo de `schema.sql` → Run.

Isso cria `public.inscricoes` e liga o RLS deixando **só inserção** liberada.
Vale entender o porquê: a chave que vai no site é pública, qualquer visitante
consegue lê-la no código. Com o RLS assim, o máximo que alguém faz com ela é
inserir uma linha — não dá para listar, editar nem apagar inscrições.

## 2. Ligar o site ao banco

**Project Settings → API**, copie os dois valores e coloque em `.env.local` na
raiz do projeto (copie de `.env.example`):

```
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=a-chave-anon
```

Use a chave **anon** / **publishable**. A `service_role` nunca pode entrar aí:
ela ignora o RLS e daria acesso total ao banco para qualquer visitante.

Depois de criar o arquivo, reinicie o `npm run dev` — o Vite só lê as variáveis
na inicialização.

Na hospedagem (Vercel, Netlify…), cadastre as mesmas duas variáveis no painel de
variáveis de ambiente do serviço.

## 3. Ver os inscritos

Painel do Supabase → **Table Editor** → `inscricoes`. Dá para ordenar, filtrar e
exportar em CSV pelo próprio painel.

Para conferências rápidas, no SQL Editor:

```sql
select perfil, count(*) from public.inscricoes group by perfil;
select * from public.inscricoes order by criado_em desc;
```

## 4. E-mail de confirmação

A chave do serviço de e-mail não pode ir para o navegador — qualquer visitante
leria o código e passaria a enviar e-mail em nome do evento. Por isso o envio
acontece numa Edge Function, no servidor.

1. Crie uma conta na [Resend](https://resend.com) e **verifique o domínio**
   `maratonarq.com.br`: Domains → Add Domain, e cadastre no painel do seu
   registrador (Registro.br, ou onde o domínio estiver) os registros DNS que a
   Resend mostrar — são um TXT e alguns CNAME. A verificação costuma levar de
   minutos a algumas horas. Sem domínio verificado o e-mail cai em spam, ou nem
   sai.
2. Faça o deploy da função:

   ```bash
   npx supabase login
   npx supabase link --project-ref SEU-PROJECT-REF
   npx supabase functions deploy enviar-confirmacao
   ```

3. Cadastre os segredos em **Project Settings → Edge Functions → Secrets**:

   | Segredo | Valor |
   |---|---|
   | `RESEND_API_KEY` | a chave da Resend |
   | `EMAIL_REMETENTE` | `MaratonArq <contato@maratonarq.com.br>` |
   | `WEBHOOK_SEGREDO` | uma senha qualquer que você inventar |

4. Crie o gatilho em **Database → Webhooks → Create a new hook**:

   - Tabela: `inscricoes`, evento: **Insert**
   - Tipo: **Supabase Edge Functions** → `enviar-confirmacao`
   - Em HTTP Headers, adicione `x-webhook-segredo` com o mesmo valor do
     `WEBHOOK_SEGREDO`

Enquanto o DNS não propaga, dá para testar usando `onboarding@resend.dev` como
`EMAIL_REMETENTE` — só que ele entrega apenas para o e-mail dono da conta da
Resend. Serve para confirmar que o webhook e a função estão funcionando, não
para valer.

## Um detalhe do formulário

O ramo do arquiteto **não pede e-mail** (é assim no Google Forms original), então
esses inscritos não recebem confirmação — a função registra e segue. Se quiser
que recebam, é preciso adicionar o campo de e-mail nesse caminho.
