import React, { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Check, CheckCircle2, Globe, MapPin, Navigation, Sparkles, Clock, Car, Footprints, Volume2, Calendar
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { OpenStreetMap } from '../components/map/OpenStreetMap';
import { BottomSheet, SheetTabs, SnapPoint } from '../components/ui/BottomSheet';
import { Button } from '../components/ui/Button';
import { DateSelectorBar } from '../components/ui/DateSelectorBar';
import { Job, Language } from '../types';
import { formatDateToIso, matchesJobDate } from '../utils/dateUtils';

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

  // Date selection state: default to 'today' (ISO string of current day)
  const todayIso = useMemo(() => formatDateToIso(new Date()), []);
  const [selectedDate, setSelectedDate] = useState<string>(todayIso);

  const languages: { code: Language; label: string }[] = [
    { code: 'gu', label: 'ગુજરાતી' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'en', label: 'EN' },
  ];

  // Filter jobs by selected date
  const dateFilteredJobs = useMemo(() => {
    return jobs.filter((job) => matchesJobDate(job, selectedDate));
  }, [jobs, selectedDate]);

  // Count jobs per date for badges
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

  const wages = dateFilteredJobs.map((j) => j.dailyWage);
  const minWage = wages.length ? Math.min(...wages) : 0;
  const maxWage = wages.length ? Math.max(...wages) : 0;

  const myWork = useMemo(
    () => dateFilteredJobs.filter((j) => j.assignedWorkers.some((w) => w.workerId === profile.id)),
    [dateFilteredJobs, profile.id]
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

  const listJobs = sheetTab === 'my_work' ? myWork : dateFilteredJobs;

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
          jobs={dateFilteredJobs}
          selectedJobId={selectedJob?.id}
          onSelectJob={handleSelectJob}
          fullScreen
        />
      </div>

      {/* Top Header & Hotel-Booking Style Date Selector */}
      <div className="absolute top-0 left-0 right-0 z-20 pt-[max(10px,env(safe-area-inset-top))] px-3 pointer-events-none">
        <div className="max-w-[430px] mx-auto space-y-2">
          {/* Top Brand Bar */}
          <div className="flex items-start justify-between gap-2">
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

          {/* Hotel-Style Date Selector Strip */}
          <div className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-soft p-1.5 border border-white/60">
            <DateSelectorBar
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              showAllOption={true}
              jobCountByDate={jobCountByDate}
              compact={true}
            />
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
                {t('map_home.jobs_nearby', { count: dateFilteredJobs.length })}
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
        <div className="px-4 pb-4 space-y-3">
          <SheetTabs
            tabs={[
              { id: 'nearby', label: t('map_home.tab_nearby'), badge: dateFilteredJobs.length },
              { id: 'my_work', label: t('map_home.tab_my_work'), badge: myWork.length },
            ]}
            activeTab={sheetTab}
            onTabChange={setSheetTab}
          />

          {/* Active Job Alert Card with 10-Minute Timer if applicable */}
          {activeJob && sheetTab === 'my_work' && (
            <div className="bg-yellow-50 border-2 border-primary/20 rounded-2xl p-3 shadow-soft space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-primary bg-accent/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {t('map_home.active_job_alert', 'સક્રિય કામ (Active Job)')}
                </span>
                {timeLeft !== null && (
                  <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${timeLeft > 120 ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-red-500 text-white'}`}>
                    {t('map_home.acceptance_timer', 'બાકી સમય')}: {formatTime(timeLeft)}
                  </span>
                )}
              </div>
              <p className="font-heading text-sm font-bold text-primary">{activeJob.title}</p>
              <p className="text-xs text-secondary">{activeJob.company} • ₹{activeJob.dailyWage}/day</p>
              {timeLeft !== null && (
                <p className="text-[10px] text-gray-500 font-medium">
                  {t('map_home.timer_desc', 'બધા સભ્યો ૧૦ મિનિટમાં સ્વીકારે તે જરૂરી છે, નહીં તો અન્યને તક મળશે.')}
                </p>
              )}
            </div>
          )}

          {/* Active Job Warning: if worker is already on an active job, display note */}
          {activeJob && sheetTab === 'nearby' && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-2.5 text-xs text-blue-900 font-medium flex items-center justify-between">
              <span>{t('map_home.already_active_job', 'તમારી પાસે હાલમાં સક્રિય જોબ છે. પૂર્ણ થાય પછી નવું કામ સ્વીકારી શકાશે.')}</span>
            </div>
          )}

          <div className="space-y-2">
            {listJobs.length === 0 ? (
              <div className="py-8 text-center text-secondary text-sm">
                <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="font-bold text-primary">{t('map_home.no_jobs')}</p>
                <p className="text-xs text-gray-400 mt-1">
                  આ તારીખે કોઈ જોબ મળેલ નથી. ઉપરથી બીજી તારીખ અથવા 'બધું' પસંદ કરો.
                </p>
              </div>
            ) : (
              listJobs.map((job) => {
                const isSelected = selectedJob?.id === job.id;
                const isAssignedToMe = job.assignedWorkers.some((w) => w.workerId === profile.id);
                const hasActiveBlock = Boolean(activeJob && !isAssignedToMe);

                return (
                  <div
                    key={job.id}
                    onClick={() => handleSelectJob(job)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-yellow-50/50 shadow-soft'
                        : 'border-gray-100 bg-white shadow-2xs hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="font-heading text-sm font-bold text-primary">
                            {job.title}
                          </p>
                          {job.voiceDescriptionUrl && (
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                              <Volume2 className="w-2.5 h-2.5 text-blue-600" />
                              <span>Voice JD</span>
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] font-semibold text-secondary">
                          {job.company}
                        </p>
                        
                        {renderUnitTypes(job.requestedUnitTypes)}

                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-primary" />
                            {job.date}
                          </span>
                          <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-primary" />
                            {job.distanceKm} km
                          </span>
                          {renderTransportBadge(job.transportProvided)}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="font-heading text-base font-black text-primary leading-none">
                          ₹{job.dailyWage}
                        </p>
                        <p className="text-[10px] font-semibold text-secondary">
                          {t('jobs.per_day')}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openJobDetails(job);
                        }}
                        className="text-xs font-bold text-primary underline"
                      >
                        {t('jobs.view_details')}
                      </button>

                      {isAssignedToMe ? (
                        <span className="text-xs font-bold text-primary flex items-center gap-1 bg-accent/40 px-2.5 py-1 rounded-xl">
                          <Check className="w-3.5 h-3.5" />
                          {t('jobs.assigned_badge')}
                        </span>
                      ) : (
                        <Button
                          variant="primary"
                          size="md"
                          disabled={hasActiveBlock}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApply(job.id);
                          }}
                        >
                          {t('jobs.apply_button')}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};
