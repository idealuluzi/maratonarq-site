import { FileText } from 'lucide-react';

/* Faixa curta logo depois dos lotes: leva ao PDF do edital.
   O arquivo mora em public/ e é servido em /edital-maratonarq-2026.pdf.
   Abre em outra aba (target=_blank) para não tirar a pessoa do site. */
export default function Edital() {
  return (
    <section id="edital" className="maq-section" style={S.wrap}>
      <div style={S.card}>
        <div style={S.eyebrow}>Regras</div>
        <h2 className="maq-section-title" style={S.title}>Edital oficial</h2>
        <p style={S.sub}>
          Critérios de participação, regras do hackathon, premiação e cronograma completo.
        </p>
        <a
          href="/edital-maratonarq-2026.pdf"
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
  wrap: { maxWidth: 1240, margin: '0 auto', padding: '8px 40px 72px' },
  card: {
    maxWidth: 620, marginInline: 'auto', textAlign: 'center',
    background: 'var(--paper-raised)', border: '1px solid var(--line)',
    borderRadius: 'var(--r-xl)', boxShadow: 'var(--shadow-sm)', padding: '40px 32px',
  },
  eyebrow: {
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, letterSpacing: '.22em',
    textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 4,
  },
  title: {
    fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 34, lineHeight: 1.05,
    color: 'var(--ink)', margin: '0 0 12px',
  },
  sub: {
    fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: 16, lineHeight: 1.55,
    color: 'var(--ink-2)', margin: '0 0 26px',
  },
  btn: {
    display: 'inline-flex', alignItems: 'center', gap: 10,
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, letterSpacing: '.06em',
    textTransform: 'uppercase', background: 'var(--burnt-gold)', color: 'var(--ink-on-gold)',
    border: 'none', borderRadius: 'var(--r-pill)', padding: '15px 30px',
    textDecoration: 'none', transition: 'all .25s',
  },
};
