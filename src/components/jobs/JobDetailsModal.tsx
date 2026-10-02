import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, MapPin, Calendar, Clock, Navigation, 
  Check, AlertCircle, FileText, CheckCircle2, ShieldAlert, Camera
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Job } from '../../types';
import { Button } from '../ui/Button';
import { SpeechButton } from '../ui/SpeechButton';
import { OpenStreetMap } from '../map/OpenStreetMap';
import { useAppStore } from '../../store/useAppStore';

interface JobDetailsModalProps {
  job: Job | null;
  onClose: () => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ job, onClose }) => {
  const { t } = useTranslation();
  const { acceptJob, declineJob, completeJob, applyForJob, setCheckInModalJob, showToast, profile } = useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!job) return null;

  const myAssignment = job.assignedWorkers.find(w => w.workerId === profile.id);
  const isCheckedIn = myAssignment?.status === 'checked_in';

  const handleAccept = () => {
    setIsProcessing(true);
    setTimeout(() => {
      acceptJob(job.id);
      setIsProcessing(false);
      showToast(t('jobs.accepted_success'), 'success');
    }, 400);
  };

  const handleDecline = () => {
    setIsProcessing(true);
    setTimeout(() => {
      declineJob(job.id);
      setIsProcessing(false);
      showToast(t('jobs.declined_success'), 'info');
      onClose();
    }, 300);
  };

  const handleApply = () => {
    applyForJob(job.id);
    showToast(t('jobs.applied_success'), 'success');
  };

  const handleComplete = () => {
    setIsProcessing(true);
    setTimeout(() => {
      completeJob(job.id);
      setIsProcessing(false);
      showToast(t('my_work.work_completed_toast'), 'success');
      onClose();
    }, 400);
  };

  // Safe speech readout without exposing private contacts
  const fullSpeechText = `${job.title}। કંપની: ${job.company}। સ્થળ: ${job.location}। દૈનિક વેતન: ₹${job.dailyWage}। સમય: ${job.time}। વર્ણન: ${job.description}।`;

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.mapCoords.address)}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          className="relative w-full max-w-lg bg-card rounded-t-4xl sm:rounded-3xl shadow-soft-lg border border-gray-100 z-10 max-h-[92vh] flex flex-col overflow-hidden font-body"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between p-4 px-5 border-b border-gray-100 bg-white sticky top-0 z-20">
            <div className="flex items-center gap-2">
              <span className="text-xl">📋</span>
              <h2 className="font-heading text-xl text-primary tracking-tight">
                {t('jobs.details_title')}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-primary active:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Wage & Company Hero */}
            <div className="bg-yellow-50/70 border border-accent/70 rounded-3xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase text-secondary tracking-wider">
                  {job.company}
                </p>
                <h3 className="text-xl font-bold text-primary mt-0.5">
                  {job.title}
                </h3>
              </div>
              <div className="text-right shrink-0">
                <span className="font-heading text-3xl text-primary leading-none block">
                  ₹{job.dailyWage}
                </span>
                <span className="text-xs font-bold text-secondary-dark">
                  {t('jobs.per_day')}
                </span>
              </div>
            </div>

            {/* Read Aloud Button for Accessibility */}
            <div className="bg-amber-50/80 p-3 rounded-2xl border border-amber-200 flex items-center justify-between">
              <span className="text-xs font-bold text-amber-950">
                📢 {t('settings.audio_assistant')}
              </span>
              <SpeechButton textToSpeak={fullSpeechText} size="sm" label={t('jobs.listen_audio')} />
            </div>

            {/* Interactive OpenStreetMap Site Location */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-secondary px-1">
                <span>{t('jobs.view_on_map')}</span>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  <Navigation className="w-3.5 h-3.5 text-accent-dark" />
                  <span>Google Maps</span>
                </a>
              </div>
              <OpenStreetMap
                center={[job.mapCoords.lat, job.mapCoords.lng]}
                zoom={14}
                jobs={[job]}
                selectedJobId={job.id}
                height="180px"
              />
              <p className="text-xs text-gray-700 font-semibold flex items-center gap-1.5 px-1">
                <MapPin className="w-3.5 h-3.5 text-lemonRed shrink-0" />
                <span>{job.location} ({job.distanceKm} km away)</span>
              </p>
            </div>

            {/* Date, Time & Workers Needed */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-2 text-secondary mb-1">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold">{t('jobs.date_time')}</span>
                </div>
                <p className="text-sm font-bold text-primary">{job.date}</p>
                <p className="text-xs font-semibold text-gray-600">{job.time}</p>
              </div>

              <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-2 text-secondary mb-1">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold">{t('jobs.workers_needed')}</span>
                </div>
                <p className="text-sm font-bold text-primary">{job.workersRequired} શ્રમિકો</p>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md inline-block mt-1">
                  ચકાસાયેલ સાઇટ
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100">
              <div className="flex items-center gap-2 text-primary font-bold mb-2">
                <FileText className="w-4 h-4" />
                <h4 className="text-sm">{t('jobs.job_desc')}</h4>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {job.description}
              </p>
            </div>

            {/* Site Instructions */}
            <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100">
              <div className="flex items-center gap-2 text-primary font-bold mb-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-700" />
                <h4 className="text-sm">{t('jobs.instructions')}</h4>
              </div>
              <ul className="space-y-2">
                {job.instructions.map((inst, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 font-medium">
                    <span className="w-5 h-5 rounded-full bg-accent/40 text-primary font-bold flex items-center justify-center shrink-0 text-xs mt-0.5">
                      {index + 1}
                    </span>
                    <span>{inst}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sticky Bottom Actions */}
          <div className="p-4 border-t border-gray-100 bg-white/95 backdrop-blur-xs">
            {job.status === 'assigned' ? (
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="danger"
                  size="xl"
                  onClick={handleDecline}
                  isLoading={isProcessing}
                  leftIcon={<X className="w-6 h-6 stroke-[2.5]" />}
                >
                  {t('jobs.decline')}
                </Button>
                <Button
                  variant="primary"
                  size="xl"
                  onClick={handleAccept}
                  isLoading={isProcessing}
                  leftIcon={<Check className="w-6 h-6 stroke-[2.5] text-accent" />}
                >
                  {t('jobs.accept')}
                </Button>
              </div>
            ) : job.status === 'accepted' ? (
              <div className="flex flex-col gap-2">
                {!isCheckedIn ? (
                  <Button
                    variant="accent"
                    size="xl"
                    onClick={() => {
                      onClose();
                      setCheckInModalJob(job);
                    }}
                    leftIcon={<Camera className="w-6 h-6" />}
                  >
                    {t('jobs.check_in')}
                  </Button>
                ) : (
                  <Button
                    variant="success"
                    size="xl"
                    onClick={handleComplete}
                    isLoading={isProcessing}
                    leftIcon={<CheckCircle2 className="w-6 h-6" />}
                  >
                    {t('my_work.mark_completed')}
                  </Button>
                )}
              </div>
            ) : (
              <Button
                variant="primary"
                size="xl"
                onClick={handleApply}
                leftIcon={<Check className="w-6 h-6 text-accent stroke-[3]" />}
              >
                {t('jobs.apply')}
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
