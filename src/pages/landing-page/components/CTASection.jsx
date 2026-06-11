import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-28 bg-slate-50 dark:bg-zinc-900/40 border-t border-slate-100 dark:border-zinc-900 transition-colors duration-300 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-violet-100/35 dark:bg-zinc-800/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          className="relative"
        >

          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-heading font-bold text-slate-900 dark:text-zinc-100 mb-5 leading-tight">
            Your plan won't
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 bg-clip-text text-transparent">
              read itself.
            </span>
          </h2>

          <p className="text-lg md:text-xl text-slate-500 dark:text-zinc-400 mb-10 max-w-xl mx-auto">
            Join thousands of readers who finally know where they stand in their Bible, and actually finish what they started.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto bg-sky-600 text-white px-10 py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2.5 shadow-lg shadow-sky-200"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.25 }}
            >
              Create Free Account
              <Icon name="ArrowRight" size={20} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
