import { useState, useEffect } from "react";
import { X, Download, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { promptPWAInstall, canInstallPWA, isAndroid, isPWAInstalled } from "@/lib/pwa";

export default function PWAInstallBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed the banner
    const wasDismissed = localStorage.getItem('pwa-install-dismissed') === 'true';
    
    // Show banner if PWA can be installed and not dismissed
    if (canInstallPWA() && !wasDismissed && !isPWAInstalled()) {
      setShowBanner(true);
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = () => {
      if (!wasDismissed && !isPWAInstalled()) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    const installed = await promptPWAInstall();
    if (installed) {
      setShowBanner(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showBanner || dismissed || isPWAInstalled()) {
    return null;
  }

  return (
    <div 
      id="install-banner"
      className="fixed bottom-0 left-0 right-0 bg-primary text-white p-4 shadow-lg z-50 max-w-md mx-auto"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <Smartphone className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-sm">Install App</h3>
            <p className="text-xs text-blue-100">
              {isAndroid() 
                ? "Add to your home screen for quick access" 
                : "Install for offline access and better experience"
              }
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleInstall}
            size="sm"
            variant="secondary"
            className="bg-white text-primary hover:bg-blue-50 text-xs px-3 py-1"
          >
            <Download className="w-3 h-3 mr-1" />
            Install
          </Button>
          <Button
            onClick={handleDismiss}
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white hover:bg-opacity-20 p-1"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}