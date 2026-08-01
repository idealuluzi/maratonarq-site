import { useLayoutEffect, useRef, useState } from 'react';
import { Instagram } from 'lucide-react';
import { DATA } from '../data.js';
import { PATTERN_BG } from './Brand.jsx';

export function StatsBand() {
  return (
    <section className="maq-stats" style={S.band}>
      {DATA.stats.map((s, i) => (
        <div
          key={s.l}
          className="maq-stat"
          style={{ ...S.item, borderRight: i === DATA.stats.length - 1 ? 'none' : S.item.borderRight }}
        >
          <div className="maq-stat-n" style={S.n}>{s.n}</div>
          <div style={S.l}>{s.l}</div>
        </div>
      ))}
    </section>
  );
}

export default function Speakers() {
  return (
    <section id="palestrantes" className="maq-speakers-section" style={S.wrap}>
      <div className="maq-section-head" style={S.head}>
        <div style={S.eyebrow}>Quem vai falar</div>
        <h2 className="maq-section-title" style={S.title}>Palestrantes</h2>
      </div>
      <SpeakerCarousel />
    </section>
  );
}

/* Carrossel infinito: a lista é renderizada duas vezes e, quando a rolagem
   passa do fim da primeira cópia, ela volta em silêncio para o começo — como as
   duas metades são idênticas, a emenda não aparece.

   No mouse, arrasta-se clicando e puxando. No toque não interceptamos nada: a
   rolagem nativa do contêiner já faz o arrasto, e melhor, com inércia. */
function SpeakerCarousel() {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const arrasto = useRef(null);
  const arrastou = useRef(false);
  const [arrastando, setArrastando] = useState(false);

  /* Posição de partida: o primeiro palestrante encostado na mesma margem do
     título, e não colado na borda da tela. Como partimos do início da segunda
     cópia, sobra o card anterior espiando à esquerda — é o que faz a faixa
     parecer contínua já na abertura, em vez de parecer que começa ali.
     Refeito no redimensionamento porque a margem do título muda com a largura. */
  useLayoutEffect(() => {
    const vp = viewportRef.current;
    const track = trackRef.current;
    if (!vp || !track) return undefined;

    const posicionar = () => {
      const cabecalho = document.querySelector('.maq-section-head');
      if (!cabecalho) return;
      const estilo = getComputedStyle(cabecalho);
      const margem = cabecalho.getBoundingClientRect().left + parseFloat(estilo.paddingLeft);
      const p = periodo();
      if (p <= vp.clientWidth) return;
      vp.scrollLeft = p - margem;
    };

    posicionar();
    window.addEventListener('resize', posicionar);
    return () => window.removeEventListener('resize', posicionar);
  }, []);

  /* Período do laço: a distância entre o começo de uma cópia e o começo da
     outra. Vem do offsetLeft do primeiro card da segunda cópia, não de
     scrollWidth/2 — a largura total tem um gap a menos que o dobro do período,
     e essa diferença desalinharia a faixa um pouco a cada volta. */
  const periodo = () => {
    const track = trackRef.current;
    const inicioDaSegundaCopia = track?.children[DATA.speakers.length];
    return inicioDaSegundaCopia ? inicioDaSegundaCopia.offsetLeft : 0;
  };

  // Cruzou o fim da primeira cópia, volta um período; cruzou o começo, avança
  // um período. Só vale se houver o que rolar.
  const fecharLaco = () => {
    const vp = viewportRef.current;
    if (!vp) return;
    const p = periodo();
    if (p <= vp.clientWidth) return;
    if (vp.scrollLeft >= p) vp.scrollLeft -= p;
    else if (vp.scrollLeft <= 0) vp.scrollLeft += p;
  };

  const aoPressionar = (e) => {
    if (e.pointerType !== 'mouse') return;
    if (e.target.closest('a')) return; // deixa o link do Instagram em paz
    const vp = viewportRef.current;
    arrasto.current = { x: e.clientX, inicio: vp.scrollLeft };
    arrastou.current = false;
    setArrastando(true);
    vp.setPointerCapture(e.pointerId);
  };

  const aoMover = (e) => {
    const d = arrasto.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 3) arrastou.current = true;
    viewportRef.current.scrollLeft = d.inicio - dx;
    fecharLaco();
    e.preventDefault();
  };

  const aoSoltar = (e) => {
    if (!arrasto.current) return;
    arrasto.current = null;
    setArrastando(false);
    try { viewportRef.current.releasePointerCapture(e.pointerId); } catch { /* já solto */ }
  };

  // Depois de arrastar, o navegador ainda dispara um clique: se ele caísse num
  // link, o arrasto viraria navegação sem querer.
  const aoClicar = (e) => {
    if (!arrastou.current) return;
    arrastou.current = false;
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div style={S.carousel}>
      <div
        ref={viewportRef}
        className="maq-speakers-viewport"
        style={{ ...S.viewport, cursor: arrastando ? 'grabbing' : 'grab' }}
        onPointerDown={aoPressionar}
        onPointerMove={aoMover}
        onPointerUp={aoSoltar}
        onPointerCancel={aoSoltar}
        onClickCapture={aoClicar}
        onDragStart={(e) => e.preventDefault()}
        onScroll={fecharLaco}
        tabIndex={0}
        role="region"
        aria-label="Palestrantes — arraste para o lado para ver todos"
      >
        <div ref={trackRef} style={S.track}>
          {[0, 1].map((copia) =>
            DATA.speakers.map((s, i) => (
              <SpeakerCard
                key={`${copia}-${i}`}
                s={s}
                i={i}
                aoDuplicar={copia === 1}
              />
            )),
          )}
        </div>
      </div>
    </div>
  );
}

