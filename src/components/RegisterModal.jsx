import { forwardRef, useEffect, useRef, useState } from 'react';
import {
  AlertCircle, ArrowLeft, Building2, Check, Compass, GraduationCap, Layers, Mail, MapPin, Phone, User, X,
} from 'lucide-react';
import { DATA } from '../data.js';
import { salvarInscricao } from '../lib/supabase.js';
import { LogoMark } from './Brand.jsx';

/* ============================================================
   Inscrição em etapas, espelhando o formulário do Google.

   A primeira pergunta separa dois caminhos, como no original: quem é
   estudante responde universidade e modalidade; quem é arquiteto responde
   cidade, como nos descobriu e escritório. Cada etapa mostra no máximo dois
   campos para caber no mesmo tamanho de janela.
   ============================================================ */

const CAMPOS = {
  perfil: {
    label: 'Você é',
    escolhas: ['Estudante', 'Arquiteto'],
    obrigatorio: true,
  },
  nome: {
    label: 'Qual seu nome completo?', icon: User,
    placeholder: 'Seu nome', autoComplete: 'name', obrigatorio: true,
  },
  email: {
    label: 'Qual seu e-mail?', icon: Mail, type: 'email',
    placeholder: 'voce@email.com', autoComplete: 'email', obrigatorio: true,
    valida: (v) => /.+@.+\..+/.test(v),
  },
  telefone: {
    label: 'Qual seu telefone?', icon: Phone, type: 'tel',
    placeholder: '(00) 00000-0000', autoComplete: 'tel', obrigatorio: true,
  },
  universidade: {
    label: 'De qual universidade você é?', icon: GraduationCap,
    placeholder: 'Nome da universidade', obrigatorio: true,
  },
  fase: {
    label: 'Em qual fase do curso você está?', icon: Layers,
    placeholder: 'Ex.: 4ª fase', obrigatorio: true,
  },
  cidade: {
    label: 'De qual cidade você é?', icon: MapPin,
    placeholder: 'Sua cidade', obrigatorio: true,
  },
  descoberta: {
    label: 'Por onde nos descobriu?', icon: Compass,
    placeholder: 'Instagram, um amigo, a faculdade…', obrigatorio: true,
  },
  escritorio: {
    label: 'Se possui escritório, qual o nome?', icon: Building2,
    placeholder: 'Opcional', obrigatorio: false,
  },
  modalidade: {
    label: 'Você pretende participar',
    escolhas: ['Apenas das palestras', 'Das palestras + Hackathon'],
    obrigatorio: true,
  },
};

// O primeiro passo vale para todos; os seguintes dependem da resposta.
const PASSO_PERFIL = { titulo: 'Como você participa', campos: ['perfil'] };

const PASSOS = {
  Estudante: [
    { titulo: 'Seus dados', campos: ['nome', 'email'] },
    { titulo: 'Contato e faculdade', campos: ['telefone', 'universidade', 'fase'] },
    { titulo: 'Como quer participar', campos: ['modalidade'] },
  ],
  Arquiteto: [
    { titulo: 'Seus dados', campos: ['nome', 'email'] },
    { titulo: 'Mais sobre você', campos: ['cidade', 'descoberta'] },
    { titulo: 'Escritório', campos: ['escritorio'] },
  ],
};

// Campos que pertencem a só um dos ramos: trocar de perfil precisa limpá-los,
// senão sobra resposta do caminho abandonado.
const POR_RAMO = {
  Estudante: ['email', 'telefone', 'universidade', 'fase', 'modalidade'],
  Arquiteto: ['email', 'cidade', 'descoberta', 'escritorio'],
};

const VAZIO = {
  perfil: '', nome: '', email: '', telefone: '', universidade: '', fase: '',
  modalidade: '', cidade: '', descoberta: '', escritorio: '',
};

