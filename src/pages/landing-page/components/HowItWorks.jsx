import React from 'react';
import { motion } from 'framer-motion';
import FadeIn from '../../../components/animations/FadeIn';
import Icon from '../../../components/AppIcon';

const steps = [
  {
    num: '01',
    icon: 'BookOpen',
    title: 'Pick your plan',
    description: 'Choose the entire Bible, New Testament, Old Testament, or specific books. Set your duration and Anchor maps out each day.',
  },
  {
    num: '02',
    icon: 'CheckSquare',
    title: 'Read & log',
    description: 'Read from your favorite Bible — physical or digital. Then open Anchor and tap to mark the day done. Takes 3 seconds.',
  },
  {
    num: '03',
    icon: 'TrendingUp',
    title: 'Watch your progress',
    description: 'See your completion percentage climb, books checked off, and days logged. Share your progress or keep it private.',
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 md:py-32 lg:py-40 bg-slate-50 relative overflow-hidden">
      {/* Gradient accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-violet-300/40 to-transparent" />

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-violet-100/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FadeIn>
          <div className="text-center mb-16 md:mb-20 lg:mb-24">
            <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200/60 text-violet-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              [ How it works ]
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-heading font-bold leading-tight mb-5">
              <span className="text-slate-900">Three steps.</span>
              <br />
              <span className="text-slate-400">That's it.</span>
            </h2>
          </div>
        </FadeIn>

        <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-3 md:gap-6">
          {steps.map((step, i) => (
            <FadeIn key={i} delay={0.15 * i}>
              <motion.div
                className="group relative bg-white rounded-2xl p-8 md:p-10 border border-slate-100 hover:border-violet-200 shadow-sm hover:shadow-md transition-all duration-500 h-full"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-violet-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative z-10">
                  {/* Step number */}
                  <span className="text-5xl md:text-6xl font-heading font-extrabold bg-gradient-to-b from-slate-200 to-slate-100 bg-clip-text text-transparent mb-6 block leading-none">
                    {step.num}
                  </span>

                  <div className="w-11 h-11 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center mb-5 group-hover:border-violet-200 transition-colors duration-500">
                    <Icon name={step.icon} size={20} className="text-violet-600" />
                  </div>

                  <h3 className="text-xl font-heading font-semibold text-slate-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base text-slate-500 leading-relaxed font-light">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
