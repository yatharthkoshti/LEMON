import React, { useState } from 'react';
import { Globe, ArrowLeftRight, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { Language } from '../../types';

interface HeaderProps {
  onOpenSettings?: () => void;
  showInstallBanner?: boolean;
  onInstallClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  showInstallBanner,
  onInstallClick
}) => {
  const { t } = useTranslation();
  const { language, setLanguage, isAvailableToday, setPortal } = useAppStore();
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const languages: { code: Language; label: string; script: string }[] = [
    { code: 'gu', label: 'Gujarati', script: 'ગુજરાતી' },
    { code: 'hi', label: 'Hindi', script: 'हिन्दी' },
    { code: 'en', label: 'English', script: 'EN' }
  ];

  const handleSelectLang = (code: Language) => {
    setLanguage(code);
    setLangMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-2xs max-w-lg mx-auto">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Lemon Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-soft">
            <span className="text-xl">🍋</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading text-2xl tracking-wide text-primary leading-none">
                LEMON
              </span>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-sm bg-accent text-primary">
                Worker
              </span>
            </div>
            <p className="text-[11px] font-semibold text-secondary leading-tight flex items-center gap-1">
              <span
                className={`w-2 h-2 rounded-full ${
                  isAvailableToday ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
                }`}
              />
              {isAvailableToday ? t('home.status_available') : t('home.status_unavailable')}
            </p>
          </div>
        </div>

        {/* Right Actions: Portal Switcher + Language Selector */}
        <div className="flex items-center gap-2">
          {/* Switch to Job Poster */}
          <button
            onClick={() => setPortal('job_poster')}
            className="px-2.5 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-950 font-bold text-xs flex items-center gap-1 shadow-2xs hover:bg-amber-100 active:scale-95 transition-all"
            title={t('portal.switch_to_poster')}
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-primary" />
            <span className="font-extrabold">Poster 🏢</span>
          </button>

          {/* Quick Language Switcher Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200 text-xs font-bold text-primary active:scale-95 transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-secondary" />
              <span className="uppercase">{language}</span>
              <span className="text-gray-400 text-[10px]">▼</span>
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-card rounded-2xl shadow-soft-lg border border-gray-100 py-1.5 z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleSelectLang(lang.code)}
                    className={`w-full text-left px-3 py-2 text-sm font-semibold flex items-center justify-between hover:bg-gray-50 ${
                      language === lang.code ? 'bg-accent/25 text-primary font-bold' : 'text-gray-700'
                    }`}
                  >
                    <span>{lang.script}</span>
                    {language === lang.code && <span className="text-emerald-600 font-bold">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
