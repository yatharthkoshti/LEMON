import React, { useState, useMemo } from 'react';
import { 
  Briefcase, Calendar, Clock, MapPin, Users, Copy, 
  Trash2, XCircle, Eye, AlertCircle, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { Job, JobStatus } from '../../types';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';
import { DateSelectorBar } from '../../components/ui/DateSelectorBar';
import { formatDateToIso, matchesJobDate } from '../../utils/dateUtils';

interface PosterJobsScreenProps {
  onViewJobDetail: (job: Job) => void;
}

export const PosterJobsScreen: React.FC<PosterJobsScreenProps> = ({ onViewJobDetail }) => {
  const { t } = useTranslation();
  const { jobs, duplicateJob, cancelJob, deleteJob, showToast } = useAppStore();

  const [activeTab, setActiveTab] = useState<'all' | 'today' | 'upcoming' | 'completed' | 'cancelled' | 'pending_payment'>('all');
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [selectedJobForDelete, setSelectedJobForDelete] = useState<Job | null>(null);
  const [selectedJobForCancel, setSelectedJobForCancel] = useState<Job | null>(null);

  const todayIso = useMemo(() => formatDateToIso(new Date()), []);

  // Job counts for date badges
  const jobCountByDate = useMemo(() => {
    const counts: Record<string, number> = {};
    jobs.forEach((job) => {
      if (job.targetDate) {
        counts[job.targetDate] = (counts[job.targetDate] || 0) + 1;
      } else {
        const dLower = (job.date || '').toLowerCase();
        if (dLower.includes('આજે') || dLower.includes('today')) {
          counts[todayIso] = (counts[todayIso] || 0) + 1;
        }
      }
    });
    return counts;
  }, [jobs, todayIso]);

  // Filter jobs by both status tab AND selected date
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // 1. Date filter
      if (selectedDate !== 'all') {
        if (!matchesJobDate(job, selectedDate)) return false;
      }

      // 2. Status tab filter
      if (activeTab === 'today') return matchesJobDate(job, todayIso);
      if (activeTab === 'upcoming') return job.status === 'upcoming';
      if (activeTab === 'completed') return job.status === 'completed';
      if (activeTab === 'cancelled') return job.status === 'cancelled';
      if (activeTab === 'pending_payment') return job.paymentStatus === 'pending' || job.paymentStatus === 'pending_verification';
      return true;
    });
  }, [jobs, selectedDate, activeTab, todayIso]);

  const handleDuplicate = (job: Job) => {
    duplicateJob(job.id);
    showToast(t('poster_jobs.job_duplicated_toast'), 'success');
  };

  const handleConfirmCancel = () => {
    if (selectedJobForCancel) {
      cancelJob(selectedJobForCancel.id);
      showToast(t('poster_jobs.job_cancelled_toast'), 'info');
      setSelectedJobForCancel(null);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedJobForDelete) {
      deleteJob(selectedJobForDelete.id);
      showToast(t('poster_jobs.job_deleted_toast'), 'info');
      setSelectedJobForDelete(null);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-extrabold text-primary font-heading tracking-tight">
          {t('poster_jobs.title')}
        </h2>
        <p className="text-xs sm:text-sm text-secondary font-medium">
          {t('poster_jobs.subtitle')}
        </p>
      </div>

      {/* Hotel-Style Date Selector */}
      <div className="bg-white rounded-3xl p-2 border border-gray-100 shadow-2xs">
        <div className="flex items-center justify-between px-2 pt-1 pb-1.5">
          <span className="text-[11px] font-black uppercase text-secondary tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            તારીખ મુજબ ફિલ્ટર (Filter By Date)
          </span>
          {selectedDate !== 'all' && (
            <button
              onClick={() => setSelectedDate('all')}
              className="text-[11px] font-bold text-primary underline"
            >
              બધા દિવસ (Show All)
            </button>
          )}
        </div>
        <DateSelectorBar
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          showAllOption={true}
          jobCountByDate={jobCountByDate}
          compact={true}
        />
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {[
          { id: 'all', labelKey: 'poster_jobs.filter_all' },
          { id: 'today', labelKey: 'poster_jobs.filter_today' },
          { id: 'upcoming', labelKey: 'poster_jobs.filter_upcoming' },
          { id: 'completed', labelKey: 'poster_jobs.filter_completed' },
          { id: 'pending_payment', labelKey: 'poster_jobs.filter_pending_payment' }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-primary text-white border-primary shadow-soft'
                  : 'bg-card text-secondary-dark border-gray-200 hover:border-gray-300'
              }`}
            >
              {t(tab.labelKey)}
            </button>
          );
        })}
      </div>

      {/* Job Cards */}
      {filteredJobs.length > 0 ? (
        <div className="space-y-4">
          {filteredJobs.map((job) => {
            const acceptedWorkersCount = job.assignedWorkers.filter(w => w.status === 'accepted' || w.status === 'checked_in').length;
            const pendingWorkersCount = job.assignedWorkers.filter(w => w.status === 'invited' || w.status === 'applied').length;

            return (
              <div
                key={job.id}
                className="bg-card rounded-3xl p-5 border border-gray-100 shadow-soft space-y-4 select-none"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-bold text-secondary uppercase">
                        {job.category}
                      </span>
                      {job.paymentStatus === 'pending' || job.paymentStatus === 'pending_verification' ? (
                        <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                          {job.paymentStatus === 'pending_verification' ? 'ચકાસણી બાકી (Pending Approval)' : 'ચુકવણી બાકી (Payment Pending)'}
                        </span>
                      ) : (
                        <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          ચુકવાયેલ (Paid)
                        </span>
                      )}
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 capitalize">
                        {job.status}
                      </span>
                    </div>

                    <h3
                      onClick={() => onViewJobDetail(job)}
                      className="text-lg font-bold text-primary hover:text-accent-dark cursor-pointer transition-colors"
                    >
                      {job.title}
                    </h3>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-heading text-2xl text-primary block leading-none">
                      ₹{job.dailyWage}
                    </span>
                    <span className="text-[10px] font-bold text-secondary">
                      / શ્રમિક દીઠ
                    </span>
                  </div>
                </div>

                {/* Info row */}
                <div className="flex items-center gap-4 text-xs font-semibold text-secondary flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    {job.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    {job.time}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    {job.location}
                  </span>
                </div>

                {/* Worker quota bar */}
                <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-secondary flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-primary" />
                      શ્રમિકોની સ્થિતિ (Workers Status)
                    </span>
                    <span className="text-primary">
                      {job.workersAssignedCount} / {job.workersRequired} જરૂરિયાત
                    </span>
                  </div>

                  {/* Progress track */}
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${(acceptedWorkersCount / job.workersRequired) * 100}%` }}
                      className="bg-emerald-500 h-full"
                    />
                    <div
                      style={{ width: `${(pendingWorkersCount / job.workersRequired) * 100}%` }}
                      className="bg-amber-400 h-full"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-medium text-gray-500 pt-1">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      હાજર / પુષ્ટિ થયેલ: <strong>{acceptedWorkersCount}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      અરજી / આમંત્રણ: <strong>{pendingWorkersCount}</strong>
                    </span>
                    <span>
                      બાકી જગ્યા: <strong>{Math.max(0, job.workersRequired - job.workersAssignedCount)}</strong>
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => handleDuplicate(job)}
                      leftIcon={<Copy className="w-3.5 h-3.5" />}
                    >
                      {t('poster_jobs.btn_duplicate')}
                    </Button>

                    {job.status !== 'cancelled' && job.status !== 'completed' && (
                      <Button
                        variant="secondary"
                        size="md"
                        onClick={() => setSelectedJobForCancel(job)}
                        leftIcon={<XCircle className="w-3.5 h-3.5 text-lemonRed" />}
                      >
                        {t('poster_jobs.btn_cancel')}
                      </Button>
                    )}

                    <button
                      type="button"
                      onClick={() => setSelectedJobForDelete(job)}
                      className="p-2.5 rounded-xl text-gray-400 hover:text-lemonRed hover:bg-red-50 transition-colors"
                      aria-label="Delete job"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => onViewJobDetail(job)}
                    rightIcon={<ChevronRight className="w-4 h-4" />}
                  >
                    {t('poster_jobs.btn_manage')}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-card rounded-3xl p-10 text-center border border-gray-100 shadow-soft space-y-3">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
            <Briefcase className="w-8 h-8" />
          </div>
          <h3 className="font-heading text-lg font-bold text-primary">
            {t('poster_jobs.no_jobs_title')}
          </h3>
          <p className="text-xs sm:text-sm text-secondary max-w-sm mx-auto">
            {selectedDate !== 'all' 
              ? 'આ તારીખે કોઈ જોબ મળેલ નથી. ઉપરથી અન્ય તારીખ પસંદ કરો અથવા નવી જોબ પોસ્ટ કરો.'
              : t('poster_jobs.no_jobs_desc')}
          </p>
          {selectedDate !== 'all' && (
            <Button
              variant="outline"
              size="md"
              onClick={() => setSelectedDate('all')}
              className="mt-2"
            >
              બધી જોબ્સ બતાવો (Show All Jobs)
            </Button>
          )}
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      <Dialog
        isOpen={Boolean(selectedJobForCancel)}
        onClose={() => setSelectedJobForCancel(null)}
        title={t('poster_jobs.cancel_dialog_title')}
        confirmText={t('poster_jobs.cancel_dialog_confirm')}
        cancelText={t('poster_jobs.cancel_dialog_cancel')}
        onConfirm={handleConfirmCancel}
        confirmVariant="danger"
      >
        <p className="text-sm text-secondary leading-relaxed">
          {t('poster_jobs.cancel_dialog_message')}
        </p>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={Boolean(selectedJobForDelete)}
        onClose={() => setSelectedJobForDelete(null)}
        title={t('poster_jobs.delete_dialog_title')}
        confirmText={t('poster_jobs.delete_dialog_confirm')}
        cancelText={t('poster_jobs.delete_dialog_cancel')}
        onConfirm={handleConfirmDelete}
        confirmVariant="danger"
      >
        <p className="text-sm text-secondary leading-relaxed">
          {t('poster_jobs.delete_dialog_message')}
        </p>
      </Dialog>
    </div>
  );
};
