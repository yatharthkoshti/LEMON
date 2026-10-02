import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Briefcase, Filter, Sparkles, MapPin, IndianRupee } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { JobCard } from '../components/jobs/JobCard';
import { SpeechButton } from '../components/ui/SpeechButton';

export const JobsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { jobs, openJobDetails } = useAppStore();

  const [activeFilter, setActiveFilter] = useState<'all' | 'today' | 'high_wage' | 'nearby'>('all');

  const filteredJobs = jobs.filter((job) => {
    if (activeFilter === 'today') {
      return job.date.includes('આજે') || job.date.includes('Today');
    }
    if (activeFilter === 'high_wage') {
      return job.dailyWage >= 1200;
    }
    if (activeFilter === 'nearby') {
      return job.distanceKm <= 5.0;
    }
    return true;
  });

  return (
    <div className="space-y-4 pb-24">
      {/* Title & Speech */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-primary tracking-tight font-heading">
            {t('jobs.title')}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-secondary">
            {t('jobs.subtitle')}
          </p>
        </div>
        <SpeechButton
          textToSpeak={`${t('jobs.title')}. ${t('jobs.subtitle')}`}
          size="sm"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {[
          { id: 'all', labelKey: 'jobs.filter_all', count: jobs.length },
          { id: 'today', labelKey: 'jobs.filter_today', count: jobs.filter(j => j.date.includes('આજે') || j.date.includes('Today')).length },
          { id: 'high_wage', labelKey: 'jobs.filter_high_wage', count: jobs.filter(j => j.dailyWage >= 1200).length },
          { id: 'nearby', labelKey: 'jobs.filter_nearby', count: jobs.filter(j => j.distanceKm <= 5).length }
        ].map((chip) => {
          const isActive = activeFilter === chip.id;
          return (
            <button
              key={chip.id}
              onClick={() => setActiveFilter(chip.id as any)}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-150 border select-none ${
                isActive
                  ? 'bg-primary text-white border-primary shadow-soft'
                  : 'bg-card text-secondary-dark border-gray-200 hover:border-gray-300'
              }`}
            >
              <span>{t(chip.labelKey)}</span>
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[11px] ${
                isActive ? 'bg-accent text-primary font-black' : 'bg-gray-100 text-gray-600'
              }`}>
                {chip.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Job Cards Feed */}
      {filteredJobs.length > 0 ? (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} onOpenDetails={openJobDetails} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-card rounded-4xl border border-dashed border-gray-200 my-6">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-gray-700">
            કોઈ કામ મળ્યું નથી
          </h4>
          <p className="text-xs text-secondary mt-1">
            અન્ય ફિલ્ટર પસંદ કરો અથવા નવી ઓફરની રાહ જુઓ.
          </p>
        </div>
      )}
    </div>
  );
};
