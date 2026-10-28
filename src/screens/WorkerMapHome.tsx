import React, { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Check, CheckCircle2, Globe, MapPin, Navigation, Sparkles, Clock, Car, Footprints, Volume2
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

  const activeJob = useMemo(
    () => jobs.find((j) => (j.status === 'assigned' || j.status === 'accepted') && j.assignedWorkers.some((w) => w.workerId === profile.id)),
    [jobs, profile.id]
  );

  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!activeJob?.acceptanceTimerStartedAt) {
      setTimeLeft(null);
      return;
    }
    
    const start = new Date(activeJob.acceptanceTimerStartedAt).getTime();
    const end = start + 10 * 60 * 1000;

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((end - now) / 1000));
      setTimeLeft(remaining);
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeJob?.acceptanceTimerStartedAt]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

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

  const renderUnitTypes = (types?: string[]) => {
    if (!types || types.length === 0 || (types.length === 1 && types[0] === 'any')) return null;
    return (
      <div className="flex flex-wrap gap-1 mt-1.5">
        {types.filter(t => t !== 'any').map(type => {
          let bg = 'bg-gray-100', text = 'text-gray-700', label = type;
          if (type === 'individual') { bg = 'bg-blue-100'; text = 'text-blue-700'; label = t('unit_type.individual', 'Individual'); }
          else if (type === 'group') { bg = 'bg-orange-100'; text = 'text-orange-700'; label = t('unit_type.group', 'Group'); }
          else if (type === 'family') { bg = 'bg-purple-100'; text = 'text-purple-700'; label = t('unit_type.family', 'Family'); }
          else if (type === 'friends') { bg = 'bg-pink-100'; text = 'text-pink-700'; label = t('unit_type.friends', 'Friends'); }
          else if (type === 'mixed') { bg = 'bg-gray-200'; text = 'text-gray-700'; label = t('unit_type.mixed', 'Mixed'); }
          
          return (
            <span key={type} className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${bg} ${text}`}>
              {label}
            </span>
          );
        })}
      </div>
    );
  };

  const renderTransportBadge = (transportProvided?: boolean) => {
    if (transportProvided === true) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
          <Car className="w-3 h-3 text-emerald-600" />
          <span>{t('jobs.transport_provided', 'વાહન મળશે (Transport Included)')}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-300">
        <Footprints className="w-3 h-3 text-red-600" />
        <span>{t('jobs.transport_self', 'જાતે પહોંચવું (Self Arrange Transport)')}</span>
      </span>
    );
  };

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

        {sheetTab === 'nearby' && activeJob ? (
          <div className="space-y-4 pb-2">
            <div className="rounded-3xl border border-orange-200 bg-orange-50 p-4 space-y-3">
              <h3 className="text-lg font-black text-orange-600 leading-tight">
                {t('group_timer.active_job_title', 'Active Job in Progress')}
              </h3>
              <p className="text-sm font-semibold text-orange-800">
                {t('group_timer.active_job_msg', 'You must complete your current job before applying to new ones.')}
              </p>
              
              <div className="bg-white rounded-2xl p-3 shadow-soft-sm">
                <p className="text-[10px] font-black uppercase text-secondary">{activeJob.company}</p>
                <h4 className="text-base font-bold text-primary leading-tight mt-0.5">{activeJob.title}</h4>
                <p className="text-xs font-semibold text-gray-600 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-lemonRed shrink-0" />
                  <span>{activeJob.location}</span>
                </p>
                <p className="text-sm font-heading text-primary mt-2">₹{activeJob.dailyWage} <span className="text-[10px] font-bold text-secondary">/ day</span></p>
              </div>
              
              {activeJob.acceptanceTimerStartedAt && timeLeft !== null && (
                <div className="flex items-center gap-2 p-2 rounded-xl bg-orange-100 border border-orange-200">
                  <Clock className="w-5 h-5 text-orange-600 shrink-0" />
                  {timeLeft > 0 ? (
                    <span className="text-sm font-bold text-orange-700">
                      {t('group_timer.acceptance_pending', 'Group Acceptance Pending:')} {formatTime(timeLeft)}
                    </span>
                  ) : (
                    <span className="text-sm font-bold text-gray-500">
                      {t('group_timer.invitation_expired', 'Group Invitation Expired')}
                    </span>
                  )}
                </div>
              )}

              {activeJob.assignedWorkers.find(w => w.workerId === profile.id)?.memberAcceptances && profile.members.length > 0 && (
                <div className="space-y-2 mt-2">
                  {profile.members.map(member => {
                    const accepted = activeJob.assignedWorkers.find(w => w.workerId === profile.id)?.memberAcceptances?.[member.id];
                    return (
                      <div key={member.id} className="flex items-center justify-between text-sm bg-white p-2.5 rounded-xl border border-gray-100">
                        <span className="font-semibold text-primary">{member.name}</span>
                        <div className="flex items-center gap-1.5">
                          {accepted ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span className="text-emerald-700 text-xs font-bold">{t('group_timer.accepted', 'Accepted')}</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-4 h-4 text-orange-500" />
                              <span className="text-orange-600 text-xs font-bold">{t('group_timer.pending', 'Pending')}</span>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <Button variant="primary" size="md" onClick={() => openJobDetails(activeJob)}>
                {t('group_timer.view_active_job', 'View Active Job')}
              </Button>
            </div>
          </div>
        ) : selectedJob && sheetTab === 'nearby' ? (
          <div className="space-y-4 pb-2">
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
                  <div className="mt-1.5 flex flex-wrap gap-1.5 items-center">
                    {renderTransportBadge(selectedJob.transportProvided)}
                    {selectedJob.voiceDescriptionUrl && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                        <Volume2 className="w-3 h-3 text-amber-600" />
                        <span>વોઇસ મેસેજ (Voice Note)</span>
                      </span>
                    )}
                  </div>
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
                      {renderUnitTypes(job.requestedUnitTypes)}
                      <p className="text-[11px] font-semibold text-secondary truncate mt-0.5">
                        {job.location}
                      </p>
                      <div className="flex flex-wrap gap-1.5 items-center mt-1">
                        <span className="text-[11px] font-bold text-primary">{job.distanceKm} km</span>
                        {renderTransportBadge(job.transportProvided)}
                        {job.voiceDescriptionUrl && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                            <Volume2 className="w-2.5 h-2.5" /> Voice
                          </span>
                        )}
                      </div>
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
