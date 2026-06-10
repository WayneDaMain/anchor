import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-slate-50 relative overflow-hidden">
      {/* Subtle glow backdrop */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[300px] bg-violet-100/50 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          className="relative"
        >
          <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200/60 text-violet-700 px-4 py-1.5 rounded-full text-sm font-medium mb-8">
            [ Let's Connect ]
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-heading font-bold text-slate-900 mb-5 leading-tight">
            Your plan won't
            <br />
            <span className="bg-gradient-to-r from-violet-600 via-blue-500 to-emerald-500 bg-clip-text text-transparent">
              read itself.
            </span>
          </h2>

          <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-xl mx-auto">
            Join thousands of readers who finally know where they stand in their Bible — and actually finish what they started.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto bg-violet-600 text-white px-10 py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2.5 shadow-lg shadow-violet-200"
              whileHover={{ scale: 1.03, boxShadow: '0 10px 40px rgba(139,92,246,0.3)' }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.25 }}
            >
              Create Free Account
              <Icon name="ArrowRight" size={20} />
            </motion.button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 mt-10 pt-8 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <Icon name="Shield" size={18} color="var(--color-success)" />
              <span className="text-sm text-slate-500">Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Zap" size={18} color="var(--color-success)" />
              <span className="text-sm text-slate-500">Setup in 2 Minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="CreditCard" size={18} color="var(--color-success)" />
              <span className="text-sm text-slate-500">Completely Free</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
