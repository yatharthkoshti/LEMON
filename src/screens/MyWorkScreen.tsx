import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarCheck, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { JobCard } from '../components/jobs/JobCard';
import { SpeechButton } from '../components/ui/SpeechButton';

export const MyWorkScreen: React.FC = () => {
  const { t } = useTranslation();
  const { jobs, openJobDetails } = useAppStore();

  const [activeSubTab, setActiveSubTab] = useState<'today' | 'upcoming' | 'completed' | 'cancelled'>('today');

  const getJobsByTab = () => {
    switch (activeSubTab) {
      case 'today':
        return jobs.filter((j) => (j.date.includes('આજે') || j.date.includes('Today')) && j.status !== 'declined');
      case 'upcoming':
        return jobs.filter((j) => !j.date.includes('આજે') && !j.date.includes('Today') && j.status !== 'declined' && j.status !== 'completed');
      case 'completed':
        return jobs.filter((j) => j.status === 'completed');
      case 'cancelled':
        return jobs.filter((j) => j.status === 'declined' || j.status === 'cancelled');
      default:
        return [];
    }
  };

  const displayedJobs = getJobsByTab();

  return (
    <div className="space-y-4 pb-24">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-primary tracking-tight font-heading">
            {t('my_work.title')}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-secondary">
            તમારું દૈનિક અને પૂર્ણ થયેલ કામ
          </p>
        </div>
        <SpeechButton textToSpeak={t('my_work.title')} size="sm" />
      </div>

      {/* Sub Tabs */}
      <div className="grid grid-cols-4 gap-1.5 p-1 bg-gray-200/70 rounded-2xl">
        {[
          { id: 'today', labelKey: 'my_work.tab_today' },
          { id: 'upcoming', labelKey: 'my_work.tab_upcoming' },
          { id: 'completed', labelKey: 'my_work.tab_completed' },
          { id: 'cancelled', labelKey: 'my_work.tab_cancelled' }
        ].map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`py-2 px-1 rounded-xl text-xs font-bold transition-all text-center select-none truncate ${
                isActive
                  ? 'bg-white text-primary shadow-xs'
                  : 'text-secondary-dark hover:text-primary'
              }`}
            >
              {t(tab.labelKey)}
            </button>
          );
        })}
      </div>

      {/* Content Feed */}
      {displayedJobs.length > 0 ? (
        <div className="space-y-4">
          {displayedJobs.map((job) => (
            <JobCard key={job.id} job={job} onOpenDetails={openJobDetails} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-card rounded-4xl border border-dashed border-gray-200 my-6">
          <CalendarCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-gray-700">
            {t('my_work.no_work_in_tab')}
          </h4>
          <p className="text-xs text-secondary mt-1">
            નવું કામ સ્વીકારવા માટે હોમ સ્ક્રીન પર ફાળવેલ કામ જુઓ.
          </p>
        </div>
      )}
    </div>
  );
};
