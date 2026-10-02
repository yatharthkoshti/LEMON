import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, Users, Check, X, ChevronRight, AlertTriangle, Camera } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Job } from '../../types';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { SpeechButton } from '../ui/SpeechButton';
import { Dialog } from '../ui/Dialog';
import { useAppStore } from '../../store/useAppStore';

interface JobCardProps {
  job: Job;
  onOpenDetails?: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onOpenDetails }) => {
  const { t } = useTranslation();
  const { acceptJob, declineJob, applyForJob, showToast, openJobDetails, setCheckInModalJob, profile } = useAppStore();

  const [confirmAcceptOpen, setConfirmAcceptOpen] = useState(false);
  const [confirmDeclineOpen, setConfirmDeclineOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const isAssignedToCurrentWorker = job.assignedWorkers.some(w => w.workerId === profile.id);
  const myAssignment = job.assignedWorkers.find(w => w.workerId === profile.id);
  const isCheckedIn = myAssignment?.status === 'checked_in';

  const handleOpenDetails = () => {
    if (onOpenDetails) {
      onOpenDetails(job);
    } else {
      openJobDetails(job);
    }
  };

  const handleConfirmAccept = () => {
    setIsActionLoading(true);
    setTimeout(() => {
      acceptJob(job.id);
      setIsActionLoading(false);
      setConfirmAcceptOpen(false);
      showToast(t('jobs.accepted_success'), 'success');
    }, 400);
  };

  const handleConfirmDecline = () => {
    setIsActionLoading(true);
    setTimeout(() => {
      declineJob(job.id);
      setIsActionLoading(false);
      setConfirmDeclineOpen(false);
      showToast(t('jobs.declined_success'), 'info');
    }, 300);
  };

  const handleApply = () => {
    applyForJob(job.id);
    showToast(t('jobs.applied_success'), 'success');
  };

  // Text for low-literacy audio readout (Strictly NO phone numbers!)
  const audioSummary = `${job.title}। કંપની: ${job.company}। સ્થળ: ${job.location}। રોજનું વેતન: ₹${job.dailyWage}। સમય: ${job.time}।`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="bg-card rounded-3xl p-5 border border-gray-100 shadow-soft hover:shadow-soft-lg transition-all relative overflow-hidden font-body"
    >
      {/* Top Accent Strip if Urgent or High Wage */}
      {job.dailyWage >= 1200 && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-accent" />
      )}

      {/* Header: Company & Wage */}
      <div className="flex items-start justify-between gap-3 mb-3.5">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs font-extrabold uppercase tracking-wide text-secondary">
              {job.company}
            </span>
            {job.urgent && (
              <span className="bg-red-50 text-lemonRed border border-red-200 text-[11px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> જરૂરી (Urgent)
              </span>
            )}
            {job.status === 'accepted' && (
              <StatusBadge status="accepted" label={t('jobs.accepted_badge')} size="sm" />
            )}
            {isCheckedIn && (
              <span className="bg-purple-100 text-purple-900 border border-purple-200 text-[11px] font-bold px-2 py-0.5 rounded-full">
                ✓ {t('jobs.checked_in')}
              </span>
            )}
          </div>

          <h3
            onClick={handleOpenDetails}
            className="text-lg font-bold text-primary leading-snug cursor-pointer hover:text-accent-dark transition-colors line-clamp-2"
          >
            {job.title}
          </h3>
        </div>

        {/* Daily Wage Pill in Anton Typography */}
        <div className="text-right shrink-0 bg-yellow-50/80 border border-accent/60 rounded-2xl px-3 py-2 shadow-2xs">
          <div className="flex items-baseline justify-end gap-0.5">
            <span className="font-heading text-2xl text-primary leading-none">
              ₹{job.dailyWage}
            </span>
          </div>
          <span className="text-[11px] font-bold text-secondary-dark block">
            {t('jobs.per_day')}
          </span>
        </div>
      </div>

      {/* Location & Distance (PRIVACY SAFE: strictly no phone numbers) */}
      <div className="flex items-start gap-2 text-sm text-gray-700 mb-3 bg-gray-50/80 p-2.5 rounded-2xl">
        <MapPin className="w-4 h-4 text-lemonRed shrink-0 mt-0.5" />
        <div className="flex-1 text-xs sm:text-sm font-semibold leading-tight">
          <span>{job.location}</span>
          <span className="inline-block ml-2 text-primary font-bold bg-white px-2 py-0.5 rounded-md border border-gray-200 text-[11px]">
            {job.distanceKm} {t('jobs.km_away')}
          </span>
        </div>
      </div>

      {/* Meta Pills: Date, Time, Workers */}
      <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-secondary-dark mb-4">
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
          <Calendar className="w-4 h-4 text-primary shrink-0" />
          <span className="truncate">{job.date}</span>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
          <Clock className="w-4 h-4 text-primary shrink-0" />
          <span className="truncate">{job.time}</span>
        </div>
        <div className="col-span-2 flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
          <Users className="w-4 h-4 text-primary shrink-0" />
          <span className="font-bold text-primary">{t('jobs.workers_needed')}</span>
          <span className="text-gray-700 truncate">{job.workersRequired} કારીગરો</span>
        </div>
      </div>

      {/* Audio Assistant & View Details button */}
      <div className="flex items-center justify-between gap-2 mb-4 pt-1">
        <SpeechButton textToSpeak={audioSummary} size="sm" />
        
        <button
          onClick={handleOpenDetails}
          className="text-xs font-bold text-primary flex items-center gap-1 hover:underline py-1 px-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <span>{t('jobs.view_details')}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Action Buttons: Accept / Decline / Apply / Check-in */}
      <div className="pt-2 border-t border-gray-100">
        {job.status === 'assigned' ? (
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="danger"
              size="lg"
              onClick={() => setConfirmDeclineOpen(true)}
              leftIcon={<X className="w-5 h-5 stroke-[2.5]" />}
            >
              {t('jobs.decline')}
            </Button>

            <Button
              variant="primary"
              size="lg"
              onClick={() => setConfirmAcceptOpen(true)}
              leftIcon={<Check className="w-5 h-5 stroke-[2.5] text-accent" />}
            >
              {t('jobs.accept')}
            </Button>
          </div>
        ) : job.status === 'accepted' ? (
          <div className="space-y-2">
            {!isCheckedIn ? (
              <Button
                variant="accent"
                size="lg"
                onClick={() => setCheckInModalJob(job)}
                leftIcon={<Camera className="w-5 h-5" />}
              >
                {t('jobs.check_in')}
              </Button>
            ) : (
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-center text-xs font-bold text-emerald-800 flex items-center justify-center gap-2">
                <span>✓ {t('jobs.checked_in')} (હાજરી નોંધાઈ ગઈ)</span>
              </div>
            )}
          </div>
        ) : (
          <Button
            variant="primary"
            size="lg"
            onClick={handleApply}
            leftIcon={<Check className="w-5 h-5 text-accent stroke-[3]" />}
          >
            {t('jobs.apply')}
          </Button>
        )}
      </div>

      {/* Confirm Accept Dialog */}
      <Dialog
        isOpen={confirmAcceptOpen}
        onClose={() => setConfirmAcceptOpen(false)}
        title={t('jobs.confirm_accept_title')}
        confirmText={t('jobs.accept')}
        cancelText={t('common.cancel')}
        confirmVariant="primary"
        onConfirm={handleConfirmAccept}
        isLoading={isActionLoading}
      >
        <p className="font-semibold text-gray-800">
          {t('jobs.confirm_accept_body', {
            company: job.company,
            wage: job.dailyWage
          })}
        </p>
      </Dialog>

      {/* Confirm Decline Dialog */}
      <Dialog
        isOpen={confirmDeclineOpen}
        onClose={() => setConfirmDeclineOpen(false)}
        title={t('jobs.confirm_decline_title')}
        confirmText={t('jobs.decline')}
        cancelText={t('common.cancel')}
        confirmVariant="danger"
        onConfirm={handleConfirmDecline}
        isLoading={isActionLoading}
      >
        <p className="font-semibold text-gray-800">
          {t('jobs.confirm_decline_body')}
        </p>
      </Dialog>
    </motion.div>
  );
};
