import { FileText } from 'lucide-react';

/* Faixa cheia (sangra de ponta a ponta) logo depois dos lotes: texto à
   esquerda, botão do edital à direita. O PDF mora em public/ e é servido
   em "/EDITAL Maratonarq 2026.pdf"; abre em outra aba. */
export default function Edital() {
  return (
    <section id="edital" style={S.band}>
      <div className="maq-edital" style={S.inner}>
        <div style={S.text}>
          <div style={S.eyebrow}>Regras</div>
          <h2 className="maq-section-title" style={S.title}>Edital oficial</h2>
          <p style={S.sub}>
            Critérios de participação, regras do hackathon, premiação e cronograma completo.
          </p>
        </div>
        <a
          href="/EDITAL%20Maratonarq%202026.pdf"
          target="_blank"
          rel="noopener"
          style={S.btn}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--gold-700)';
            e.currentTarget.style.boxShadow = 'var(--shadow-gold)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--burnt-gold)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <FileText size={18} style={{ flex: 'none' }} />
          Ler o edital
        </a>
      </div>
    </section>
  );
}

const S = {
  band: { background: 'var(--indigo-700)' },
  inner: {
    maxWidth: 1240, margin: '0 auto', padding: '40px 40px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32,
  },
  text: { maxWidth: 620 },
  eyebrow: {
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, letterSpacing: '.22em',
    textTransform: 'uppercase', color: 'var(--light-gold)', marginBottom: 4,
  },
  title: {
    fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 32, lineHeight: 1.05,
    color: 'var(--beige)', margin: '0 0 8px',
  },
  sub: {
    fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: 16, lineHeight: 1.55,
    color: 'rgba(245,240,227,.72)', margin: 0,
  },
  btn: {
    flex: 'none',
    display: 'inline-flex', alignItems: 'center', gap: 10,
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, letterSpacing: '.06em',
    textTransform: 'uppercase', background: 'var(--burnt-gold)', color: 'var(--ink-on-gold)',
    border: 'none', borderRadius: 'var(--r-pill)', padding: '15px 30px',
    textDecoration: 'none', transition: 'all .25s',
  },
};
