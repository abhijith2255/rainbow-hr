import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Components import cheyyunnu
import Preloader from '../components/Home/Preloader';
import Hero from '../components/Home/Hero';
import Companies from '../components/Home/Companies';
import PlatformStats from '../components/Home/PlatformStats';
import Categories from '../components/Home/Categories';
import FeaturedJobs from '../components/Home/FeaturedJobs';
import HowItWorks from '../components/Home/HowItWorks'; 
import Testimonials from '../components/Home/Testimonials'; 
import CTA from '../components/Home/CTA';
import WhatsAppButton from '../components/Home/WhatsAppButton';

const Home = () => {
  const { hash } = useLocation();
  // Preloader oru session-il aadyamayi Home thurakkumbol mattram kaanikkunnu.
  // Venda enkil (lazy: null) — poya sesham sessionStorage-il mark cheyyunnu,
  // athukondu veendum Home-lekku thirichu varumbol vegham load aakunnu.
  const [showPreloader, setShowPreloader] = useState(
    () => typeof window !== 'undefined' && !sessionStorage.getItem('rainbowIntroSeen')
  );

  const handlePreloaderDone = () => {
    sessionStorage.setItem('rainbowIntroSeen', '1');
    setShowPreloader(false);
  };

  // /#companies പോലുള്ള ലിങ്കുകൾ ക്ലിക്ക് ചെയ്യുമ്പോൾ ആ സെക്ഷനിലേക്ക് സ്ക്രോൾ ചെയ്യുന്നു
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const target = document.getElementById(hash.replace('#', ''));
    if (target) {
      setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }, [hash]);

  return (
    <div className="relative selection:bg-emerald-500 selection:text-white overflow-x-hidden bg-slate-50 font-premium">
      {showPreloader && <Preloader onFinish={handlePreloaderDone} />}

      <Hero />
      <Companies />
      <PlatformStats />
      <Categories />
      <FeaturedJobs />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <WhatsAppButton />
    </div>
  );
};

export default Home;
