import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, MapPin, Calendar, Clock, Navigation, 
  Check, AlertCircle, FileText, CheckCircle2, ShieldAlert, Camera,
  Car, Footprints, Volume2, Play, Pause, MessageSquare, AlertOctagon
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Job } from '../../types';
import { Button } from '../ui/Button';
import { SpeechButton } from '../ui/SpeechButton';
import { OpenStreetMap } from '../map/OpenStreetMap';
import { useAppStore } from '../../store/useAppStore';
import { DisputeModal } from './DisputeModal';
import { GroupChatModal } from './GroupChatModal';

interface JobDetailsModalProps {
  job: Job | null;
  onClose: () => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ job, onClose }) => {
  const { t } = useTranslation();
  const { acceptJob, declineJob, completeJob, applyForJob, setCheckInModalJob, showToast, profile } = useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [groupChatOpen, setGroupChatOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
    onClose();
  };

  const handleComplete = () => {
    setIsProcessing(true);
    setTimeout(() => {
      completeJob(job.id);
      setIsProcessing(false);
      showToast(t('my_work.completed_success'), 'success');
      onClose();
    }, 400);
  };

  const toggleVoicePlayback = () => {
    if (!audioRef.current) return;
    if (isPlayingVoice) {
      audioRef.current.pause();
      setIsPlayingVoice(false);
    } else {
      audioRef.current.play();
      setIsPlayingVoice(true);
    }
  };

  const fullSpeechText = `${job.title}। કંપની: ${job.company}। સ્થળ: ${job.location}। દૈનિક વેતન: ₹${job.dailyWage}। સમય: ${job.time}। ${job.transportProvided ? 'વાહન વ્યવહાર મળશે।' : 'વાહન જાતે કરવાનું રહેશે।'}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${job.mapCoords.lat},${job.mapCoords.lng}`;

  return (
    <>
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

          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="relative w-full max-w-lg bg-card rounded-t-4xl sm:rounded-3xl shadow-soft-lg border border-gray-100 z-10 max-h-[90vh] flex flex-col overflow-hidden font-body"
          >
            {/* Header Bar */}
            <div className="flex items-center justify-between p-4 px-5 border-b border-gray-100 bg-white sticky top-0 z-20 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xl">📋</span>
                <h2 className="font-heading text-xl text-primary tracking-tight">
                  {t('jobs.job_details')}
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
            <div className="p-5 space-y-4 overflow-y-auto flex-1 pb-6">
              {/* Job Title & Wage Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <span className="text-xs font-black uppercase text-secondary tracking-wider block mb-1">
                    {job.company}
                  </span>
                  <h3 className="text-xl font-extrabold text-primary leading-tight font-heading">
                    {job.title}
                  </h3>
                </div>

                <div className="text-right shrink-0 bg-yellow-50/90 border border-accent/70 rounded-2xl px-4 py-2.5 shadow-2xs">
                  <span className="font-heading text-3xl text-primary block leading-none">
                    ₹{job.dailyWage}
                  </span>
                  <span className="text-xs font-bold text-secondary-dark block mt-0.5">
                    {t('jobs.per_day')}
                  </span>
                </div>
              </div>

              {/* Transportation Option Banner (Green if Provided, Red if Worker Arranges) */}
              <div className={`p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 ${
                job.transportProvided === true
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                  : 'bg-red-50 border-red-400 text-red-900'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    job.transportProvided === true ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {job.transportProvided === true ? <Car className="w-5 h-5" /> : <Footprints className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm leading-tight">
                      {job.transportProvided === true 
                        ? 'વાહન વ્યવહાર મળશે (Transport Included)' 
                        : 'શ્રમિકે જાતે પહોંચવું પડશે (Self Arrange Transport)'}
                    </h4>
                    <p className="text-xs opacity-80 mt-0.5 font-medium">
                      {job.transportProvided === true
                        ? 'The job poster provides transport to and from site.'
                        : 'Workers must arrange their own transport to the work site.'}
                    </p>
                  </div>
                </div>

                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md shrink-0 ${
                  job.transportProvided === true ? 'bg-emerald-200 text-emerald-900' : 'bg-red-200 text-red-900'
                }`}>
                  {job.transportProvided === true ? 'Provided' : 'Self'}
                </span>
              </div>

              {/* Voice Description Audio Player if attached by Poster */}
              {job.voiceDescriptionUrl && (
                <div className="bg-amber-50/90 p-4 rounded-3xl border border-amber-300 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-5 h-5 text-amber-800" />
                      <h4 className="font-bold text-sm text-amber-950">
                        માલિકનો ઓડિયો સંદેશ (Employer Voice Note)
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                      Voice JD
                    </span>
                  </div>

                  <div className="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-amber-200">
                    <button
                      type="button"
                      onClick={toggleVoicePlayback}
                      className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary shrink-0 shadow-xs active:scale-95 transition-all"
                    >
                      {isPlayingVoice ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </button>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-primary">
                        {isPlayingVoice ? 'વાત સાંભળી રહ્યા છો... (Playing)' : 'સાંભળવા માટે દબાવો (Tap to Listen)'}
                      </p>
                      <p className="text-[11px] text-gray-500 font-medium">Clear job details directly from poster</p>
                    </div>
                    <audio
                      ref={audioRef}
                      src={job.voiceDescriptionUrl}
                      onEnded={() => setIsPlayingVoice(false)}
                      className="hidden"
                    />
                  </div>
                </div>
              )}

              {/* Audio Listen Bar */}
              <div className="flex items-center justify-between bg-amber-50/80 p-3 rounded-2xl border border-accent/40">
                <span className="text-xs font-bold text-primary">
                  {t('jobs.listen_summary')}
                </span>
                <SpeechButton textToSpeak={fullSpeechText} size="sm" label={t('jobs.listen_audio')} />
              </div>

              {/* Group Chat Access (If job has workers assigned or accepted) */}
              {(job.assignedWorkers.length > 0 || job.workersAssignedCount > 0) && (
                <div className="bg-blue-50/80 p-3.5 rounded-2xl border border-blue-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-900">કામનું ગ્રૂપ ચેટ (Work Group Chat)</p>
                      <p className="text-[11px] text-blue-700">સભ્યોના ફોન નંબર અને વોઇસ મેસેજ</p>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setGroupChatOpen(true)}
                    className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700"
                  >
                    Open Chat
                  </Button>
                </div>
              )}

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
            <div className="p-4 border-t border-gray-100 bg-white/95 backdrop-blur-xs pb-safe shrink-0 mt-auto">
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
              ) : job.status === 'completed' ? (
                <div className="space-y-2">
                  <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                    <p className="text-xs font-bold text-emerald-800">✓ કામ પૂર્ણ થયેલ છે (Job Completed)</p>
                  </div>
                  <Button
                    variant="danger"
                    size="lg"
                    onClick={() => setDisputeModalOpen(true)}
                    leftIcon={<AlertOctagon className="w-5 h-5" />}
                  >
                    Report Dispute (ફરિયાદ કરો - lemonabuses@gmail.com)
                  </Button>
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

      {/* Dispute Modal */}
      <DisputeModal
        job={job}
        isOpen={disputeModalOpen}
        onClose={() => setDisputeModalOpen(false)}
      />

      {/* Group Chat Modal */}
      <GroupChatModal
        job={job}
        isOpen={groupChatOpen}
        onClose={() => setGroupChatOpen(false)}
      />
    </>
  );
};