export default function RegisterModal({ open, tier, onClose }) {
  const [passo, setPasso] = useState(0);
  const [sucesso, setSucesso] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const [form, setForm] = useState(VAZIO);
  const primeiroCampo = useRef(null);

  // Abrir a partir de um card já responde a primeira pergunta (e a modalidade,
  // quando o card diz qual é).
  useEffect(() => {
    if (!open) return;
    setSucesso(false);
    setEnviando(false);
    setErro('');
    setPasso(0);
    setForm({ ...VAZIO, perfil: tier?.perfil ?? '', modalidade: tier?.modalidade ?? '' });
  }, [open, tier]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    const anterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = anterior;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) primeiroCampo.current?.focus();
  }, [open, passo]);

  if (!open) return null;

  // O `tier` entra como reserva porque o efeito que preenche o form só roda
  // depois do primeiro render — sem isso a lista de etapas nasceria vazia.
  const perfil = form.perfil || tier?.perfil || '';
  // Vindo de um card, o perfil já está respondido: não faz sentido perguntar.
  // A pergunta só entra quando a inscrição parte do topo do site.
  const perfilVeioDoCard = !!tier?.perfil;
  const etapas = [
    ...(perfilVeioDoCard ? [] : [PASSO_PERFIL]),
    ...(perfil ? PASSOS[perfil] : []),
  ];
  const etapa = etapas[passo] ?? etapas[0];
  // Só há total a anunciar depois de saber o ramo.
  const total = perfil ? etapas.length : null;
  const atual = passo + 1;
  const ultima = !!perfil && passo === etapas.length - 1;

  const preenchido = (chave) => {
    const c = CAMPOS[chave];
    const v = String(form[chave] ?? '').trim();
    if (!c.obrigatorio) return true;
    if (!v) return false;
    return c.valida ? c.valida(v) : true;
  };
  const etapaValida = etapa ? etapa.campos.every(preenchido) : false;

  const set = (chave) => (e) => setForm((f) => ({ ...f, [chave]: e.target.value }));

  const escolher = (chave, valor) => setForm((f) => {
    if (chave !== 'perfil' || f.perfil === valor) return { ...f, [chave]: valor };
    // Trocou de ramo: zera o que só existia no caminho anterior.
    const limpo = { ...f, perfil: valor };
    (POR_RAMO[f.perfil] ?? []).forEach((k) => { limpo[k] = ''; });
    return limpo;
  });

  const voltar = () => setPasso((p) => Math.max(0, p - 1));

  const avancar = async (e) => {
    e.preventDefault();
    if (!etapaValida || enviando) return;
    if (!ultima) { setPasso((p) => p + 1); return; }

    // A tela de sucesso só aparece se a inscrição foi mesmo gravada. Nunca
    // dizer "confirmado" sem ter registro do outro lado.
    setEnviando(true);
    setErro('');
    const { ok, erro: falha } = await salvarInscricao({ ...form, perfil, lote: tier?.name });
    setEnviando(false);
    if (ok) setSucesso(true);
    else setErro(falha);
  };

  return (
    <div style={M.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label="Inscrição">
      <div className="maq-modal-sheet" style={M.sheet} onClick={(e) => e.stopPropagation()}>
        <button style={M.close} onClick={onClose} aria-label="Fechar">
          <X size={18} />
        </button>

        <div className="maq-modal-aside" style={M.aside}>
          <LogoMark size={104} />
        </div>

        <div className="maq-modal-main" style={M.main}>
          {sucesso ? (
            <Sucesso form={form} perfil={perfil} onClose={onClose} />
          ) : (
            <form onSubmit={avancar}>
              <Cabecalho atual={atual} total={total} />
              <h3 style={M.h}>{etapa.titulo}</h3>
              <p style={M.p}>
                {!perfil
                  ? 'Garanta sua vaga em poucos passos.'
                  : `Inscrição de ${perfil.toLowerCase()}.`}
              </p>

              <div style={M.corpo}>
                {etapa.campos.map((chave, i) => {
                  const c = CAMPOS[chave];
                  if (c.escolhas) {
                    return (
                      <div key={chave} style={{ marginBottom: 16 }}>
                        <div style={M.label}>{c.label}</div>
                        <div style={M.escolhaRow}>
                          {c.escolhas.map((op) => (
                            <button
                              key={op}
                              type="button"
                              onClick={() => escolher(chave, op)}
                              style={{
                                ...M.escolha,
                                background: form[chave] === op ? 'var(--burnt-gold)' : 'transparent',
                                color: form[chave] === op ? 'var(--ink-on-gold)' : 'var(--ink-2)',
                                borderColor: form[chave] === op ? 'var(--burnt-gold)' : 'var(--line-strong)',
                              }}
                            >
                              {op}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return (
                    <Campo
                      key={chave}
                      ref={i === 0 ? primeiroCampo : undefined}
                      label={c.label}
                      icon={c.icon}
                      type={c.type}
                      placeholder={c.placeholder}
                      autoComplete={c.autoComplete}
                      value={form[chave]}
                      onChange={set(chave)}
                    />
                  );
                })}
              </div>

              {erro && (
                <p style={M.erro} role="alert">
                  <AlertCircle size={16} style={{ flex: 'none' }} /> {erro}
                </p>
              )}

              <div style={M.acoes}>
                {passo > 0 && (
                  <button type="button" onClick={voltar} style={M.voltar} disabled={enviando}>
                    <ArrowLeft size={15} /> Voltar
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!etapaValida || enviando}
                  style={{
                    ...M.submit,
                    opacity: etapaValida && !enviando ? 1 : 0.45,
                    cursor: etapaValida && !enviando ? 'pointer' : 'not-allowed',
                  }}
                >
                  {enviando ? 'Enviando…' : ultima ? 'Confirmar inscrição' : 'Continuar'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// No primeiro passo ainda não se sabe qual ramo o inscrito vai seguir, então
// não há total a anunciar — só depois de escolher o perfil.
function Cabecalho({ atual, total }) {
  return (
    <div style={M.progresso}>
      <div style={M.progressoTrilho}>
        <div style={{ ...M.progressoBarra, width: total ? `${(atual / total) * 100}%` : '15%' }} />
      </div>
      <span style={M.progressoTexto}>
        {total ? `Passo ${atual} de ${total}` : 'Passo 1'}
      </span>
    </div>
  );
}

function Sucesso({ form, perfil, onClose }) {
  const primeiroNome = form.nome.trim().split(' ')[0];
  return (
    <div style={M.success}>
      <div style={M.checkCircle}><Check size={32} /></div>
      <h3 style={M.h}>Inscrição confirmada!</h3>
      <p style={M.p}>
        {form.email
          ? <>Enviamos os detalhes para <b style={{ color: 'var(--ink)' }}>{form.email}</b>. </>
          : 'Recebemos sua inscrição. '}
        Vemos você em setembro{primeiroNome ? `, ${primeiroNome}` : ''}.
      </p>
      <div style={M.summary}>
        <span>{form.modalidade || perfil}</span>
        <span style={{ color: 'var(--ink-3)' }}>{DATA.datesPorPerfil[perfil] ?? DATA.dates}</span>
      </div>
      <button style={M.submit} onClick={onClose}>Concluir</button>
    </div>
  );
}

function CampoBase({ label, icon: Icon, ...rest }, ref) {
  const [focado, setFocado] = useState(false);
  return (
    <label style={{ display: 'block', marginBottom: 16 }}>
      <div style={M.label}>{label}</div>
      <div
        style={{
          ...M.field,
          borderColor: focado ? 'var(--burnt-gold)' : 'var(--line)',
          boxShadow: focado ? '0 0 0 3px rgba(162,130,49,.18)' : 'none',
        }}
      >
        <Icon size={17} style={{ color: 'var(--ink-3)', flex: 'none' }} />
        <input
          {...rest}
          ref={ref}
          onFocus={() => setFocado(true)}
          onBlur={() => setFocado(false)}
          style={M.input}
        />
      </div>
    </label>
  );
}
const Campo = forwardRef(CampoBase);

/* O degradê dourado oficial entra por /assets/gradient.png. Enquanto o arquivo
   não estiver lá, os degradês CSS abaixo desenham um dourado equivalente — o
   navegador simplesmente ignora a camada da imagem que não existe. */
const DOURADO = `url('/assets/gradient.png'),
  radial-gradient(120% 90% at 12% 8%, #d8c165 0%, rgba(216,193,101,0) 55%),
  radial-gradient(100% 80% at 88% 96%, #e2cd7a 0%, rgba(226,205,122,0) 60%),
  linear-gradient(160deg, #bda449 0%, #a6893a 48%, #cbb35a 100%)`;

const M = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(21,3,60,.5)', backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', zIndex: 100, padding: 24, overflowY: 'auto',
  },
  sheet: {
    display: 'flex', width: 'min(760px,100%)', background: 'var(--paper-raised)',
    borderRadius: 'var(--r-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)',
    position: 'relative', margin: 'auto',
  },
  close: {
    position: 'absolute', top: 16, right: 16, background: 'rgba(245,240,227,.5)', border: 'none',
    borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center',
    justifyContent: 'center', cursor: 'pointer', color: 'var(--ink-2)', zIndex: 2,
  },
  aside: {
    width: 240, flex: 'none', backgroundImage: DOURADO, backgroundSize: 'cover',
    backgroundPosition: 'center', padding: 28,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  main: { flex: 1, padding: '36px 36px 40px', minWidth: 0 },

  progresso: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 },
  progressoTrilho: {
    flex: 1, height: 3, background: 'var(--paper-sunken)',
    borderRadius: 'var(--r-pill)', overflow: 'hidden',
  },
  progressoBarra: {
    height: '100%', background: 'var(--burnt-gold)',
    borderRadius: 'var(--r-pill)', transition: 'width .25s var(--ease-out)',
  },
  progressoTexto: {
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 11, letterSpacing: '.1em',
    textTransform: 'uppercase', color: 'var(--ink-3)', flex: 'none',
  },

  h: { fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 30, color: 'var(--ink)', margin: '0 0 6px' },
  p: {
    fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: 15.5, lineHeight: 1.55,
    color: 'var(--ink-2)', margin: '0 0 20px',
  },
  // Altura reservada para as etapas: sem isso a janela pularia de tamanho
  // a cada passo, já que os campos variam.
  corpo: { minHeight: 196 },

  label: {
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12, letterSpacing: '.1em',
    textTransform: 'uppercase', color: 'var(--ink-2)', marginBottom: 7,
  },
  field: {
    display: 'flex', alignItems: 'center', gap: 10, background: 'var(--paper)',
    border: '1.5px solid', borderRadius: 'var(--r-sm)', padding: '12px 14px', transition: 'all .18s',
  },
  input: {
    border: 'none', background: 'none', outline: 'none', fontFamily: 'var(--font-sans)',
    fontSize: 15, color: 'var(--ink)', width: '100%',
  },

  // Opções empilhadas: acendem em dourado quando escolhidas.
  escolhaRow: { display: 'flex', flexDirection: 'column', gap: 10 },
  escolha: {
    width: '100%', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14.5,
    padding: '14px 16px', border: '1.5px solid', borderRadius: 'var(--r-sm)',
    cursor: 'pointer', transition: 'all .18s',
  },

  erro: {
    display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 12px',
    fontFamily: 'var(--font-sans)', fontSize: 14, lineHeight: 1.45,
    color: 'var(--danger)',
  },
  acoes: { display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 },
  voltar: {
    display: 'inline-flex', alignItems: 'center', gap: 6, flex: 'none',
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, color: 'var(--ink-2)',
    background: 'transparent', border: 'none', cursor: 'pointer', padding: '15px 4px',
  },
  submit: {
    flex: 1, width: '100%', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15,
    letterSpacing: '.06em', textTransform: 'uppercase', background: 'var(--burnt-gold)',
    color: 'var(--ink-on-gold)', border: 'none', borderRadius: 'var(--r-pill)',
    padding: '15px', transition: 'opacity .2s',
  },

  success: { textAlign: 'center', padding: '14px 0' },
  checkCircle: {
    width: 64, height: 64, borderRadius: '50%', background: 'var(--success)', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
  },
  summary: {
    display: 'flex', justifyContent: 'space-between', background: 'var(--paper-sunken)',
    borderRadius: 'var(--r-sm)', padding: '14px 18px', margin: '0 0 22px',
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, color: 'var(--ink)',
  },
};
