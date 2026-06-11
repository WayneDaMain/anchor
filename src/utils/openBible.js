import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { AppLauncher } from '@capacitor/app-launcher';

/**
 * Open the Bible — on native, launches Scriptura if installed,
 * otherwise opens biblescriptura.com/download in system browser.
 * On web, opens the web reader in a new tab.
 */
export async function openBible() {
  if (Capacitor.isNativePlatform()) {
    try {
      const { value } = await AppLauncher.canOpenUrl({ url: 'scriptura.app' });
      if (value) {
        await AppLauncher.openUrl({ url: 'scriptura.app' });
      } else {
        await Browser.open({ url: 'https://biblescriptura.com/download' });
      }
    } catch (e) {
      console.error('Failed to launch Scriptura app via AppLauncher:', e);
      await Browser.open({ url: 'https://biblescriptura.com/download' });
    }
  } else {
    window.open('https://web.biblescriptura.com', '_blank', 'noopener,noreferrer');
  }
}
