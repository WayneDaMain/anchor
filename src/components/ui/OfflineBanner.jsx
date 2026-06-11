import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../AppIcon';

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-toast max-w-sm w-[calc(100%-2rem)] sm:w-auto bg-amber-500 text-white font-semibold text-xs px-5 py-2.5 rounded-full shadow-lg flex items-center justify-center gap-2 border border-amber-600/20"
        >
          <Icon name="WifiOff" size={14} className="text-white flex-shrink-0 animate-pulse" />
          <span>Offline Mode. Reading updates will sync when online.</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
