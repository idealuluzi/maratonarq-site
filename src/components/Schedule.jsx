import { useState } from 'react';
import { DATA, KIND_COLOR } from '../data.js';

export default function Schedule() {
  const days = DATA.schedule;
  // Abre sempre na sexta, o primeiro dia do evento.
  const [dayIdx, setDayIdx] = useState(0);
  const day = days[dayIdx] ?? days[0];

  return (
    <section id="programacao" className="maq-schedule" style={S.wrap}>
      <div className="maq-schedule-inner" style={S.head}>
        <div style={S.eyebrow}>Três dias</div>
        <h2 className="maq-section-title" style={S.title}>Programação</h2>
      </div>

      <div className="maq-schedule-inner maq-tabs" style={S.tabs} role="tablist">
        {days.map((d, i) => (
          <button
            key={d.short}
            role="tab"
            aria-selected={i === dayIdx}
            onClick={() => setDayIdx(i)}
            style={{
              ...S.tab,
              background: i === dayIdx ? 'var(--burnt-gold)' : 'transparent',
              color: i === dayIdx ? 'var(--ink-on-gold)' : 'var(--ink-2)',
              borderColor: i === dayIdx ? 'var(--burnt-gold)' : 'var(--line-strong)',
            }}
          >
            {d.short}
          </button>
        ))}
      </div>

      <div className="maq-schedule-inner" style={day.tracks ? S.bodyWide : S.body}>
        <div style={S.dayLabel}>{day.label}</div>

        {day.tracks ? (
          <div className="maq-track-grid" style={S.trackGrid}>
            {day.tracks.map((track, i) => (
              <div key={track}>
                <h3 style={S.trackTitle}>{track}</h3>
                <div style={S.list}>
                  {day.items
                    .filter((it) => it.track === undefined || it.track === i)
                    .map((row) => <Row key={row.t + row.title} row={row} />)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={S.list}>
            {day.items.map((row) => <Row key={row.t + row.title} row={row} />)}
          </div>
        )}
      </div>
    </section>
  );
}

function Row({ row }) {
  const revealed = row.revealed !== false;
  const corpo = (
    <>
      <div style={S.rtitle}>{row.title}</div>
      <div style={{ ...S.kind, color: KIND_COLOR[row.kind] }}>{row.kind}</div>
    </>
  );

  return (
    <div className="maq-sch-row" style={S.row}>
      <div style={S.time}>{row.t}</div>
      <div className="maq-sch-bar" style={{ ...S.bar, background: KIND_COLOR[row.kind] }} />
      <div style={S.info}>
        {revealed ? corpo : (
          <>
            <span style={S.srOnly}>Atração ainda não anunciada</span>
            <div style={S.veiled} aria-hidden="true">{corpo}</div>
          </>
        )}
      </div>
      {!revealed && <span style={S.soon}>Em breve</span>}
    </div>
  );
}

const S = {
  wrap: { background: 'var(--paper-sunken)', padding: '88px 0' },
  head: { maxWidth: 880, margin: '0 auto 32px', padding: '0 40px' },
  eyebrow: {
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, letterSpacing: '.22em',
    textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 4,
  },
  title: {
    fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 42, lineHeight: 1.05,
    color: 'var(--ink)', margin: 0,
  },
  tabs: { maxWidth: 880, margin: '0 auto 24px', padding: '0 40px', display: 'flex', gap: 12 },
  tab: {
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, padding: '11px 24px',
    borderRadius: 'var(--r-pill)', border: '1.5px solid', cursor: 'pointer', transition: 'all .2s',
  },
  // Título e abas ficam sempre no contêiner de 880. Só o bloco de conteúdo
  // abre para 1240 (a largura das outras seções) nos dias com duas trilhas,
  // para as colunas não ficarem espremidas.
  body: { maxWidth: 880, margin: '0 auto', padding: '0 40px' },
  bodyWide: { maxWidth: 1240, margin: '0 auto', padding: '0 40px' },
  dayLabel: {
    fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 14, color: 'var(--ink-2)',
    marginBottom: 20,
  },
  trackGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, alignItems: 'start' },
  trackTitle: {
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, letterSpacing: '.16em',
    textTransform: 'uppercase', color: 'var(--ink)', margin: '0 0 16px',
    paddingBottom: 10, borderBottom: '2px solid var(--burnt-gold)',
  },
  list: { display: 'flex', flexDirection: 'column', gap: 12 },
  row: {
    display: 'flex', alignItems: 'stretch', gap: 18, background: 'var(--paper-raised)',
    border: '1px solid var(--line)', borderRadius: 'var(--r-md)', padding: '18px 22px',
    boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
  },
  veiled: { filter: 'blur(6px)', userSelect: 'none', pointerEvents: 'none' },
  soon: {
    alignSelf: 'center', flex: 'none', fontFamily: 'var(--font-sans)', fontWeight: 600,
    fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-3)',
    border: '1px solid var(--line-strong)', borderRadius: 'var(--r-pill)',
    padding: '4px 10px', whiteSpace: 'nowrap',
  },
  srOnly: {
    position: 'absolute', width: 1, height: 1, padding: 0, margin: -1,
    overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0,
  },
  time: {
    fontFamily: 'var(--font-mono)', fontSize: 15, color: 'var(--ink-2)', width: 56,
    flex: 'none', paddingTop: 2,
  },
  bar: { width: 4, borderRadius: 2, flex: 'none' },
  info: { flex: 1, minWidth: 0, position: 'relative' },
  rtitle: { fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 17, color: 'var(--ink)' },
  kind: {
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12, letterSpacing: '.1em',
    textTransform: 'uppercase', marginTop: 6,
  },
};
