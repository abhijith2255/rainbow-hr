import React from 'react';

// Components import cheyyunnu
import Hero from '../components/Home/Hero';
import Companies from '../components/Home/Companies';
import Categories from '../components/Home/Categories';
import HowItWorks from '../components/Home/HowItWorks'; 
import FeaturedJobs from '../components/Home/FeaturedJobs';
import Testimonials from '../components/Home/Testimonials'; 
import CTA from '../components/Home/CTA';
import Footer from '../components/Home/Footer';
import WhatsAppButton from '../components/Home/WhatsAppButton';

const Home = () => {
  return (
    <div className="relative selection:bg-emerald-500 selection:text-white overflow-x-hidden bg-slate-50 font-premium">
      <Hero />
      <Companies />
      <HowItWorks />
      <Categories />
      <FeaturedJobs />
      <Testimonials />
      <CTA />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Home;