function SpeakerCard({ s, i, aoDuplicar = false }) {
  const [hover, setHover] = useState(false);
  const [photoFalhou, setPhotoFalhou] = useState(false);
  const dark = i % 2 === 1;
  const revealed = s.revealed !== false;

  return (
    <div
      // A segunda cópia existe só para fechar o laço visual: fica fora da
      // ordem de leitura e de tabulação para não duplicar o conteúdo.
      aria-hidden={aoDuplicar || undefined}
      inert={aoDuplicar ? '' : undefined}
      style={{
        ...S.card,
        transform: hover && revealed ? 'translateY(-4px)' : 'none',
        boxShadow: hover && revealed ? 'var(--shadow-lg)' : 'var(--shadow-md)',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        style={{
          ...S.photo,
          background: dark ? 'var(--indigo-700)' : 'var(--burnt-gold)',
          backgroundImage: PATTERN_BG,
          backgroundSize: '150px',
        }}
      >
        {/* Sem foto, fica a padronagem de fundo. Se o arquivo sumir, o onError
            devolve a padronagem em vez de deixar o ícone de imagem quebrada. */}
        {s.photo && !photoFalhou && (
          <img
            src={s.photo}
            alt={`Retrato de ${s.name}`}
            onError={() => setPhotoFalhou(true)}
            style={{ ...S.photoImg, objectPosition: s.photoPosition ?? 'center' }}
          />
        )}
        {revealed
          ? <span style={S.tag}>{s.tag}</span>
          : <span style={{ ...S.tag, ...S.tagSoon }}>Em breve</span>}
      </div>

      {revealed ? (
        <div style={S.body}>
          <div style={S.name}>{s.name}</div>
          {s.role && <div style={S.role}>{s.role}</div>}
          {s.topic && <div style={S.topic}>“{s.topic}”</div>}
          {s.instagram && (
            <a
              className="maq-speaker-social"
              style={S.social}
              href={`https://instagram.com/${s.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              // Fonte da verdade contra o arrasto: o carrossel nunca vê este
              // pointerdown, então nem entra em cena a lógica dele de decidir
              // se é clique ou arrasto — o link sempre se comporta como link.
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              <Instagram size={14} style={{ flex: 'none' }} />
              {s.instagram}
            </a>
          )}
        </div>
      ) : (
        <div style={S.body}>
          <span style={S.srOnly}>Palestrante ainda não anunciado</span>
          <div style={S.veiled} aria-hidden="true">
            <div style={S.name}>{s.name}</div>
            <div style={S.role}>{s.role}</div>
            <div style={S.topic}>“{s.topic}”</div>
          </div>
        </div>
      )}
    </div>
  );
}

const S = {
  /* stats band */
  band: {
    display: 'flex', justifyContent: 'center', gap: 0, flexWrap: 'wrap',
    background: 'var(--indigo-700)', padding: '40px 24px',
  },
  item: { padding: '0 56px', textAlign: 'center', borderRight: '1px solid rgba(245,240,227,.16)' },
  n: {
    fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 52,
    color: 'var(--light-gold)', lineHeight: 1,
  },
  l: {
    fontFamily: 'var(--font-sans)', fontSize: 14, letterSpacing: '.14em', textTransform: 'uppercase',
    color: 'rgba(245,240,227,.72)', marginTop: 8,
  },

  /* speakers */
  // A faixa de cards sangra de ponta a ponta da página; só o título fica
  // no contêiner de 1240, alinhado com as outras seções.
  wrap: { padding: '48px 0 88px' },
  head: { maxWidth: 1240, margin: '0 auto 40px', padding: '0 40px' },
  eyebrow: {
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, letterSpacing: '.22em',
    textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 4,
  },
  // lineHeight explícito: sem ele, a fonte de display sobra bastante espaço de
  // ascendente acima da letra maiúscula, e o título parece mais longe do
  // eyebrow do que o marginBottom sozinho sugere.
  title: {
    fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 42, lineHeight: 1.05,
    color: 'var(--ink)', margin: 0,
  },
  carousel: { position: 'relative' },
  viewport: {
    overflowX: 'auto', overflowY: 'hidden',
    // A sombra do card levantado no hover precisa caber sem virar barra de rolagem.
    padding: '8px 0 20px',
    // Sem isso, arrastar seleciona o texto dos cards.
    userSelect: 'none', WebkitUserSelect: 'none',
    touchAction: 'pan-x',
  },
  track: { display: 'flex', gap: 22, width: 'max-content' },
  card: {
    flex: 'none', width: 280,
    background: 'var(--paper-raised)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)',
    overflow: 'hidden', transition: 'all .25s var(--ease-out)',
    display: 'flex', flexDirection: 'column',
  },
  photo: { height: 210, position: 'relative', flex: 'none' },
  photoImg: {
    position: 'absolute', inset: 0, width: '100%', height: '100%',
    objectFit: 'cover', display: 'block',
  },
  tag: {
    position: 'absolute', left: 14, top: 14, fontFamily: 'var(--font-sans)', fontWeight: 600,
    fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-on-gold)',
    background: 'var(--beige)', padding: '5px 11px', borderRadius: 'var(--r-pill)',
  },
  tagSoon: { background: 'rgba(245,240,227,.75)', color: 'var(--ink-2)' },
  body: { padding: '18px 20px 22px', position: 'relative' },
  // O borrão vaza um pouco da caixa, mas o card tem overflow hidden.
  veiled: { filter: 'blur(6px)', userSelect: 'none', pointerEvents: 'none' },
  srOnly: {
    position: 'absolute', width: 1, height: 1, padding: 0, margin: -1,
    overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0,
  },
  name: { fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 23, color: 'var(--ink)' },
  role: { fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-3)', marginTop: 2 },
  topic: {
    fontFamily: 'var(--font-sans)', fontStyle: 'italic', fontSize: 14,
    color: 'var(--sober-blue)', marginTop: 12, lineHeight: 1.45,
  },
  social: {
    display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 12,
    fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-3)',
    textDecoration: 'none', transition: 'color .2s', cursor: 'pointer',
    position: 'relative', zIndex: 1, touchAction: 'manipulation',
    // Área de clique maior que o texto visível: no mouse, o carrossel só
    // "perdoa" o clique quando o pointerdown cai dentro do <a> — se o
    // ponteiro descer 1-2px fora do texto, ele inicia um arrasto e sequestra
    // o clique. A margem negativa compensa o padding para não mexer no layout.
    padding: '6px 4px', margin: '6px -4px -6px',
  },
};
