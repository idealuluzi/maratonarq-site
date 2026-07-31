import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { DATA } from '../data.js';
import { Logo } from './Brand.jsx';

export default function Header({ onRegister, active }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const solid = scrolled || open;

  return (
    <header
      className="maq-header"
      style={{
        ...S.bar,
        boxShadow: solid ? 'var(--shadow-sm)' : 'none',
        background: solid ? 'rgba(251,248,240,.86)' : 'rgba(251,248,240,0)',
        backdropFilter: solid ? 'blur(10px)' : 'none',
        WebkitBackdropFilter: solid ? 'blur(10px)' : 'none',
        borderBottom: solid ? '1px solid var(--line)' : '1px solid transparent',
      }}
    >
      <a href="#inicio" aria-label="MaratonArq — início" style={{ display: 'block' }}>
        <Logo height={36} />
      </a>

      <nav className="maq-nav" style={S.nav}>
        {DATA.nav.map((n) => (
          <a
            key={n.id}
            href={'#' + n.id}
            className="maq-nav-link"
            style={{ ...S.link, color: active === n.id ? 'var(--ink)' : 'var(--ink-2)' }}
          >
            {n.label}
            {active === n.id && <span style={S.underline} />}
          </a>
        ))}
      </nav>

      <button
        className="maq-header-cta"
        style={S.cta}
        onClick={() => onRegister()}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--gold-700)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--burnt-gold)'; }}
      >
        Inscreva-se
      </button>

      <button
        className="maq-burger"
        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={open}
        style={S.burger}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div style={S.sheet}>
          {DATA.nav.map((n) => (
            <a key={n.id} href={'#' + n.id} style={S.sheetLink} onClick={() => setOpen(false)}>
              {n.label}
            </a>
          ))}
          <button
            style={{ ...S.cta, width: '100%', padding: '14px 24px', marginTop: 4 }}
            onClick={() => { setOpen(false); onRegister(); }}
          >
            Inscreva-se
          </button>
        </div>
      )}
    </header>
  );
}

const S = {
  bar: {
    position: 'sticky', top: 0, zIndex: 40, display: 'flex', alignItems: 'center', gap: 32,
    padding: '16px 40px', transition: 'background .3s var(--ease-out), box-shadow .3s var(--ease-out)',
  },
  nav: { display: 'flex', gap: 28, marginLeft: 'auto' },
  link: {
    fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 500, textDecoration: 'none',
    position: 'relative', paddingBottom: 4, transition: 'color .2s',
  },
  underline: {
    position: 'absolute', left: 0, right: 0, bottom: -1, height: 2,
    background: 'var(--burnt-gold)', borderRadius: 2,
  },
  cta: {
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, letterSpacing: '.08em',
    textTransform: 'uppercase', background: 'var(--burnt-gold)', color: 'var(--ink-on-gold)',
    border: 'none', borderRadius: 'var(--r-pill)', padding: '12px 24px', cursor: 'pointer',
    transition: 'background .2s',
  },
  burger: {
    marginLeft: 'auto', width: 42, height: 42, alignItems: 'center', justifyContent: 'center',
    background: 'transparent', border: '1.5px solid var(--line-strong)', borderRadius: 'var(--r-sm)',
    color: 'var(--ink)', cursor: 'pointer',
  },
  sheet: {
    position: 'absolute', top: '100%', left: 0, right: 0, display: 'flex', flexDirection: 'column',
    gap: 4, padding: '12px 20px 20px', background: 'var(--paper-raised)',
    borderBottom: '1px solid var(--line)', boxShadow: 'var(--shadow-md)',
  },
  sheetLink: {
    fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 500, color: 'var(--ink-2)',
    textDecoration: 'none', padding: '12px 4px', borderBottom: '1px solid var(--line)',
  },
};
