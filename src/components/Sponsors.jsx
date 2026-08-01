import { DATA } from '../data.js';

/* Cada cota vira uma "zona" com leve tingimento da cor da cota (prata/bronze)
   e cantos arredondados — a etiqueta é só texto simples no canto superior
   esquerdo, sem pílula. As logos dentro se alternam de altura (staggered),
   em vez de ficarem todas alinhadas numa linha reta — dá o efeito de
   composição solta em vez de grid rígido. */
export default function Sponsors() {
  return (
    <section id="patrocinadores" className="maq-sponsors" style={S.wrap}>
      <div className="maq-sponsors-inner" style={S.head}>
        <div style={S.eyebrow}>Nossos parceiros</div>
        <h2 className="maq-section-title" style={S.title}>Patrocinadores &amp; apoiadores</h2>
      </div>

      <div className="maq-sponsors-inner" style={S.tiers}>
        {DATA.sponsorTiers.map((tier) => (
          <div
            key={tier.key}
            className="maq-sponsor-tier"
            style={{ ...S.tierBox, background: `${tier.tone}1a` }}
          >
            <span style={{ ...S.label, color: tier.tone }}>{tier.label}</span>
            <div className="maq-sponsor-row" style={S.logos}>
              {tier.companies.map((s, i) => (
                <img
                  key={s.name}
                  src={s.logo}
                  alt={s.name}
                  className="maq-sponsor-logo"
                  style={{
                    ...S.logo,
                    height: s.size ?? S.logo.height,
                    maxWidth: s.maxWidth ?? S.logo.maxWidth,
                    // Desloca a logo do meio um pouco pra baixo das vizinhas —
                    // é isso que quebra o alinhamento em linha reta.
                    alignSelf: i % 2 === 1 ? 'flex-end' : 'flex-start',
                    marginTop: i % 3 === 1 ? 20 : 0,
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const S = {
  // Tom diferente do resto da página — mesmo token usado na Programação —
  // para a seção se destacar. Só o fundo sangra: o conteúdo continua
  // centrado nos mesmos 1240px das outras seções (ver .maq-sponsors-inner).
  wrap: { background: 'var(--paper-sunken)', padding: '48px 0 56px' },
  head: { maxWidth: 1240, margin: '0 auto 40px', padding: '0 40px' },
  eyebrow: {
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, letterSpacing: '.22em',
    textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 4,
  },
  title: {
    fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 42, lineHeight: 1.05,
    color: 'var(--ink)', margin: 0,
  },
  tiers: {
    maxWidth: 1240, margin: '0 auto', padding: '0 40px',
    display: 'flex', flexDirection: 'column', gap: 20,
  },
  tierBox: {
    position: 'relative', borderRadius: 'var(--r-lg)', padding: '46px 32px 32px',
  },
  label: {
    position: 'absolute', top: 18, left: 24, fontFamily: 'var(--font-sans)', fontWeight: 700,
    fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase',
  },
  logos: { display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap', gap: 36, minHeight: 64 },
  logo: { width: 'auto', maxWidth: 180, objectFit: 'contain', height: 44 },
};
