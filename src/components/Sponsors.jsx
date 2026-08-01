import { DATA } from '../data.js';

/* Sem cartão atrás da logo: cada marca flutua direto sobre o fundo da página.
   A cota vira uma etiqueta ao lado da fileira (cor prata/bronze), em vez de
   um título acima dela — organização mais parecida com uma barra de "quem
   apoia" do que com um grid de cartões. */
export default function Sponsors() {
  return (
    <section id="patrocinadores" className="maq-section" style={S.wrap}>
      <div style={S.head}>
        <div style={S.eyebrow}>Quem apoia</div>
        <h2 className="maq-section-title" style={S.title}>Patrocinadores &amp; apoiadores</h2>
      </div>

      <div style={S.tiers}>
        {DATA.sponsorTiers.map((tier) => (
          <div key={tier.key} className="maq-sponsor-tier" style={S.tierRow}>
            <span
              className="maq-sponsor-badge"
              style={{ ...S.badge, color: tier.tone, borderColor: tier.tone }}
            >
              {tier.label}
            </span>
            <div className="maq-sponsor-row" style={S.logos}>
              {tier.companies.map((s, i) => (
                <img
                  key={s.name}
                  src={s.logo}
                  alt={s.name}
                  className="maq-sponsor-logo"
                  style={{ ...S.logo, borderLeft: i > 0 ? '1px solid var(--line-strong)' : 'none' }}
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
  wrap: { maxWidth: 1240, margin: '0 auto', padding: '48px 40px 88px' },
  head: { marginBottom: 40 },
  eyebrow: {
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, letterSpacing: '.22em',
    textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 4,
  },
  title: {
    fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 42, lineHeight: 1.05,
    color: 'var(--ink)', margin: 0,
  },
  tiers: { display: 'flex', flexDirection: 'column', gap: 28 },
  tierRow: { display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' },
  badge: {
    flex: 'none', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 12,
    letterSpacing: '.1em', textTransform: 'uppercase', border: '1.5px solid',
    borderRadius: 'var(--r-pill)', padding: '7px 16px', whiteSpace: 'nowrap',
  },
  logos: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0, flex: 1, minWidth: 0 },
  logo: { height: 44, width: 'auto', maxWidth: 180, objectFit: 'contain', padding: '0 28px' },
};
