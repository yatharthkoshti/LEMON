import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeftRight, Check, CheckCircle2, Globe, MapPin, Navigation, Sparkles
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { OpenStreetMap } from '../components/map/OpenStreetMap';
import { BottomSheet, SheetTabs, SnapPoint } from '../components/ui/BottomSheet';
import { Button } from '../components/ui/Button';
import { Job, Language } from '../types';

export const WorkerMapHome: React.FC = () => {
  const { t } = useTranslation();
  const {
    jobs,
    profile,
    isAvailableToday,
    toggleAvailability,
    language,
    setLanguage,
    setPortal,
    applyForJob,
    showToast,
    openJobDetails,
  } = useAppStore();

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [sheetSnap, setSheetSnap] = useState<SnapPoint>('peek');
  const [sheetTab, setSheetTab] = useState('nearby');
  const [langOpen, setLangOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    profile.locationCoords.lat,
    profile.locationCoords.lng,
  ]);

  const languages: { code: Language; label: string }[] = [
    { code: 'gu', label: 'ગુજરાતી' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'en', label: 'EN' },
  ];

  const wages = jobs.map((j) => j.dailyWage);
  const minWage = wages.length ? Math.min(...wages) : 0;
  const maxWage = wages.length ? Math.max(...wages) : 0;

  const myWork = useMemo(
    () => jobs.filter((j) => j.assignedWorkers.some((w) => w.workerId === profile.id)),
    [jobs, profile.id]
  );

  const handleSelectJob = (job: Job) => {
    setSelectedJob(job);
    setMapCenter([job.mapCoords.lat, job.mapCoords.lng]);
    setSheetSnap('half');
    setSheetTab('nearby');
  };

  const handleApply = (jobId: string) => {
    applyForJob(jobId);
    showToast(t('map_home.apply_success'), 'success');
  };

  const handleLocate = () => {
    setSelectedJob(null);
    setMapCenter([profile.locationCoords.lat, profile.locationCoords.lng]);
  };

  const handleToggleAvailability = () => {
    toggleAvailability();
    const next = !isAvailableToday;
    showToast(
      next ? t('home.status_available') : t('home.status_unavailable'),
      next ? 'success' : 'info'
    );
  };

  const listJobs = sheetTab === 'my_work' ? myWork : jobs;

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-gray-200">
      <div className="absolute inset-0">
        <OpenStreetMap
          center={mapCenter}
          zoom={13}
          jobs={jobs}
          selectedJobId={selectedJob?.id}
          onSelectJob={handleSelectJob}
          fullScreen
        />
      </div>

      <div className="absolute top-0 left-0 right-0 z-20 pt-[max(12px,env(safe-area-inset-top))] px-3 pointer-events-none">
        <div className="max-w-[430px] mx-auto flex items-start justify-between gap-2">
          <div className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-soft px-3 py-2 flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-lg">🍋</span>
            </div>
            <div>
              <p className="font-heading text-lg leading-none text-primary">LEMON</p>
              <p className="text-[10px] font-bold text-secondary truncate max-w-[120px]">
                {profile.city}
              </p>
            </div>
          </div>

          <div className="pointer-events-auto flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleToggleAvailability}
              className={`px-3 py-2 rounded-2xl text-[11px] font-black uppercase shadow-soft flex items-center gap-1.5 ${
                isAvailableToday ? 'bg-primary text-white' : 'bg-white text-secondary'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isAvailableToday ? 'bg-accent' : 'bg-gray-400'}`} />
              {isAvailableToday ? t('map_home.available_pill') : t('map_home.unavailable_pill')}
            </button>

            <button
              type="button"
              onClick={() => setPortal('job_poster')}
              className="p-2.5 rounded-2xl bg-white shadow-soft"
              title={t('portal.switch_to_poster')}
            >
              <ArrowLeftRight className="w-4 h-4 text-primary" />
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setLangOpen((v) => !v)}
                className="p-2.5 rounded-2xl bg-white shadow-soft"
              >
                <Globe className="w-4 h-4 text-primary" />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-1 w-28 bg-white rounded-xl shadow-soft-lg border border-gray-100 py-1 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-bold ${
                        language === lang.code ? 'bg-accent/30 text-primary' : 'text-gray-700'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleLocate}
        className="absolute right-3 z-20 p-3 rounded-full bg-white shadow-soft-lg"
        style={{ bottom: 'calc(64px + 148px)' }}
        aria-label="Locate me"
      >
        <Navigation className="w-5 h-5 text-primary" />
      </button>

      <BottomSheet
        snap={sheetSnap}
        onSnapChange={setSheetSnap}
        bottomOffset={64}
        peekHeight={132}
        peekContent={
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-primary">
                {t('map_home.jobs_nearby', { count: jobs.length })}
              </p>
              <p className="text-[11px] font-semibold text-secondary">
                {t('map_home.wage_range', { min: minWage, max: maxWage })}
              </p>
            </div>
            <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-accent" />
              {t('map_home.swipe_up')}
            </span>
          </div>
        }
      >
        <SheetTabs
          tabs={[
            { id: 'nearby', label: t('map_home.tab_nearby_jobs'), badge: jobs.length },
            { id: 'my_work', label: t('map_home.tab_my_work'), badge: myWork.length },
          ]}
          activeTab={sheetTab}
          onTabChange={(id) => {
            setSheetTab(id);
            setSelectedJob(null);
          }}
        />

        {selectedJob && sheetTab === 'nearby' ? (
          <div className="space-y-3 pb-2">
            <button
              type="button"
              onClick={() => setSelectedJob(null)}
              className="text-xs font-bold text-primary"
            >
              {t('map_home.back_to_list')}
            </button>

            <div className="rounded-3xl border border-gray-100 bg-gray-50 p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase text-secondary">{selectedJob.company}</p>
                  <h3 className="text-base font-bold text-primary leading-tight mt-0.5">{selectedJob.title}</h3>
                  <p className="text-xs font-semibold text-gray-600 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-lemonRed shrink-0" />
                    <span>{selectedJob.location}</span>
                  </p>
                  <p className="text-[11px] font-bold text-primary mt-1">{selectedJob.distanceKm} km</p>
                </div>
                <div className="text-right shrink-0 bg-yellow-50 border border-accent/60 rounded-2xl px-3 py-2">
                  <span className="font-heading text-2xl text-primary leading-none block">₹{selectedJob.dailyWage}</span>
                  <span className="text-[10px] font-bold text-secondary">/ day</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" size="md" onClick={() => openJobDetails(selectedJob)}>
                  {t('jobs.view_details')}
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleApply(selectedJob.id)}
                  leftIcon={<Check className="w-4 h-4 text-accent stroke-[3]" />}
                >
                  {t('jobs.apply')}
                </Button>
              </div>
            </div>
          </div>
        ) : listJobs.length === 0 ? (
          <div className="py-8 text-center text-sm font-semibold text-gray-400">
            {sheetTab === 'my_work' ? t('map_home.no_work_items') : t('map_home.no_nearby_jobs')}
          </div>
        ) : (
          <div className="space-y-2">
            {listJobs.map((job) => {
              const isMine = job.assignedWorkers.some((w) => w.workerId === profile.id);
              return (
                <button
                  key={job.id}
                  type="button"
                  onClick={() => handleSelectJob(job)}
                  className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all ${
                    selectedJob?.id === job.id
                      ? 'bg-amber-50 border-primary'
                      : 'bg-white border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-primary truncate">{job.title}</p>
                      <p className="text-[11px] font-semibold text-secondary truncate mt-0.5">
                        {job.location}
                      </p>
                      <p className="text-[11px] font-bold text-primary mt-1">{job.distanceKm} km</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-heading text-lg text-primary leading-none">₹{job.dailyWage}</p>
                          {isMine && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-black text-emerald-700 mt-1">
                          <CheckCircle2 className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </BottomSheet>
    </div>
  );
};
