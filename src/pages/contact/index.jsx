import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../../components/animations/PageTransition';
import FadeIn from '../../components/animations/FadeIn';
import Icon from '../../components/AppIcon';
import Footer from '../landing-page/components/Footer';

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null); // 'success', 'error', 'sending'

  useEffect(() => {
    document.title = 'Anchor — Contact Us';
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      return;
    }
    setStatus('sending');
    // Simulate API request
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    }, 1200);
  };

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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">

          {/* Left Column: Contact Copy & Email Signpost */}
          <div className="md:col-span-5 space-y-8">
            <FadeIn delay={0.05} direction="up" className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-sans font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                We'd love to hear from you.
              </h1>
              <p className="text-sm text-slate-500 font-light leading-relaxed">
                Have questions about custom plans, group settings, or suggestions? Send us a message or reach out directly.
              </p>
            </FadeIn>

            <FadeIn delay={0.15} direction="up" className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <Icon name="MessageSquare" size={16} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block leading-tight">Support Desk</span>
                  <a href="mailto:anchor@biblescriptura.com" className="text-sm font-semibold text-slate-900 hover:text-emerald-600 transition-colors leading-tight">
                    anchor@biblescriptura.com
                  </a>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right Column: Clean Form Widget */}
          <div className="md:col-span-7">
            <FadeIn delay={0.2} direction="up">
              <div className="bg-white border border-slate-200/85 rounded-2xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] space-y-6">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Send Message</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="text-2xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="James K."
                      className="w-full text-sm font-medium px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-800 transition-all placeholder:text-slate-300 bg-slate-50/50"
                      disabled={status === 'sending' || status === 'success'}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="text-2xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="james@example.com"
                      className="w-full text-sm font-medium px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-800 transition-all placeholder:text-slate-300 bg-slate-50/50"
                      disabled={status === 'sending' || status === 'success'}
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="text-2xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Message
                    </label>
                    <textarea
                      name="message"
                      id="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us what you're thinking..."
                      className="w-full text-sm font-medium px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-800 transition-all placeholder:text-slate-300 bg-slate-50/50 resize-none"
                      disabled={status === 'sending' || status === 'success'}
                    />
                  </div>

                  {status === 'success' && (
                    <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-xl text-xs flex items-center gap-2">
                      <Icon name="CheckCircle2" size={16} className="text-emerald-600 flex-shrink-0" />
                      <span>Thank you! Your message has been sent successfully. We'll be in touch shortly.</span>
                    </div>
                  )}

                  {status === 'error' && (
                    <div className="bg-red-50 border border-red-100 text-red-800 p-4 rounded-xl text-xs flex items-center gap-2">
                      <Icon name="AlertTriangle" size={16} className="text-red-600 flex-shrink-0" />
                      <span>Please fill in all form fields before submitting.</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={status === 'sending' || status === 'success'}
                  >
                    {status === 'sending' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending message...</span>
                      </>
                    ) : (
                      <>
                        <Icon name="Send" size={14} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </FadeIn>
          </div>

        </div>
      </main>

      {/* Footer */}
      <Footer />
    </PageTransition>
  );
};

export default Contact;
