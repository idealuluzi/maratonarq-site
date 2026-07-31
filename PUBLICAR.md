# Publicar o site

O site é estático: `npm run build` gera a pasta `dist/`, e é só ela que vai para
o ar. Qualquer hospedagem de site estático serve.

## O passo que não pode ser esquecido

As credenciais do Supabase **não** vão junto no build a partir do `.env.local` —
esse arquivo fica só na sua máquina, fora do controle de versão. Na hospedagem,
você precisa cadastrar as mesmas duas variáveis no painel do serviço:

```
VITE_SUPABASE_URL=https://urbzcehpmdkuixcislor.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Sem isso o site sobe bonito, mas o formulário recusa toda inscrição com "não
está conectado ao banco". Depois de cadastrar, é preciso **refazer o deploy**: o
Vite lê essas variáveis na hora de compilar, não na hora que o visitante acessa.

## Opção A — Netlify sem GitHub (mais rápido)

Não precisa de repositório nem linha de comando.

1. `npm run build` aqui no projeto.
2. Entre em [app.netlify.com/drop](https://app.netlify.com/drop) e **arraste a
   pasta `dist/`** para a página.
3. O site sobe num endereço tipo `algum-nome.netlify.app`.
4. Em Site configuration → Environment variables, cadastre as duas variáveis
   acima, rode `npm run build` de novo e arraste a `dist/` outra vez.

O incômodo: cada atualização é um novo arrastar de pasta.

## Opção B — Vercel com GitHub (melhor para atualizar)

Assim cada mudança que você enviar ao repositório publica sozinha.

1. Crie o repositório e envie o projeto:

   ```bash
   git init
   git add .
   git commit -m "Site do MaratonArq 2026"
   gh repo create maratonarq-site --private --source=. --push
   ```

   O `.gitignore` já protege o `.env.local`, então a chave não sobe.

2. Em [vercel.com/new](https://vercel.com/new), importe o repositório. Ele
   detecta Vite sozinho — não mexa em build command nem output directory.
3. Ainda na tela de importação, em **Environment Variables**, cadastre as duas
   variáveis. Fazendo isso agora, o primeiro deploy já sai funcionando.

## Apontar o maratonarq.com.br

Com o site no ar, some o endereço provisório pelo seu domínio.

1. No painel da hospedagem (Vercel: Settings → Domains; Netlify: Domain
   management), adicione `maratonarq.com.br` e `www.maratonarq.com.br`.
2. O serviço vai mostrar os registros DNS a cadastrar — normalmente um `A`
   apontando para um IP e um `CNAME` para o `www`.
3. Cadastre esses registros no **Registro.br**, em Painel → seu domínio →
   Editar zona DNS.
4. Espere a propagação. Costuma levar de minutos a algumas horas.

O certificado HTTPS é emitido automaticamente pelos três serviços assim que o
domínio resolve. Não precisa comprar nada.

## Depois de publicar, confira

- Abrir o site pelo endereço final e fazer uma inscrição de teste.
- Ver a linha aparecer no **Table Editor** do Supabase.
- Apagar a linha de teste.

Se a inscrição falhar com "não está conectado ao banco", é porque as variáveis
de ambiente não foram cadastradas ou o deploy não foi refeito depois delas.
