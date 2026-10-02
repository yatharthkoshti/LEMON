import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Users, Star, CheckCircle2, Plus, ArrowRight, ShieldAlert } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { OpenStreetMap } from '../../components/map/OpenStreetMap';
import { WorkerProfile } from '../../types';
import { Button } from '../../components/ui/Button';

export const PosterMapScreen: React.FC = () => {
  const { t } = useTranslation();
  const { workers, jobs, assignWorkerToJob, showToast } = useAppStore();

  const [selectedWorker, setSelectedWorker] = useState<WorkerProfile>(workers[0] || null);

  const ahmedabadCenter: [number, number] = [23.0335, 72.5485];

  const handleQuickAssign = (workerId: string) => {
    const activeJob = jobs[0];
    if (activeJob) {
      assignWorkerToJob(activeJob.id, workerId);
      showToast('શ્રમિકને સફળતાપૂર્વક કામ ફાળવવામાં આવ્યું!', 'success');
    }
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-extrabold text-primary font-heading tracking-tight">
          {t('poster_map.title')}
        </h2>
        <p className="text-xs sm:text-sm text-secondary font-medium">
          {t('poster_map.subtitle')}
        </p>
      </div>

      {/* Free OpenStreetMap View */}
      <div className="relative">
        <OpenStreetMap
          center={selectedWorker ? [selectedWorker.locationCoords.lat, selectedWorker.locationCoords.lng] : ahmedabadCenter}
          zoom={13}
          workers={workers}
          jobs={jobs}
          selectedWorkerId={selectedWorker?.id}
          onSelectWorker={(worker) => setSelectedWorker(worker)}
          height="380px"
        />

        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3.5 py-1.5 rounded-full text-xs font-bold shadow-soft text-primary z-10 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>{t('poster_map.total_pins', { count: workers.length })}</span>
        </div>
      </div>

      {/* Selected Worker Detail Card (PRD: show name, skill, rating, availability, attendance, distance) */}
      {selectedWorker && (
        <div className="bg-card rounded-4xl p-5 sm:p-6 border border-gray-200 shadow-soft-lg space-y-4 animate-fade-in">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Initials badge - STRICTLY NO PHOTO */}
              <div className="w-14 h-14 rounded-2xl bg-accent/30 border-2 border-accent text-primary font-heading font-extrabold flex items-center justify-center text-xl shadow-2xs">
                {selectedWorker.name.substring(0, 2)}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-secondary">
                  {t('poster_map.selected_worker')}
                </span>
                <h3 className="text-lg font-bold text-primary leading-tight">
                  {selectedWorker.name}
                </h3>
                <p className="text-xs text-secondary mt-0.5 capitalize">
                  {selectedWorker.skills.map(s => s.replace('_', ' ')).join(', ')}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="font-heading text-2xl text-primary leading-none block">
                ₹{selectedWorker.dailyWage}
              </span>
              <span className="text-[10px] font-bold text-secondary">
                / દિવસ
              </span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold text-gray-700 bg-gray-50 p-2.5 rounded-2xl">
            <div>
              <span className="text-[10px] text-secondary block">રેટિંગ</span>
              <span className="font-bold text-amber-900 mt-0.5 block">⭐ {selectedWorker.rating}</span>
            </div>
            <div>
              <span className="text-[10px] text-secondary block">હાજરી</span>
              <span className="font-bold text-emerald-700 mt-0.5 block">{selectedWorker.attendanceRate}%</span>
            </div>
            <div>
              <span className="text-[10px] text-secondary block">અનુભવ</span>
              <span className="font-bold text-primary mt-0.5 block">{selectedWorker.experience} વર્ષ</span>
            </div>
            <div>
              <span className="text-[10px] text-secondary block">અંતર</span>
              <span className="font-bold text-primary mt-0.5 block">૨.૮ km</span>
            </div>
          </div>

          {/* Assign Button */}
          <Button
            variant="primary"
            size="lg"
            onClick={() => handleQuickAssign(selectedWorker.id)}
            leftIcon={<Plus className="w-5 h-5 text-accent stroke-[3]" />}
          >
            {t('poster_map.assign_now')}
          </Button>
        </div>
      )}

      {/* List of Nearby Workers below Map */}
      <div>
        <h3 className="text-base font-extrabold text-primary font-heading tracking-tight mb-3">
          નજીકના તમામ કારીગરો (Scrollable List)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {workers.map((worker) => (
            <div
              key={worker.id}
              onClick={() => setSelectedWorker(worker)}
              className={`p-4 rounded-3xl border-2 cursor-pointer transition-all flex items-center justify-between select-none ${
                selectedWorker?.id === worker.id
                  ? 'bg-amber-50/90 border-primary shadow-soft'
                  : 'bg-card border-gray-100 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/30 font-heading font-bold text-primary flex items-center justify-center text-sm">
                  {worker.name.substring(0, 2)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-primary">{worker.name}</h4>
                  <span className="text-[11px] text-secondary capitalize">{worker.skills[0]?.replace('_', ' ')}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-primary block">₹{worker.dailyWage}</span>
                <span className="text-[10px] font-semibold text-emerald-700">{worker.attendanceRate}% હાજરી</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
