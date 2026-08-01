import { Calendar, MapPin, Ticket } from 'lucide-react';
import { DATA } from '../data.js';
import { LogoMark } from './Brand.jsx';

export default function Hero({ onRegister }) {
  return (
    <section id="inicio" style={S.outer}>
      <div style={S.pattern} aria-hidden="true" />
      <div className="maq-hero" style={S.wrap}>
        <div style={S.left}>
        <div style={S.eyebrow}>MaratonArq · {DATA.edition}</div>
        <h1 className="maq-hero-title" style={S.title}>
          Uma experiência que conecta aprendizado, inovação e mercado.
        </h1>
        <p style={S.lead}>{DATA.lead}</p>

        <div style={S.facts}>
          <Fact icon={Calendar} text={DATA.dates} />
          <Fact icon={MapPin} text={DATA.city} />
          <Fact icon={Ticket} text={DATA.ticketNote} />
        </div>

        <div className="maq-hero-actions" style={S.actions}>
          <button
            style={S.primary}
            onClick={() => onRegister()}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--gold-700)';
              e.currentTarget.style.boxShadow = 'var(--shadow-gold)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--burnt-gold)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Inscreva-se
          </button>
          <a href="#programacao" style={S.ghost}>Ver programação</a>
        </div>
      </div>

        <div className="maq-hero-symbol" style={S.right}>
          <LogoMark variant="indigo" fluid style={{ maxWidth: 520, margin: '0 auto' }} />
        </div>
      </div>
    </section>
  );
}

function Fact({ icon: Icon, text }) {
  return (
    <span style={S.fact}>
      <Icon size={17} style={{ color: 'var(--accent)', flex: 'none' }} />
      {text}
    </span>
  );
}

const S = {
  // Faixa de largura total: só serve para a padronagem sangrar até as bordas.
  outer: { position: 'relative', overflow: 'hidden' },
  // Padronagem oficial da marca atrás do hero inteiro, bem discreta.
  // Usamos a variante de traço indigo: o arquivo "Branco" tem traço #f5f0e3,
  // exatamente a cor do fundo bege daqui, e ficaria invisível. A versão branca
  // está em public/assets para quando o fundo for escuro.
  pattern: {
    position: 'absolute', inset: 0, backgroundImage: "url('/assets/padronagem-01-indigo.svg')",
    backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
    opacity: 0.03, pointerEvents: 'none',
  },
  wrap: {
    position: 'relative',
    display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: 56, alignItems: 'center',
    padding: '64px 40px 88px', maxWidth: 1240, margin: '0 auto',
  },
  left: { display: 'flex', flexDirection: 'column' },
  eyebrow: {
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, letterSpacing: '.22em',
    textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 20,
  },
  title: {
    fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(40px,4.4vw,60px)',
    lineHeight: 1.12, color: 'var(--ink)', margin: '0 0 30px', paddingBottom: 14,
  },
  em: { fontStyle: 'italic', color: 'var(--burnt-gold)' },
  lead: {
    fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: 19, lineHeight: 1.6,
    color: 'var(--ink-2)', margin: '0 0 28px', maxWidth: 520,
  },
  facts: { display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 34 },
  fact: {
    display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-sans)',
    fontSize: 15, color: 'var(--ink-2)',
  },
  actions: { display: 'flex', gap: 14, alignItems: 'center' },
  primary: {
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, letterSpacing: '.06em',
    textTransform: 'uppercase', background: 'var(--burnt-gold)', color: 'var(--ink-on-gold)',
    border: 'none', borderRadius: 'var(--r-pill)', padding: '16px 32px', cursor: 'pointer',
    transition: 'all .25s',
  },
  ghost: {
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, letterSpacing: '.06em',
    textTransform: 'uppercase', background: 'transparent', color: 'var(--ink)', textDecoration: 'none',
    border: '1.5px solid var(--line-strong)', borderRadius: 'var(--r-pill)', padding: '14px 30px',
  },
  right: { display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' },
};
