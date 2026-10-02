import React, { useEffect, useState } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';

export const InstallPrompt: React.FC = () => {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [dismissed, setDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if running as standalone PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Guide user to use browser menu
      alert('Chrome/Browser મેનૂ (⋮) માં જઈને "Add to Home screen" પસંદ કરો.');
    }
  };

  if (isInstalled || dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-accent/70 rounded-2xl p-3.5 mb-4 shadow-soft flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0 shadow-xs">
          <Smartphone className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="text-sm font-extrabold text-primary leading-tight">
            {t('settings.install_app')}
          </h4>
          <p className="text-xs text-secondary mt-0.5 leading-tight">
            {t('settings.install_desc')}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <Button
          size="md"
          variant="accent"
          fullWidth={false}
          onClick={handleInstallClick}
          className="!min-h-[38px] !px-3 !py-1 text-xs"
          leftIcon={<Download className="w-3.5 h-3.5" />}
        >
          ઇન્સ્ટોલ
        </Button>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
