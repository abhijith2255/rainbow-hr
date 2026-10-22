import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Components import cheyyunnu
import Hero from '../components/Home/Hero';
import Companies from '../components/Home/Companies';
import Categories from '../components/Home/Categories';
import HowItWorks from '../components/Home/HowItWorks'; 
import FeaturedJobs from '../components/Home/FeaturedJobs';
import Testimonials from '../components/Home/Testimonials'; 
import CTA from '../components/Home/CTA';
import WhatsAppButton from '../components/Home/WhatsAppButton';

const Home = () => {
  const { hash } = useLocation();

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
      <Hero />
      <Companies />
      <HowItWorks />
      <Categories />
      <FeaturedJobs />
      <Testimonials />
      <CTA />
      <WhatsAppButton />
    </div>
  );
};

export default Home;