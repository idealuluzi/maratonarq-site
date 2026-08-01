// Conteúdo do site. Veio do data.js do UI kit — é aqui que você troca
// datas, palestrantes, programação e lotes de inscrição.
export const DATA = {
  edition: '2026',
  dates: '11 – 13 SET',
  // Estudante participa dos três dias; arquiteto/profissional só do dia 12.
  // Usado na tela de sucesso do modal e no e-mail de confirmação.
  datesPorPerfil: {
    Estudante: '11 – 13 SET',
    Arquiteto: '12 SET',
  },
  city: 'UDESC - Laguna',
  ticketNote: 'Inscrições gratuitas',
  lead:
    'Três dias de imersão, um hackathon de 24 horas para os estudantes colocarem '
    + 'em prática suas melhores ideias e construirem oportunidades imperdíveis '
    + 'para seu futuro.',
  tiersNote:
    'Inscrições gratuitas para TODOS. O hackathon de 24h tem vagas limitadas, '
    + 'então garante enquanto ainda dá tempo!',
  stats: [
    { n: '3', l: 'dias' },
    { n: '9', l: 'palestras' },
    { n: '24h', l: 'de hackathon' },
    { n: '+R$1600', l: 'em prêmios' },
  ],
  // A ordem aqui é a ordem do menu (e do bloco "Evento" no rodapé),
  // e segue a ordem em que as seções aparecem na página.
  nav: [
    { id: 'inicio', label: 'Início' },
    { id: 'palestrantes', label: 'Palestrantes' },
    { id: 'programacao', label: 'Programação' },
    { id: 'hackathon', label: 'Hackathon' },
    { id: 'patrocinadores', label: 'Patrocinadores' },
  ],
  // `revealed: false` deixa o card borrado, com a etiqueta "Em breve".
  // O texto desses cards é só enchimento para dar volume ao borrão — o nome
  // real entra junto com `revealed: true`, quando for anunciado.
  speakers: [
    {
      revealed: true,
      name: 'Ana Sapata',
      role: '',
      topic: 'Paisagismo Urbano - jardim para todos: Um convite para viver a cidade',
      instagram: '@anasapata.arquitetura',
      tag: 'Palestra',
      photo: '/assets/palestrantes/ana-sapata.jpg',
      // Enquadramento do retrato dentro do card (object-position). O primeiro
      // valor corre na horizontal, o segundo na vertical: em foto de corpo
      // inteiro, baixar o segundo número sobe o rosto.
      photoPosition: '45% 48%',
    },
    {
      revealed: true,
      name: 'Giovani Bonetti + Leandro Rotolo',
      role: '',
      topic: 'Construindo uma carreira e escritório bem consolidados nos dias atuais',
      instagram: '@ark7arquitetos',
      tag: 'Palestra',
      photo: '/assets/palestrantes/bonetti-rotolo.jpg',
      photoPosition: '50% 30%',
    },
    { revealed: false, name: 'Nome a anunciar', role: 'Convidado do MaratonArq', topic: 'Tema a anunciar' },
    { revealed: false, name: 'Nome a anunciar', role: 'Convidado do MaratonArq', topic: 'Tema a anunciar' },
    { revealed: false, name: 'Nome a anunciar', role: 'Convidado do MaratonArq', topic: 'Tema a anunciar' },
    { revealed: false, name: 'Nome a anunciar', role: 'Convidado do MaratonArq', topic: 'Tema a anunciar' },
    { revealed: false, name: 'Nome a anunciar', role: 'Convidado do MaratonArq', topic: 'Tema a anunciar' },
    { revealed: false, name: 'Nome a anunciar', role: 'Convidado do MaratonArq', topic: 'Tema a anunciar' },
    { revealed: false, name: 'Nome a anunciar', role: 'Convidado do MaratonArq', topic: 'Tema a anunciar' },
    { revealed: false, name: 'Nome a anunciar', role: 'Convidado do MaratonArq', topic: 'Tema a anunciar' },
  ],
  // Um dia pode ter duas trilhas em paralelo. Quando `tracks` existe, o dia
  // vira dois blocos lado a lado: um item com `track: 0|1` aparece só no bloco
  // correspondente, e item sem `track` é sessão conjunta, repetida nos dois.
  //
  // `revealed: false` borra o nome da sessão e marca "Em breve". O horário e a
  // cor da barra continuam nítidos, então a grade do dia segue legível.
  // Logística (abertura, almoço, coffee break) fica sempre revelada: não há
  // mistério a fazer ali.
  schedule: [
    {
      short: 'Sex · 11',
      label: 'Sexta-feira, 11 de setembro',
      items: [
        { t: '14h', title: 'Giovani Bonetti + Leandro Rotolo', kind: 'palestra' },
        { t: '15h30', title: 'Coffee break + conversa', kind: 'evento' },
        { t: '16h', title: 'Glória Cabral', kind: 'palestra', revealed: false },
      ],
    },
    {
      short: 'Sáb · 12',
      label: 'Sábado, 12 de setembro',
      tracks: ['Para estudantes', 'Para arquitetos'],
      items: [
        { t: '09h', title: 'Abertura', kind: 'evento' },
        { t: '09h30', title: 'Ana Sapata', kind: 'palestra' },
        { t: '10h30', title: 'JA8 Arquitetura', kind: 'palestra', track: 0, revealed: false },
        { t: '11h', title: 'Terraço Paisagismo', kind: 'palestra', track: 1, revealed: false },
        { t: '11h30', title: 'Contextualização + tema', kind: 'hackathon', track: 0 },
        { t: '12h30', title: 'Almoço', kind: 'evento' },
        { t: '14h', title: 'Renderização REDRAW', kind: 'workshop', revealed: false },
        { t: '14h30', title: 'Orientações do hackathon', kind: 'hackathon', track: 0, revealed: false },
        { t: '14h30', title: 'Como gerenciar um negócio', kind: 'palestra', track: 1, revealed: false },
        { t: '15h30', title: 'Coffee break', kind: 'evento' },
        { t: '16h', title: 'Laís', kind: 'palestra', track: 1, revealed: false },
        { t: '17h', title: 'Lyandra', kind: 'palestra', track: 1, revealed: false },
      ],
    },
    {
      short: 'Dom · 13',
      label: 'Domingo, 13 de setembro',
      items: [
        { t: '11h30', title: 'Pitch + avaliação', kind: 'hackathon' },
        { t: '12h', title: 'Divulgação dos vencedores + agradecimentos', kind: 'evento' },
      ],
    },
  ],
  tiers: [
    // `short` é o rótulo curto usado nos botões de modalidade do modal, onde o
    // nome inteiro não caberia.
    {
      name: 'Estudante: Palestras',
      short: 'Palestras',
      // Pré-preenche o modal quando a inscrição parte deste card.
      perfil: 'Estudante', modalidade: 'Apenas das palestras',
      price: 'Gratuito', note: 'Com carteirinha de estudante',
      feats: [
        'Acesso a todas as palestras',
        'Certificado digital',
        'Créditos de evento para validar',
      ],
      cta: 'Garantir vaga', hot: false,
    },
    {
      name: 'Estudante: Palestras + Hackathon',
      short: 'Palestras + Hackathon',
      perfil: 'Estudante', modalidade: 'Das palestras + Hackathon',
      price: 'Gratuito', note: 'Vagas limitadas por equipe',
      feats: [
        'Tudo das palestras',
        'Participação no hackathon 24h',
        'Créditos de evento para validar',
        'Kit com brindes exclusivos',
        'Oportunidade de networking com profissionais da área',
        'Concorre à premiação',
      ],
      cta: 'Inscrever-se', hot: true,
    },
    {
      name: 'Profissional: Palestras',
      short: 'Profissional',
      perfil: 'Arquiteto',
      price: 'Gratuito', note: 'Arquitetos & escritórios',
      feats: [
        'Acesso a todas as palestras',
        'Certificado digital',
        'Área de networking',
        'Contato com potenciais estagiários',
      ],
      cta: 'Garantir vaga', hot: false,
    },
  ],
  // Uma fileira por cota, só as que já têm patrocinador — nada de espaço
  // vazio para cota sem ninguém ainda. Novo patrocinador: salve o arquivo em
  // public/assets/patrocinadores/ e adicione o item na cota certa (ou crie
  // uma cota nova, se for o caso).
  sponsorTiers: [
    {
      key: 'prata', label: 'Cota Prata', tone: '#9AA5B1',
      companies: [
        { name: 'Donata Brazilian Stones', logo: '/assets/patrocinadores/donata.png' },
        { name: 'Redraw', logo: '/assets/patrocinadores/redraw.png' },
        { name: 'Metalco', logo: '/assets/patrocinadores/metalco.png' },
      ],
    },
    {
      key: 'bronze', label: 'Cota Bronze', tone: '#B87333',
      companies: [
        { name: 'Globo Portas', logo: '/assets/patrocinadores/globo-portas.png' },
      ],
    },
  ],
  contact: {
    email: 'contato@maratonarq.com.br',
    instagram: '@maratonarq.oficial',
    org: 'iDealizejr — Empresa Júnior de Arquitetura e Urbanismo',
    // Assinatura da linha de copyright, no rodapé do rodapé.
    credit: 'iDealizejr',
  },
};

export const KIND_COLOR = {
  keynote: 'var(--indigo-700)',
  palestra: 'var(--burnt-gold)',
  workshop: 'var(--sober-blue)',
  hackathon: 'var(--gold-700)',
  evento: 'var(--ink-3)',
};

export default DATA;
