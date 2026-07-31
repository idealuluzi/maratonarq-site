import { useCallback, useEffect, useState } from 'react';
import { DATA } from './data.js';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Speakers, { StatsBand } from './components/Speakers.jsx';
import Schedule from './components/Schedule.jsx';
import Tiers, { Footer } from './components/Tiers.jsx';
import RegisterModal from './components/RegisterModal.jsx';

export default function App() {
  const [modal, setModal] = useState(false);
  // Guarda o lote de onde a inscrição partiu, para o modal já vir com o perfil
  // respondido. Vindo do topo do site não há lote: aí ele começa perguntando.
  const [tier, setTier] = useState(null);
  const [active, setActive] = useState('inicio');

  const openReg = useCallback((lote) => {
    setTier(lote && typeof lote === 'object' ? lote : null);
    setModal(true);
  }, []);
  const closeReg = useCallback(() => setModal(false), []);

  // Scroll-spy: sublinha o link da seção que está no meio da tela.
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    DATA.nav.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <Header onRegister={openReg} active={active} />
      <main>
        <Hero onRegister={openReg} />
        <StatsBand />
        <Speakers />
        <Schedule />
        <Tiers onRegister={openReg} />
      </main>
      <Footer />
      <RegisterModal open={modal} tier={tier} onClose={closeReg} />
    </>
  );
}
