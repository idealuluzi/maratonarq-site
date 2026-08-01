import { DATA } from '../data.js';

/* Uma fileira por cota, do maior prestígio (Ouro) ao menor (Apoiadores) — a
   logo diminui de cota em cota, que é o sinal visual que costuma acompanhar
   esse tipo de hierarquia de patrocínio. Enquanto uma marca não é confirmada,
   `logo: null` mostra um espaço reservado em vez de a fileira ficar vazia. */
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
              {tier.companies.map((c, i) => (
                <SponsorTile key={`${tier.key}-${i}`} company={c} logoHeight={tier.logoHeight} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SponsorTile({ company, logoHeight }) {
  return (
    <div className="maq-sponsor-tile" style={{ ...S.tile, height: logoHeight + 48 }}>
      {company.logo ? (
        <img
          src={company.logo}
          alt={company.name}
          style={{ ...S.logo, height: logoHeight }}
        />
      ) : (
        <span style={S.placeholder}>{company.name}</span>
      )}
    </div>
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
  tiers: { display: 'flex', flexDirection: 'column', gap: 36 },
  tierLabel: {
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, letterSpacing: '.16em',
    textTransform: 'uppercase', color: 'var(--ink-2)', marginBottom: 16,
  },
  row: { display: 'flex', flexWrap: 'wrap', gap: 16 },
  tile: {
    flex: '1 1 200px', maxWidth: 260, display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'var(--paper-raised)', border: '1px solid var(--line)', borderRadius: 'var(--r-md)',
    padding: '0 24px',
  },
  logo: { width: 'auto', maxWidth: '100%', objectFit: 'contain' },
  placeholder: {
    fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, color: 'var(--ink-3)',
    textAlign: 'center',
  },
};
