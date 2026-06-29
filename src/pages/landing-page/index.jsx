import React from 'react';
import PageTransition from '../../components/animations/PageTransition';
import SEO from '../../components/SEO';
import HeroSection from './components/HeroSection';
import MarqueeTicker from './components/MarqueeTicker';
import FeaturesSection from './components/FeaturesSection';
import HowItWorks from './components/HowItWorks';
import TestimonialsSection from './components/TestimonialsSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

const LandingPage = () => {
  return (
    <PageTransition className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300 overflow-x-hidden">
      <SEO 
        title="Anchor — Bible progress, simplified."
        description="Anchor is a simple, beautiful Bible reading progress tracker. Create customized reading tracks, track daily chapters, and read together with groups. Start your habit today."
        keywords={['Bible', 'progress tracker', 'Bible reading habit', 'Scripture', 'reading plan', 'accountability group', 'faith journey']}
        canonical="https://anchor.biblescriptura.com/"
      />
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
