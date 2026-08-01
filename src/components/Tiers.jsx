import { Check } from 'lucide-react';
import { DATA } from '../data.js';
import { Logo, PATTERN_BG } from './Brand.jsx';

export default function Tiers({ onRegister }) {
  return (
    <section id="hackathon" className="maq-section" style={S.wrap}>
      <div style={S.head}>
        <div style={S.eyebrow}>Participe</div>
        <h2 className="maq-section-title" style={S.title}>Garanta sua vaga</h2>
        <p style={S.sub}>{DATA.tiersNote}</p>
      </div>

      <div className="maq-tiers-grid" style={S.grid}>
        {DATA.tiers.map((t) => (
          <div
            key={t.name}
            className="maq-tier-card"
            style={{
              ...S.card,
              background: t.hot ? 'var(--indigo-700)' : 'var(--paper-raised)',
              border: t.hot ? 'none' : '1px solid var(--line)',
              boxShadow: t.hot ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
              transform: t.hot ? 'scale(1.04)' : 'none',
            }}
          >
            {t.hot && <span style={S.popular}>Mais procurado</span>}
            <div style={{ ...S.tname, color: t.hot ? 'var(--light-gold)' : 'var(--ink)' }}>{t.name}</div>
            <div style={{ ...S.price, color: t.hot ? 'var(--beige)' : 'var(--ink)' }}>{t.price}</div>
            <div style={{ ...S.note, color: t.hot ? 'rgba(245,240,227,.6)' : 'var(--ink-3)' }}>{t.note}</div>

            <ul style={S.feats}>
              {t.feats.map((f) => (
                <li key={f} style={{ ...S.feat, color: t.hot ? 'rgba(245,240,227,.9)' : 'var(--ink-2)' }}>
                  <Check
                    size={16}
                    style={{ color: t.hot ? 'var(--light-gold)' : 'var(--burnt-gold)', flex: 'none' }}
                  />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => onRegister(t)}
              style={{
                ...S.cta,
                background: t.hot ? 'var(--burnt-gold)' : 'transparent',
                color: t.hot ? 'var(--ink-on-gold)' : 'var(--ink)',
                border: t.hot ? 'none' : '1.5px solid var(--line-strong)',
              }}
            >
              {t.cta}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Footer() {
  const { contact } = DATA;
  return (
    <footer style={F.wrap}>
      <div style={F.pattern} />
      <div className="maq-footer-inner" style={F.inner}>
        <div style={F.col}>
          {/* Versão bege sólida, de um tom só: dá mais presença sobre o indigo. */}
          <Logo variant="beige" height={40} />
          <p style={F.tag}>
            Um evento de palestras e hackathon para estudantes de arquitetura.
          </p>
          <p style={F.org}>Organização: {contact.org}</p>
        </div>
        <div className="maq-footer-links" style={F.links}>
          <FCol
            title="Evento"
            items={DATA.nav.map((n) => ({ label: n.label, href: '#' + n.id }))}
          />
          <FCol
            title="Contato"
            items={[
              { label: contact.email, href: `mailto:${contact.email}` },
              { label: contact.instagram, href: `https://instagram.com/${contact.instagram.replace('@', '')}` },
              { label: 'Imprensa', href: `mailto:${contact.email}` },
            ]}
          />
        </div>
      </div>
      <div style={F.base}>© {DATA.edition} MaratonArq · {contact.credit}</div>
    </footer>
  );
}

function FCol({ title, items }) {
  return (
    <div>
      <div style={F.ctitle}>{title}</div>
      <ul style={F.list}>
        {items.map((x) => (
          <li key={x.label} style={F.li}>
            <a href={x.href} className="maq-footer-link" style={{ color: 'inherit' }}>{x.label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

const S = {
  wrap: { maxWidth: 1240, margin: '0 auto', padding: '88px 40px' },
  head: { textAlign: 'center', marginBottom: 44, maxWidth: 560, marginInline: 'auto' },
  eyebrow: {
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, letterSpacing: '.22em',
    textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 4,
  },
  title: {
    fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 42, lineHeight: 1.05,
    color: 'var(--ink)', margin: '0 0 14px',
  },
  sub: {
    fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: 17, lineHeight: 1.55,
    color: 'var(--ink-2)', margin: 0,
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22, alignItems: 'center' },
  card: {
    borderRadius: 'var(--r-xl)', padding: '32px 28px', position: 'relative',
    display: 'flex', flexDirection: 'column',
  },
  popular: {
    position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 11, letterSpacing: '.12em',
    textTransform: 'uppercase', background: 'var(--light-gold)', color: 'var(--ink-on-gold)',
    padding: '6px 16px', borderRadius: 'var(--r-pill)', whiteSpace: 'nowrap',
  },
  tname: { fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 26 },
  price: { fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 40, marginTop: 6, lineHeight: 1 },
  note: { fontFamily: 'var(--font-sans)', fontSize: 13, marginTop: 4 },
  feats: {
    listStyle: 'none', padding: 0, margin: '22px 0 26px',
    display: 'flex', flexDirection: 'column', gap: 12,
  },
  feat: { display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-sans)', fontSize: 14.5 },
  cta: {
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, letterSpacing: '.06em',
    textTransform: 'uppercase', borderRadius: 'var(--r-pill)', padding: '14px 20px',
    cursor: 'pointer', marginTop: 'auto',
  },
};

const F = {
  wrap: { position: 'relative', background: 'var(--indigo-900)', overflow: 'hidden' },
  pattern: {
    position: 'absolute', inset: 0, backgroundImage: PATTERN_BG,
    backgroundSize: '260px', opacity: 0.06,
  },
  inner: {
    position: 'relative', maxWidth: 1240, margin: '0 auto', padding: '64px 40px 40px',
    display: 'flex', justifyContent: 'space-between', gap: 48, flexWrap: 'wrap',
  },
  col: { maxWidth: 380 },
  tag: {
    fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: 16, lineHeight: 1.6,
    color: 'rgba(245,240,227,.78)', margin: '18px 0 14px',
  },
  org: { fontFamily: 'var(--font-sans)', fontSize: 13, color: 'rgba(245,240,227,.5)', margin: 0 },
  links: { display: 'flex', gap: 64 },
  ctitle: {
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, letterSpacing: '.16em',
    textTransform: 'uppercase', color: 'var(--light-gold)', marginBottom: 16,
  },
  list: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 11 },
  li: { fontFamily: 'var(--font-sans)', fontSize: 14.5, color: 'rgba(245,240,227,.8)' },
  base: {
    position: 'relative', borderTop: '1px solid rgba(245,240,227,.12)', padding: '20px 40px',
    textAlign: 'center', fontFamily: 'var(--font-sans)', fontSize: 13, color: 'rgba(245,240,227,.5)',
  },
};
