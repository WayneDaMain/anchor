import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../../components/animations/PageTransition';
import FadeIn from '../../components/animations/FadeIn';
import Icon from '../../components/AppIcon';
import Footer from '../landing-page/components/Footer';

const About = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Anchor — About Us';
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageTransition className="min-h-screen flex flex-col justify-between overflow-hidden bg-white">
      {/* Exquisite Subtle Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-white to-white" />
        <div className="absolute inset-y-0 top-0 h-full max-w-7xl mx-auto border-x border-slate-100/70" />
        <div className="absolute top-[88px] inset-x-0 border-t border-slate-100/70" />
      </div>

      {/* Simple Navigation Header */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8 h-[88px] flex items-center justify-between">
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <Icon name="Anchor" size={24} className="w-6 h-6 object-contain" />
          <span className="text-base font-bold text-slate-900 tracking-tight font-sans">Anchor</span>
        </div>

        <button
          onClick={() => navigate('/')}
          className="text-sm text-slate-500 hover:text-slate-900 transition-all duration-200 font-medium cursor-pointer"
        >
          Back to Home
        </button>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-4xl mx-auto px-6 sm:px-8 flex-grow py-16 md:py-24">
        <div className="space-y-12">

          {/* Header Block */}
          <FadeIn delay={0.05} direction="up" className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-sans font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Simplicity in Scripture.
            </h1>
            <p className="text-lg sm:text-xl text-slate-500 font-light leading-relaxed max-w-2xl">
              We believe building a habit of reading the Bible shouldn't feel like a high-pressure chore. Anchor is designed to help you stay consistent.
            </p>
          </FadeIn>

          {/* Separation line */}
          <div className="w-full h-px bg-slate-100" />

          {/* Story Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            <FadeIn delay={0.15} direction="up" className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <Icon name="Target" size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Focus on Progress, Not Rules</h2>
              <p className="text-sm text-slate-500 leading-relaxed font-light">
                Anchor focuses on clean, frictionless tracking. Log your daily chapters, see your overall progress dial, and move on.
              </p>
            </FadeIn>

            <FadeIn delay={0.25} direction="up" className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <Icon name="Users" size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Shared Accountability</h2>
              <p className="text-sm text-slate-500 leading-relaxed font-light">
                Reading is better together. With our simple group management tools, you can form small reading teams, share logs, and keep each other motivated in a quiet, distraction-free environment.
              </p>
            </FadeIn>
          </div>

          <div className="w-full h-px bg-slate-100" />

          {/* Final Call to Action */}
          <FadeIn delay={0.35} direction="up" className="bg-slate-50 border border-slate-100 rounded-2xl p-8 md:p-12 text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Ready to start your next Bible plan?
            </h2>
            <p className="text-sm sm:text-base text-slate-500 max-w-md mx-auto font-light leading-relaxed">
              Create a custom personal reading track or invite your friends to read together. Completely free.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => navigate('/register')}
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-6 py-3.5 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <span>Create a Free Account</span>
                <Icon name="ArrowRight" size={16} />
              </button>
            </div>
          </FadeIn>

        </div>
      </main>

      {/* Footer */}
      <Footer />
    </PageTransition>
  );
};

export default About;
