// PWA Installation and Service Worker utilities

export const registerServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      
      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New update available
              console.log('New app version available');
            }
          });
        }
      });
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

// PWA Install Detection and Prompt
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;

export const setupPWAInstall = (): void => {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    // Show install banner or button
    const installBanner = document.getElementById('install-banner');
    if (installBanner) {
      installBanner.style.display = 'block';
    }
  });

  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    deferredPrompt = null;
    // Hide install banner
    const installBanner = document.getElementById('install-banner');
    if (installBanner) {
      installBanner.style.display = 'none';
    }
  });
};

export const promptPWAInstall = async (): Promise<boolean> => {
  if (!deferredPrompt) {
    return false;
  }

  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;
  
  return outcome === 'accepted';
};

export const isPWAInstalled = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
};

// Android-specific PWA checks
export const isAndroid = (): boolean => {
  return /Android/i.test(navigator.userAgent);
};

export const canInstallPWA = (): boolean => {
  return !isPWAInstalled() && (deferredPrompt !== null || isAndroid());
};