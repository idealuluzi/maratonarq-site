# MaratonArq — site do evento

Site de uma página (marketing + inscrição) do MaratonArq, gerado a partir do
UI kit `ui_kits/event-site` do projeto de design no Claude Design.

## Rodar

```bash
npm install
npm run dev     # http://localhost:5180
```

Para gerar a versão de produção:

```bash
npm run build   # sai em dist/
npm run preview # confere o build localmente
```

A pasta `dist/` é estática — sobe direto em Vercel, Netlify, GitHub Pages ou
qualquer hospedagem comum. O passo a passo, incluindo as variáveis de ambiente e
como apontar o `maratonarq.com.br`, está em [`PUBLICAR.md`](PUBLICAR.md).

## Onde mexer

| Quero mudar | Arquivo |
|---|---|
| Datas, palestrantes, programação, lotes, contato | `src/data.js` |
| Cores, fontes, sombras, espaçamentos (tokens da marca) | `src/styles/colors_and_type.css` |
| Comportamento em telas menores | `src/styles/global.css` |
| Uma seção específica | `src/components/*.jsx` |

Quase todo o texto do site sai de `src/data.js` — dá para atualizar a edição
inteira sem tocar em componente.

## Tipografia

A tipografia da marca é **Fields Display** (principal, títulos) e **Futura PT**
(secundária, textos e interface), e está **ativa**: os arquivos licenciados pelo
cliente foram convertidos para `.woff2` em `public/fonts/` e declarados em
`src/styles/fonts.css`. Fields Display cobre os pesos 400–900; Futura PT,
300–800 com os oblíquos de 500 a 800.

As duas famílias são comerciais (Klim e Adobe) — **não redistribuir** fora deste
projeto. Cormorant Garamond e Jost continuam no fim das pilhas de
`colors_and_type.css`, como reserva caso um woff2 falhe.

Só baixa o que a página usa: hoje Fields Display 600 e Futura PT 300/400/500/600,
mais o Demi Oblique para os itálicos. Cerca de 240 KB.

Duas lacunas nos arquivos recebidos: Fields Display não tem itálico, então o
itálico do hero ("maratona") é inclinado pelo navegador; e Futura PT não tem
Light nem Book Oblique, então itálico em peso 300/400 cai no Demi Oblique.

Fields Display é bastante mais larga que a Cormorant com que o kit foi
desenhado. Por isso `global.css` tem overrides de corpo em telas pequenas
(`.maq-hero-title`, `.maq-section-title`, `.maq-stat-n`) — sem eles o título do
hero quebrava em quatro linhas no celular. Se mexer nesses tamanhos, remeça nas
larguras pequenas.

## Imagens da marca

A **logo oficial** está embutida como SVG em `src/components/Brand.jsx`, em duas
formas: `Logo` (símbolo + lettering, usado no header e no rodapé) e `LogoMark`
(só o símbolo, usado no painel do hero e na lateral do modal). Cada uma aceita
`variant="brand"` (cores originais) ou `variant="white"` (versão clara para
fundos escuros), então não é preciso um arquivo separado para o rodapé.

O arquivo original está guardado em `public/assets/logo-horizontal.svg` como
referência — o site não o carrega. Se trocar a logo, troque nos dois lugares.

A **padronagem** oficial está em `public/assets/`, em duas versões:
`padronagem-01-branco.svg` (traço `#f5f0e3`, como veio da marca — para fundo
escuro) e `padronagem-01-indigo.svg`, gerada trocando a cor do traço, porque a
branca é exatamente a cor do papel bege e desapareceria. A indigo entra atrás do
hero com opacidade bem baixa — o valor exato está em `Hero.jsx` (`S.pattern`).

Pendência: o `PATTERN_BG` de `Brand.jsx` ainda é um tile de arcos provisório,
usado nos cards de palestrante, na lateral do modal de inscrição e como marca
d'água do rodapé. Vale trocar pela padronagem real (a versão branca serve nesses
três, que têm fundo escuro ou dourado).

## Estrutura

```
index.html               entrada do Vite (título, meta tags, fontes)
src/main.jsx             monta o React
src/App.jsx              composição da página + scroll-spy do menu
src/data.js              todo o conteúdo
src/components/
  Brand.jsx              logo oficial (SVG embutido) + padronagem
  Header.jsx             topo fixo, menu âncora, menu mobile
  Hero.jsx               chamada principal + painel com a padronagem
  Speakers.jsx           faixa de números + cards de palestrantes
  Schedule.jsx           programação com abas por dia
  Tiers.jsx              lotes de inscrição + rodapé
  RegisterModal.jsx      modal de inscrição em 2 passos
src/styles/
  fonts.css              @font-face das fontes da marca (ver "Tipografia")
  colors_and_type.css    tokens da marca (vindo do design)
  global.css             reset, base e breakpoints
```

## Diferenças em relação ao UI kit

O kit original rodava com React via CDN e Babel no navegador, componentes
pendurados em `window` e layout só de desktop. Aqui:

- virou projeto Vite com módulos ES e build de produção;
- os ícones passaram de `lucide` por CDN para o pacote `lucide-react`;
- foram adicionados breakpoints (tablet/celular) e menu mobile;
- o modal ganhou fechar com Esc, trava de rolagem do fundo, `<form>` de
  verdade e foco no primeiro campo;
- clicar no botão de um lote já abre o modal com aquela modalidade escolhida.

## Inscrições

As inscrições vão para uma tabela no **Supabase**, e cada uma dispara um e-mail
de confirmação. O passo a passo da configuração está em
[`supabase/LEIA-ME.md`](supabase/LEIA-ME.md); o resumo:

- `supabase/schema.sql` cria a tabela e liga o RLS deixando só inserção.
- `.env.local` guarda a URL e a chave anon do projeto (modelo em `.env.example`).
- Os inscritos aparecem no **Table Editor** do painel do Supabase, com exportação
  em CSV.
- `supabase/functions/enviar-confirmacao/` é a Edge Function que manda o e-mail,
  disparada por um Database Webhook a cada inscrição.

O site fala com o Supabase pela API REST, sem o pacote `@supabase/supabase-js`:
para um único insert o SDK somava mais de 200 KB ao bundle, mais que o site
inteiro.

**Enquanto `.env.local` não existir, o formulário recusa o envio** e mostra um
erro. Isso é proposital: é melhor o inscrito saber que falhou do que ver
"confirmado" e a inscrição se perder.

## Ainda não existe

- O ramo do arquiteto não pede e-mail (é assim no formulário original), então
  esses inscritos não recebem confirmação.
- Não há área administrativa no site: a consulta é pelo painel do Supabase.
