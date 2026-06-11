import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import Icon from '../AppIcon';
import Button from './Button';

// Hardcoded current app version matching mobile packages and web configurations
const CURRENT_VERSION = '1.0.0';

export default function AppUpdater() {
  const [updateData, setUpdateData] = useState(null);
  const [isDismissed, setIsDismissed] = useState(false);

  // Parse semantic version string to compare parts
  const isNewerVersion = (current, latest) => {
    const currentParts = current.split('.').map(Number);
    const latestParts = latest.split('.').map(Number);

    for (let i = 0; i < Math.max(currentParts.length, latestParts.length); i++) {
      const currentPart = currentParts[i] || 0;
      const latestPart = latestParts[i] || 0;

      if (latestPart > currentPart) return true;
      if (currentPart > latestPart) return false;
    }
    return false;
  };

  useEffect(() => {
    const checkVersion = async () => {
      try {
        // On native platforms, fetch the remote absolute URL to bypass local bundle assets
        // On web platforms, fetch the relative path
        const url = Capacitor.isNativePlatform()
          ? `https://anchor.biblescriptura.com/version.json?t=${Date.now()}`
          : `/version.json?t=${Date.now()}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);

        const data = await res.json();
        const latestVersion = data.latestVersion;
        const forceUpdate = data.forceUpdate === true;

        // Check if latest version is newer
        if (latestVersion && isNewerVersion(CURRENT_VERSION, latestVersion)) {
          // If the user dismissed this specific version in local storage, don't show it unless forceUpdate is enabled
          const dismissedVer = localStorage.getItem('dismissedAppVersion');
          if (dismissedVer === latestVersion && !forceUpdate) {
            return;
          }

          setUpdateData({
            latestVersion,
            forceUpdate,
            releaseNotes: data.releaseNotes || 'Bug fixes and performance improvements.',
            updateUrl: data.updateUrl || (Capacitor.isNativePlatform() ? 'https://play.google.com/store/apps/details?id=anchor.scriptura' : window.location.origin)
          });
        } else {
          setUpdateData(null);
        }
      } catch (err) {
        console.warn('Could not check latest app version:', err.message);
      }
    };

    checkVersion();

    // Check for updates every 15 minutes while the app remains open
    const interval = setInterval(checkVersion, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdate = async () => {
    if (!updateData) return;

    if (Capacitor.isNativePlatform()) {
      try {
        await Browser.open({ url: updateData.updateUrl });
      } catch (err) {
        console.error('Failed to open app store link via Capacitor:', err);
        window.open(updateData.updateUrl, '_blank');
      }
    } else {
      // On web, redirect or reload to get fresh service worker cache
      if (updateData.updateUrl === window.location.origin) {
        window.location.reload(true);
      } else {
        window.open(updateData.updateUrl, '_blank');
      }
    }
  };

  const handleDismiss = () => {
    if (!updateData) return;

    // Store the skipped version in local storage
    localStorage.setItem('dismissedAppVersion', updateData.latestVersion);
    setIsDismissed(true);
    setUpdateData(null);
  };

  if (!updateData) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-modal flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="bg-card border border-border rounded-[2rem] shadow-2xl p-6 md:p-8 max-w-md w-full relative text-center overflow-hidden"
        >
          {/* Faded background circles to wow the user */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none -translate-y-12" />

          {/* Close Icon (Only for non-forced updates) */}
          {!updateData.forceUpdate && (
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 active:scale-95 transition-all"
              aria-label="Close update modal"
            >
              <Icon name="X" size={16} />
            </button>
          )}

          {/* Update Illustration/Icon */}
          <div className="relative w-16 h-16 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Icon name="ArrowDownToLine" size={32} className="animate-bounce animate-duration-1000" />
          </div>

          <h3 className="text-xl md:text-2xl font-heading font-extrabold text-foreground mb-1 tracking-tight">
            Update Available!
          </h3>
          <p className="text-xs text-muted-foreground mb-4 font-semibold uppercase tracking-wider">
            Version {updateData.latestVersion} is now ready
          </p>

          {/* Release Notes */}
          <div className="bg-muted/40 border border-border/60 rounded-2xl p-4 mb-6 text-left max-h-36 overflow-y-auto scrollbar-thin">
            <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <span>What's New</span>
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
              {updateData.releaseNotes}
            </p>
          </div>

          {/* Update action layout */}
          <div className="flex flex-col gap-3">
            <Button
              variant="default"
              size="default"
              onClick={handleUpdate}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl py-3 font-semibold text-sm shadow-lg shadow-accent/20 transition-all border border-accent/20 flex items-center justify-center gap-2"
            >
              <span>Update Now</span>
            </Button>

            {!updateData.forceUpdate && (
              <button
                onClick={handleDismiss}
                className="w-full py-2.5 rounded-xl text-xs font-semibold border border-border hover:bg-muted/50 transition-all text-muted-foreground"
              >
                Maybe Later
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
