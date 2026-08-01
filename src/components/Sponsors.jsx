import { DATA } from '../data.js';

// Uma fileira por cota — só as que já têm patrocinador confirmado.
export default function Sponsors() {
  return (
    <section id="patrocinadores" className="maq-section" style={S.wrap}>
      <div style={S.head}>
        <div style={S.eyebrow}>Quem apoia</div>
        <h2 className="maq-section-title" style={S.title}>Patrocinadores &amp; apoiadores</h2>
      </div>

      <div style={S.tiers}>
        {DATA.sponsorTiers.map((tier) => (
          <div key={tier.key}>
            <div style={S.tierLabel}>{tier.label}</div>
            <div className="maq-sponsor-row" style={S.row}>
              {tier.companies.map((s) => (
                <div key={s.name} className="maq-sponsor-tile" style={S.tile}>
                  {s.logo ? (
                    <img src={s.logo} alt={s.name} style={S.logo} />
                  ) : (
                    <span style={S.placeholder}>{s.name}</span>
                  )}
                </div>
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
  tiers: { display: 'flex', flexDirection: 'column', gap: 32 },
  tierLabel: {
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, letterSpacing: '.16em',
    textTransform: 'uppercase', color: 'var(--ink-2)', marginBottom: 14,
  },
  row: { display: 'flex', flexWrap: 'wrap', gap: 16 },
  tile: {
    flex: '1 1 220px', maxWidth: 280, height: 120, display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    // Branco puro, e não o bege da página: a logo da Metalco vem com fundo
    // branco sólido (não é PNG transparente) e um card bege deixaria um
    // retângulo visível atrás dela.
    background: '#fff', border: '1px solid var(--line)', borderRadius: 'var(--r-md)',
    padding: '20px 28px',
  },
  logo: { width: '100%', height: '100%', objectFit: 'contain' },
  placeholder: {
    fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, color: 'var(--ink-3)',
    textAlign: 'center',
  },
};
