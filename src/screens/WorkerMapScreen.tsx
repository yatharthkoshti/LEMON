import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Navigation, IndianRupee, ArrowRight, Check, Sparkles } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { OpenStreetMap } from '../components/map/OpenStreetMap';
import { Job } from '../types';
import { Button } from '../components/ui/Button';
import { SpeechButton } from '../components/ui/SpeechButton';

export const WorkerMapScreen: React.FC = () => {
  const { t } = useTranslation();
  const { jobs, openJobDetails, applyForJob, showToast } = useAppStore();

  const [selectedJob, setSelectedJob] = useState<Job>(jobs[0] || null);

  const ahmedabadCenter: [number, number] = [23.0225, 72.5714];

  const handleApply = (jobId: string) => {
    applyForJob(jobId);
    showToast(t('jobs.applied_success'), 'success');
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-primary tracking-tight font-heading">
            {t('worker_map.title')}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-secondary">
            {t('worker_map.jobs_found', { count: jobs.length })}
          </p>
        </div>
        <SpeechButton textToSpeak={`${t('worker_map.title')}. ${t('worker_map.subtitle')}`} size="sm" />
      </div>

      {/* Free OpenStreetMap */}
      <div className="relative">
        <OpenStreetMap
          center={selectedJob ? [selectedJob.mapCoords.lat, selectedJob.mapCoords.lng] : ahmedabadCenter}
          zoom={13}
          jobs={jobs}
          selectedJobId={selectedJob?.id}
          onSelectJob={(job) => setSelectedJob(job)}
          height="320px"
        />

        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold shadow-xs text-primary z-10 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
          <span>{t('worker_map.tap_pin')}</span>
        </div>
      </div>

      {/* Selected Job Card Drawer */}
      {selectedJob && (
        <div className="bg-card rounded-4xl p-5 border border-gray-200 shadow-soft-lg space-y-4 animate-fade-in">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-black uppercase text-secondary tracking-wide">
                {selectedJob.company}
              </span>
              <h3 className="text-lg font-bold text-primary leading-tight mt-0.5">
                {selectedJob.title}
              </h3>
              <p className="text-xs font-semibold text-gray-600 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-lemonRed shrink-0" />
                <span>{selectedJob.location}</span>
                <span className="font-bold text-primary ml-1">
                  ({selectedJob.distanceKm} km away)
                </span>
              </p>
            </div>

            <div className="text-right shrink-0 bg-yellow-50 border border-accent/60 rounded-2xl px-3 py-2">
              <span className="font-heading text-2xl text-primary leading-none block">
                ₹{selectedJob.dailyWage}
              </span>
              <span className="text-[10px] font-bold text-secondary">
                / દિવસ
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => openJobDetails(selectedJob)}
            >
              {t('jobs.view_details')}
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={() => handleApply(selectedJob.id)}
              leftIcon={<Check className="w-5 h-5 text-accent stroke-[3]" />}
            >
              {t('jobs.apply')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
