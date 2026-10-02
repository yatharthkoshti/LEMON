import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertCircle, Briefcase, CheckCircle2, Clock, MapPin, Navigation, Plus, PlusCircle, Sparkles, Users
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { OpenStreetMap } from '../../components/map/OpenStreetMap';
import { BottomSheet, SheetTabs, SnapPoint } from '../../components/ui/BottomSheet';
import { Button } from '../../components/ui/Button';
import { Job, WorkerProfile } from '../../types';
import { usePosterMenu } from '../../components/poster/PosterLayout';

export const PosterMapHome: React.FC = () => {
  const { t } = useTranslation();
  const { openMenu } = usePosterMenu();
  const {
    workers,
    jobs,
    posterProfile,
    assignWorkerToJob,
    toggleShortlistWorker,
    setPosterTab,
    showToast,
  } = useAppStore();

  const [selectedWorker, setSelectedWorker] = useState<WorkerProfile | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [sheetSnap, setSheetSnap] = useState<SnapPoint>('peek');
  const [sheetTab, setSheetTab] = useState('workers');
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    posterProfile.locationCoords.lat,
    posterProfile.locationCoords.lng,
  ]);

  const todaysJobs = jobs.filter((j) => j.date.includes('આજે') || j.date.includes('Today'));
  const upcomingJobs = jobs.filter((j) => !j.date.includes('આજે') && !j.date.includes('Today'));
  const pendingPaymentJobs = jobs.filter((j) => j.paymentStatus === 'pending');
  const totalAssignedWorkers = jobs.reduce((acc, j) => acc + j.workersAssignedCount, 0);

  const handleSelectWorker = (worker: WorkerProfile) => {
    setSelectedWorker(worker);
    setSelectedJob(null);
    setMapCenter([worker.locationCoords.lat, worker.locationCoords.lng]);
    setSheetSnap('half');
    setSheetTab('workers');
  };

  const handleSelectJob = (job: Job) => {
    setSelectedJob(job);
    setSelectedWorker(null);
    setMapCenter([job.mapCoords.lat, job.mapCoords.lng]);
    setSheetSnap('half');
    setSheetTab('jobs');
  };

  const handleAssign = (workerId: string) => {
    const target = selectedJob || jobs[0];
    if (!target) return;
    assignWorkerToJob(target.id, workerId);
    showToast(t('map_home_poster.assign_worker'), 'success');
  };

  const handleLocate = () => {
    setSelectedWorker(null);
    setSelectedJob(null);
    setMapCenter([posterProfile.locationCoords.lat, posterProfile.locationCoords.lng]);
  };

  const sheetTabs = useMemo(
    () => [
      { id: 'workers', label: t('map_home_poster.tab_workers'), badge: workers.length },
      { id: 'jobs', label: t('map_home_poster.tab_my_jobs'), badge: jobs.length },
      { id: 'dashboard', label: t('map_home_poster.tab_dashboard') },
    ],
    [t, workers.length, jobs.length]
  );

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-gray-200">
      <div className="absolute inset-0">
        <OpenStreetMap
          center={mapCenter}
          zoom={13}
          workers={workers}
          jobs={jobs}
          selectedWorkerId={selectedWorker?.id}
          selectedJobId={selectedJob?.id}
          onSelectWorker={handleSelectWorker}
          onSelectJob={handleSelectJob}
          fullScreen
        />
      </div>

      <div className="absolute top-0 left-0 right-0 z-20 pt-[max(12px,env(safe-area-inset-top))] px-3 pointer-events-none">
        <div className="max-w-[430px] mx-auto flex items-start justify-between gap-2">
          <button
            type="button"
            onClick={openMenu}
            className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-soft px-3 py-2 flex items-center gap-2"
          >
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-lg">🍋</span>
            </div>
            <div className="text-left">
              <p className="font-heading text-lg leading-none text-primary">LEMON</p>
              <p className="text-[10px] font-bold text-secondary truncate max-w-[140px]">
                {posterProfile.companyName}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPosterTab('create_job')}
            className="pointer-events-auto flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-primary text-white text-xs font-black shadow-soft"
          >
            <Plus className="w-4 h-4 text-accent" />
            {t('map_home_poster.create_job_fab')}
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleLocate}
        className="absolute right-3 z-20 p-3 rounded-full bg-white shadow-soft-lg"
        style={{ bottom: 168 }}
        aria-label="Locate me"
      >
        <Navigation className="w-5 h-5 text-primary" />
      </button>

      <BottomSheet
        snap={sheetSnap}
        onSnapChange={setSheetSnap}
        peekHeight={132}
        peekContent={
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-primary">
                {t('map_home_poster.workers_nearby', { count: workers.length })}
              </p>
              <p className="text-[11px] font-semibold text-secondary">
                {t('map_home_poster.active_jobs', { count: jobs.length })}
              </p>
            </div>
            <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-accent" />
              {t('map_home.swipe_up')}
            </span>
          </div>
        }
      >
        <SheetTabs tabs={sheetTabs} activeTab={sheetTab} onTabChange={setSheetTab} />

        {sheetTab === 'workers' && (
          <div className="space-y-2">
            {selectedWorker && (
              <div className="rounded-3xl border border-gray-100 bg-gray-50 p-4 space-y-3 mb-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-accent/30 border-2 border-accent font-heading font-extrabold flex items-center justify-center text-lg">
                      {selectedWorker.name.substring(0, 2)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-primary leading-tight">{selectedWorker.name}</h3>
                      <p className="text-xs text-secondary capitalize">
                        {selectedWorker.skills.map((s) => s.replace('_', ' ')).join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-heading text-xl text-primary">₹{selectedWorker.dailyWage}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-semibold bg-white p-2 rounded-2xl">
                  <div>⭐ {selectedWorker.rating}</div>
                  <div className="text-emerald-700">{selectedWorker.attendanceRate}%</div>
                  <div>{selectedWorker.experience} yr</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => toggleShortlistWorker(selectedWorker.id)}
                  >
                    {selectedWorker.isShortlisted
                      ? t('map_home_poster.shortlisted_worker')
                      : t('map_home_poster.shortlist_worker')}
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => handleAssign(selectedWorker.id)}
                    leftIcon={<Plus className="w-4 h-4 text-accent" />}
                  >
                    {t('map_home_poster.assign_worker')}
                  </Button>
                </div>
              </div>
            )}

            {workers.length === 0 ? (
              <p className="py-8 text-center text-sm font-semibold text-gray-400">
                {t('map_home_poster.no_nearby_workers')}
              </p>
            ) : (
              workers.map((worker) => (
                <button
                  key={worker.id}
                  type="button"
                  onClick={() => handleSelectWorker(worker)}
                  className={`w-full text-left p-3.5 rounded-2xl border-2 flex items-center justify-between ${
                    selectedWorker?.id === worker.id
                      ? 'bg-amber-50 border-primary'
                      : 'bg-white border-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-accent/30 font-heading font-bold flex items-center justify-center text-sm shrink-0">
                      {worker.name.substring(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-primary truncate">{worker.name}</p>
                      <p className="text-[11px] text-secondary capitalize truncate">
                        {worker.skills[0]?.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold">₹{worker.dailyWage}</p>
                    <p className="text-[10px] font-semibold text-emerald-700">{worker.attendanceRate}%</p>
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {sheetTab === 'jobs' && (
          <div className="space-y-2">
            {jobs.length === 0 ? (
              <div className="py-8 text-center space-y-3">
                <p className="text-sm font-semibold text-gray-400">{t('map_home_poster.no_posted_jobs')}</p>
                <Button size="md" onClick={() => setPosterTab('create_job')} leftIcon={<PlusCircle className="w-4 h-4 text-accent" />}>
                  {t('map_home_poster.create_job_fab')}
                </Button>
              </div>
            ) : (
              jobs.map((job) => (
                <button
                  key={job.id}
                  type="button"
                  onClick={() => handleSelectJob(job)}
                  className={`w-full text-left p-3.5 rounded-2xl border-2 ${
                    selectedJob?.id === job.id ? 'bg-amber-50 border-primary' : 'bg-white border-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-primary truncate">{job.title}</p>
                      <p className="text-[11px] font-semibold text-secondary flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{job.location}</span>
                      </p>
                      <p className="text-[11px] font-bold mt-1">
                        {job.workersAssignedCount}/{job.workersRequired} {t('poster_nav.workers')}
                      </p>
                    </div>
                    <p className="font-heading text-lg text-primary">₹{job.dailyWage}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {sheetTab === 'dashboard' && (
          <div className="space-y-4">
            <p className="text-xs font-black uppercase tracking-wide text-secondary">
              {t('map_home_poster.quick_stats')}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Stat icon={<Briefcase className="w-4 h-4" />} label={t('poster_overview.stat_todays_jobs')} value={todaysJobs.length} />
              <Stat icon={<Users className="w-4 h-4" />} label={t('poster_overview.stat_workers_assigned')} value={totalAssignedWorkers} />
              <Stat icon={<Clock className="w-4 h-4" />} label={t('poster_overview.stat_pending_confirmations')} value={1} />
              <Stat icon={<AlertCircle className="w-4 h-4 text-lemonRed" />} label={t('poster_overview.stat_payment_pending')} value={pendingPaymentJobs.length} />
              <Stat icon={<CheckCircle2 className="w-4 h-4 text-emerald-700" />} label={t('poster_overview.stat_attendance_rate')} value="97%" />
              <Stat icon={<Briefcase className="w-4 h-4" />} label={t('poster_overview.stat_upcoming_jobs')} value={upcomingJobs.length} />
            </div>

            <p className="text-xs font-black uppercase tracking-wide text-secondary">
              {t('map_home_poster.quick_actions')}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPosterTab('create_job')}
                className="p-4 rounded-2xl bg-primary text-white text-left text-xs font-bold h-24 flex flex-col justify-between"
              >
                <PlusCircle className="w-5 h-5 text-accent" />
                {t('poster_overview.btn_create_job')}
              </button>
              <button
                type="button"
                onClick={() => setPosterTab('workers')}
                className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-left text-xs font-bold h-24 flex flex-col justify-between"
              >
                <Users className="w-5 h-5" />
                {t('poster_overview.btn_view_workers')}
              </button>
              <button
                type="button"
                onClick={() => setPosterTab('jobs')}
                className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-left text-xs font-bold h-24 flex flex-col justify-between"
              >
                <Briefcase className="w-5 h-5" />
                {t('poster_overview.btn_view_jobs')}
              </button>
              <button
                type="button"
                onClick={() => setPosterTab('analytics')}
                className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-left text-xs font-bold h-24 flex flex-col justify-between"
              >
                <CheckCircle2 className="w-5 h-5" />
                {t('poster_nav.analytics')}
              </button>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
};

const Stat: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({
  icon,
  label,
  value,
}) => (
  <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
    <div className="flex items-center gap-1.5 text-secondary mb-1">{icon}</div>
    <p className="text-[10px] font-bold text-secondary truncate">{label}</p>
    <p className="font-heading text-xl text-primary">{value}</p>
  </div>
);
