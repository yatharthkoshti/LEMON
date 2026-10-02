import React from 'react';
import { Briefcase, Map, CalendarCheck, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { NavigationTab } from '../../types';

export const BottomNavigation: React.FC = () => {
  const { t } = useTranslation();
  const { activeTab, setActiveTab, jobs } = useAppStore();

  const assignedCount = jobs.filter(j => j.status === 'assigned').length;

  const tabs: { id: NavigationTab; labelKey: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'home', labelKey: 'nav.home', icon: Map },
    { id: 'jobs', labelKey: 'nav.jobs', icon: Briefcase, badge: assignedCount },
    { id: 'my_work', labelKey: 'nav.my_work', icon: CalendarCheck },
    { id: 'profile', labelKey: 'nav.profile', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom)] max-w-[430px] mx-auto">
      <div className="grid grid-cols-4 h-16 items-center px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === 'home'
            ? activeTab === 'home' || activeTab === 'map'
            : activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center h-full py-1 transition-all duration-150 select-none ${
                isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {isActive && (
                <div className="absolute top-1.5 w-12 h-8 bg-accent/40 rounded-full -z-10 animate-fade-in" />
              )}

              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'}`} />
                {Boolean(tab.badge && tab.badge > 0) && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] bg-lemonRed text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 shadow-xs border border-white">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className={`text-[10px] mt-0.5 font-bold tracking-tight truncate max-w-[64px] ${isActive ? 'font-black text-primary' : ''}`}>
                {t(tab.labelKey)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
