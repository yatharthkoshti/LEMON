import React, { useState } from 'react';
import { 
  Briefcase, Calendar, Clock, MapPin, Users, Copy, 
  Trash2, XCircle, Eye, AlertCircle, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { Job, JobStatus } from '../../types';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';

interface PosterJobsScreenProps {
  onViewJobDetail: (job: Job) => void;
}

export const PosterJobsScreen: React.FC<PosterJobsScreenProps> = ({ onViewJobDetail }) => {
  const { t } = useTranslation();
  const { jobs, duplicateJob, cancelJob, deleteJob, showToast } = useAppStore();

  const [activeTab, setActiveTab] = useState<'all' | 'today' | 'upcoming' | 'completed' | 'cancelled' | 'pending_payment'>('all');
  const [selectedJobForDelete, setSelectedJobForDelete] = useState<Job | null>(null);
  const [selectedJobForCancel, setSelectedJobForCancel] = useState<Job | null>(null);

  const filteredJobs = jobs.filter((job) => {
    if (activeTab === 'today') return job.date.includes('આજે') || job.date.includes('Today');
    if (activeTab === 'upcoming') return job.status === 'upcoming';
    if (activeTab === 'completed') return job.status === 'completed';
    if (activeTab === 'cancelled') return job.status === 'cancelled';
    if (activeTab === 'pending_payment') return job.paymentStatus === 'pending';
    return true;
  });

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
    <div className="space-y-5 pb-20">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-extrabold text-primary font-heading tracking-tight">
          {t('poster_jobs.title')}
        </h2>
        <p className="text-xs sm:text-sm text-secondary font-medium">
          {t('poster_jobs.subtitle')}
        </p>
      </div>

      {/* Tabs */}
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
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border ${
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
                      {job.paymentStatus === 'pending' ? (
                        <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-red-100 text-lemonRed border border-red-200">
                          ચુકવણી બાકી (Payment Pending)
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

                {/* Location, Date, Time */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-semibold text-gray-700 bg-gray-50 p-3 rounded-2xl">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-lemonRed shrink-0" />
                    <span className="truncate">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>{job.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>{job.time}</span>
                  </div>
                </div>

                {/* Workers Status Pills */}
                <div className="flex items-center justify-between text-xs font-bold pt-1">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span>{t('poster_jobs.workers_count', { assigned: job.workersAssignedCount, total: job.workersRequired })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {acceptedWorkersCount} કન્ફર્મ
                    </span>
                    {pendingWorkersCount > 0 && (
                      <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                        {pendingWorkersCount} બાકી
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions: View, Duplicate, Cancel, Delete */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 gap-2">
                  <Button
                    size="md"
                    variant="primary"
                    fullWidth={false}
                    onClick={() => onViewJobDetail(job)}
                    className="!min-h-[40px] px-4 text-xs"
                    leftIcon={<Eye className="w-4 h-4 text-accent" />}
                  >
                    {t('poster_jobs.action_view')}
                  </Button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDuplicate(job)}
                      className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                      title={t('poster_jobs.action_duplicate')}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    {job.status !== 'cancelled' && (
                      <button
                        onClick={() => setSelectedJobForCancel(job)}
                        className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 transition-colors"
                        title={t('poster_jobs.action_cancel')}
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedJobForDelete(job)}
                      className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-lemonRed transition-colors"
                      title={t('poster_jobs.action_delete')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-card rounded-4xl border border-dashed border-gray-200">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-gray-600">
            આ શ્રેણીમાં કોઈ કામ મળ્યું નથી.
          </p>
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      <Dialog
        isOpen={Boolean(selectedJobForCancel)}
        onClose={() => setSelectedJobForCancel(null)}
        title="કામ રદ કરવું છે?"
        confirmText="હા, રદ કરો"
        cancelText="પાછા જાઓ"
        confirmVariant="danger"
        onConfirm={handleConfirmCancel}
      >
        <p className="text-sm font-semibold text-gray-800">
          શું તમે ખરેખર "{selectedJobForCancel?.title}" રદ કરવા માંગો છો?
        </p>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={Boolean(selectedJobForDelete)}
        onClose={() => setSelectedJobForDelete(null)}
        title="કામ ડિલીટ કરવું છે?"
        confirmText="ડિલીટ કરો"
        cancelText="રદ કરો"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
      >
        <p className="text-sm font-semibold text-gray-800">
          આ કામ કાયમ માટે હટાવી દેવામાં આવશે. શું તમે આગળ વધવા માંગો છો?
        </p>
      </Dialog>
    </div>
  );
};
