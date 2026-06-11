import React, { useEffect } from 'react';
import PageTransition from '../../components/animations/PageTransition';
import HeroSection from './components/HeroSection';
import MarqueeTicker from './components/MarqueeTicker';
import FeaturesSection from './components/FeaturesSection';
import HowItWorks from './components/HowItWorks';
import TestimonialsSection from './components/TestimonialsSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

const LandingPage = () => {
  useEffect(() => {
    document.title = 'Anchor — Bible progress, simplified.';
  }, []);

  return (
    <PageTransition className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
      <HeroSection />
      <MarqueeTicker />
      <FeaturesSection />
      <HowItWorks />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </PageTransition>
  );
};

export default LandingPage;
