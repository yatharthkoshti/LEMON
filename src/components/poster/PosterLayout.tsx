import React, { createContext, useContext, useState } from 'react';
import {
  PlusCircle, Briefcase, Users, Map,
  BarChart3, User, Globe, ArrowLeftRight, Menu, X, ShieldCheck
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { PosterTab, Language } from '../../types';

interface PosterLayoutProps {
  children: React.ReactNode;
  forceOverlay?: boolean;
}

const PosterMenuContext = createContext({ openMenu: () => {} });
export const usePosterMenu = () => useContext(PosterMenuContext);

export const PosterLayout: React.FC<PosterLayoutProps> = ({ children, forceOverlay = false }) => {
  const { t } = useTranslation();
  const {
    posterTab, setPosterTab, posterProfile, setPortal,
    language, setLanguage, jobs
  } = useAppStore();

  const [menuOpen, setMenuOpen] = useState(false);

  const pendingCount = jobs.filter(j => j.paymentStatus === 'pending').length;

  // Map-first: the 'overview' tab now shows the map home
  // Other tabs overlay on top as full-screen panels
  const isMapHome = !forceOverlay && (posterTab === 'overview' || posterTab === 'map');

  const languages: { code: Language; label: string }[] = [
    { code: 'gu', label: 'ગુજરાતી' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'en', label: 'English' }
  ];

  const overlayNavItems: { id: PosterTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'create_job', label: t('poster_nav.create_job'), icon: PlusCircle },
    { id: 'jobs', label: t('poster_nav.jobs'), icon: Briefcase },
    { id: 'workers', label: t('poster_nav.workers'), icon: Users },
    { id: 'analytics', label: t('poster_nav.analytics'), icon: BarChart3 },
    { id: 'profile', label: t('poster_nav.profile'), icon: User },
  ];

  // When on the map home, children render the PosterMapHome (full screen) 
  // No chrome needed — the map home has its own floating UI
  const menuValue = { openMenu: () => setMenuOpen(true) };

  if (isMapHome) {
    return (
      <PosterMenuContext.Provider value={menuValue}>
      <div className="min-h-screen bg-background text-primary font-body">
        {children}
        
        {/* Slide-out Menu (for accessing non-map tabs) */}
        {menuOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />
            {/* Menu Panel */}
            <div className="relative w-72 max-w-[80vw] h-full bg-white shadow-2xl flex flex-col animate-slide-in-left">
              {/* Header */}
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center">
                      <span className="text-xl">🍋</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-heading text-xl text-primary leading-none">LEMON</span>
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-accent text-primary">
                          Poster
                        </span>
                      </div>
                      <p className="text-[11px] font-bold text-secondary truncate max-w-[150px]">
                        {posterProfile.companyName}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="p-2 rounded-xl hover:bg-gray-100"
                  >
                    <X className="w-5 h-5 text-secondary" />
                  </button>
                </div>

                {/* Role Badge */}
                <div className="bg-yellow-50 border border-accent/60 rounded-2xl p-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-amber-900 block">
                      {t('poster_overview.badge_role')}
                    </span>
                    <span className="text-xs font-bold text-primary capitalize">
                      {posterProfile.posterType === 'staffing_agency'
                        ? t('poster_role_select.staffing_agency')
                        : posterProfile.posterType === 'individual'
                        ? t('poster_role_select.individual')
                        : t('poster_role_select.business')}
                    </span>
                  </div>
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>
              </div>

              {/* Nav Items */}
              <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
                {/* Map Home */}
                <button
                  onClick={() => { setPosterTab('overview'); setMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl font-bold text-sm transition-all ${
                    isMapHome ? 'bg-primary text-white shadow-soft' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Map className={`w-5 h-5 ${isMapHome ? 'text-accent' : 'text-secondary'}`} />
                  <span>{t('poster_nav.map')}</span>
                </button>

                {overlayNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = posterTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setPosterTab(item.id); setMenuOpen(false); }}
                      className={`w-full flex items-center justify-between gap-3 px-3.5 py-3 rounded-2xl font-bold text-sm transition-all ${
                        isActive ? 'bg-primary text-white shadow-soft' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${isActive ? 'text-accent' : 'text-secondary'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.id === 'jobs' && pendingCount > 0 && (
                        <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                          isActive ? 'bg-accent text-primary' : 'bg-lemonRed text-white'
                        }`}>
                          {pendingCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Bottom: Switch Portal + Language */}
              <div className="p-4 border-t border-gray-100 space-y-3">
                <button
                  onClick={() => { setPortal('worker'); setMenuOpen(false); }}
                  className="w-full py-3 px-3 rounded-2xl bg-amber-100/70 border border-amber-300 text-amber-950 font-bold text-xs flex items-center justify-center gap-2 hover:bg-amber-200 active:scale-95 transition-all"
                >
                  <ArrowLeftRight className="w-4 h-4 text-primary" />
                  <span>{t('portal.switch_to_worker')}</span>
                </button>

                <div className="flex items-center justify-between px-1 text-xs font-semibold text-secondary">
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Language:</span>
                  </span>
                  <div className="flex gap-1">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => setLanguage(l.code)}
                        className={`px-2 py-0.5 rounded-md font-bold text-xs ${
                          language === l.code ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {l.code.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      </PosterMenuContext.Provider>
    );
  }

  // Overlay mode: when viewing create_job, jobs, workers, analytics, or profile
  // These render as full-screen overlays with a back-to-map button
  return (
    <PosterMenuContext.Provider value={menuValue}>
    <div className="min-h-screen bg-background text-primary font-body">
      {/* Top bar with back-to-map */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPosterTab('overview')}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <Map className="w-5 h-5 text-primary" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl">🍋</span>
            <span className="font-heading text-lg text-primary">LEMON</span>
            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-accent text-primary">
              Poster
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPortal('worker')}
            className="p-2 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 font-bold text-xs flex items-center gap-1"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold hidden sm:inline">Worker</span>
          </button>

          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200"
          >
            <Menu className="w-5 h-5 text-primary" />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="w-full max-w-3xl mx-auto px-4 py-5 pb-8">
        {children}
      </main>

      {/* Slide-out menu (reused) */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] h-full bg-white shadow-2xl flex flex-col">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🍋</span>
                <span className="font-heading text-lg text-primary">LEMON</span>
              </div>
              <button onClick={() => setMenuOpen(false)} className="p-2 rounded-xl hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
              <button
                onClick={() => { setPosterTab('overview'); setMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl font-bold text-sm text-gray-700 hover:bg-gray-100"
              >
                <Map className="w-5 h-5 text-secondary" />
                <span>{t('poster_nav.map')}</span>
              </button>
              {overlayNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = posterTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setPosterTab(item.id); setMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl font-bold text-sm transition-all ${
                      isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-accent' : 'text-secondary'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => { setPortal('worker'); setMenuOpen(false); }}
                className="w-full py-3 rounded-2xl bg-amber-100/70 border border-amber-300 text-amber-950 font-bold text-xs flex items-center justify-center gap-2"
              >
                <ArrowLeftRight className="w-4 h-4" />
                <span>{t('portal.switch_to_worker')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </PosterMenuContext.Provider>
  );
};
