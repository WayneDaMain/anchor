import React from 'react';
import FadeIn from '../../../components/animations/FadeIn';
import StaggerContainer from '../../../components/animations/StaggerContainer';
import FeatureCard from './FeatureCard';

const FeaturesSection = () => {
  const features = [
    {
      icon: "Target",
      title: "See Exactly Where You Are",
      description: "Always know your real position in the plan. Which days you've logged, what's overdue, and how close you are to finishing — no vague progress bars.",
      accentColor: true
    },
    {
      icon: "Calendar",
      title: "A Plan That Fits Your Life",
      description: "Pick any combination of books, set your own timeline — 3 months, a year, whatever — and Anchor builds your daily schedule. Change it anytime.",
      accentColor: false
    },
    {
      icon: "Users",
      title: "Read Together, Stay Accountable",
      description: "Join a group reading plan and see everyone's progress in one place. Nothing keeps you going like knowing others can see your status.",
      accentColor: false
    },
    {
      icon: "RotateCcw",
      title: "Pick Up Where You Left Off",
      description: "Life happens. Anchor doesn't punish you for missing days. Just come back, log what you've read, and keep moving. Your progress is always waiting.",
      accentColor: true
    },
    {
      icon: "Bell",
      title: "Never Lose Your Streak",
      description: "Get notified when a new reading day opens. Stay ahead of the schedule instead of catching up. Simple daily nudges that actually work.",
      accentColor: false
    },
    {
      icon: "Share2",
      title: "Share Your Progress",
      description: "Generate a visual progress report showing your completion percentage, books finished, and days logged. Share it with your group, church, or just yourself.",
      accentColor: false
    }
  ];

  return (
    <section id="features" className="py-24 md:py-32 lg:py-40 bg-white relative">
      {/* Subtle gradient accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-violet-300/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-16 md:mb-20 lg:mb-28">
            <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200/60 text-violet-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              [ Features ]
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-heading font-bold leading-tight mb-5">
              <span className="text-slate-900">Everything that keeps you</span>
              <br />
              <span className="bg-gradient-to-r from-violet-600 via-blue-500 to-emerald-500 bg-clip-text text-transparent">
                from quitting.
              </span>
            </h2>
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-light">
              Built for real people with real schedules — not for people who already have perfect habits.
            </p>
          </div>
        </FadeIn>

        <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
          {features?.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature?.icon}
              title={feature?.title}
              description={feature?.description}
              accentColor={feature?.accentColor}
              index={index}
            />
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default FeaturesSection;
