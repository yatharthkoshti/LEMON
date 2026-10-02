import React, { useState } from 'react';
import { 
  Users, Search, Filter, Star, CheckCircle2, Bookmark, 
  MapPin, ShieldAlert, Check, Plus, ArrowRight 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { WorkerProfile } from '../../types';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';

export const PosterWorkersScreen: React.FC = () => {
  const { t } = useTranslation();
  const { workers, jobs, assignWorkerToJob, toggleShortlistWorker, showToast } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrade, setSelectedTrade] = useState<string>('all');
  const [assigningWorker, setAssigningWorker] = useState<WorkerProfile | null>(null);
  const [viewingWorker, setViewingWorker] = useState<WorkerProfile | null>(null);

  const filteredWorkers = workers.filter((worker) => {
    const matchesSearch = worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTrade = selectedTrade === 'all' || worker.skills.includes(selectedTrade);
    return matchesSearch && matchesTrade;
  });

  const handleAssignToJob = (jobId: string) => {
    if (assigningWorker) {
      assignWorkerToJob(jobId, assigningWorker.id);
      showToast(`${assigningWorker.name} ને કામ ફાળવવામાં આવ્યું!`, 'success');
      setAssigningWorker(null);
    }
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Title & Privacy Warning Banner */}
      <div>
        <h2 className="text-2xl font-extrabold text-primary font-heading tracking-tight">
          {t('poster_workers.title')}
        </h2>
        <p className="text-xs sm:text-sm text-secondary font-medium">
          {t('poster_workers.subtitle')}
        </p>
      </div>

      {/* PRIVACY ENFORCEMENT BANNER from PRD */}
      <div className="bg-amber-50 border border-amber-300 rounded-3xl p-3.5 flex items-center gap-3 text-xs font-bold text-amber-950 shadow-2xs">
        <ShieldAlert className="w-5 h-5 text-amber-800 shrink-0" />
        <span>{t('poster_workers.privacy_banner')}</span>
      </div>

      {/* Search and Filter Row */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="કારીગર અથવા કુશળતા શોધો (દા.ત. ટાઇલ્સ, કડિયો)..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-card border border-gray-200 text-sm font-semibold text-primary focus:outline-none focus:border-primary"
          />
        </div>

        <select
          value={selectedTrade}
          onChange={(e) => setSelectedTrade(e.target.value)}
          className="px-4 py-3 rounded-2xl bg-card border border-gray-200 text-xs sm:text-sm font-bold text-primary focus:outline-none focus:border-primary"
        >
          <option value="all">બધા કામ (All Trades)</option>
          <option value="raj_mistri">રાજ મિસ્ત્રી (Raj Mistri)</option>
          <option value="tile_karigar">ટાઇલ્સ કારીગર (Tiles)</option>
          <option value="sariya_karigar">સરિયા કારીગર</option>
          <option value="electrician">ઇલેક્ટ્રિશિયન</option>
          <option value="plumber">પ્લમ્બર</option>
          <option value="painter">કલરકામ (Painter)</option>
          <option value="general_labour">સામાન્ય મજૂર</option>
        </select>
      </div>

      {/* Worker Cards Grid (Strictly NO phone numbers, NO profile photos) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWorkers.map((worker) => (
          <div
            key={worker.id}
            className="bg-card rounded-3xl p-5 border border-gray-200 shadow-soft flex flex-col justify-between select-none hover:shadow-soft-lg transition-all"
          >
            <div>
              {/* Header: Initials Avatar Badge (NO Photo), Rating & Shortlist */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-accent/30 border-2 border-accent text-primary font-heading font-extrabold flex items-center justify-center text-lg shadow-2xs">
                    {worker.name.substring(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-primary">
                      {worker.name}
                    </h3>
                    <span className="text-[11px] font-semibold text-secondary flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-lemonRed" />
                      <span>{worker.city.split(' ')[0]} (૨.૪ કિમી દૂર)</span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    toggleShortlistWorker(worker.id);
                    showToast(worker.isShortlisted ? 'શોર્ટલિસ્ટમાંથી હટાવ્યો' : 'શોર્ટલિસ્ટ ઉમેરાયો', 'info');
                  }}
                  className={`p-2 rounded-xl transition-colors ${
                    worker.isShortlisted ? 'bg-accent text-primary shadow-xs' : 'bg-gray-100 text-gray-500 hover:text-primary'
                  }`}
                  title={t('poster_workers.shortlist')}
                >
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>

              {/* Skills Chips */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {worker.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800"
                  >
                    {skill.replace('_', ' ')}
                  </span>
                ))}
              </div>

              {/* Metrics: Rating, Attendance, Wage */}
              <div className="grid grid-cols-3 gap-1.5 text-center text-xs font-semibold text-gray-700 bg-gray-50 p-2.5 rounded-2xl mb-4">
                <div>
                  <span className="text-[10px] text-secondary block">{t('poster_workers.rating')}</span>
                  <span className="font-bold text-amber-900 mt-0.5 block">⭐ {worker.rating}</span>
                </div>
                <div>
                  <span className="text-[10px] text-secondary block">{t('poster_workers.attendance_rate')}</span>
                  <span className="font-bold text-emerald-700 mt-0.5 block">{worker.attendanceRate}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-secondary block">રોજ:</span>
                  <span className="font-bold text-primary mt-0.5 block">₹{worker.dailyWage}</span>
                </div>
              </div>
            </div>

            {/* Actions: View & Assign */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
              <Button
                size="md"
                variant="secondary"
                onClick={() => setViewingWorker(worker)}
                className="!min-h-[40px] text-xs font-bold"
              >
                પ્રોફાઇલ જુઓ
              </Button>

              <Button
                size="md"
                variant="primary"
                onClick={() => setAssigningWorker(worker)}
                className="!min-h-[40px] text-xs font-bold"
              >
                {t('poster_workers.assign_to_job')}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Assign to Job Dialog */}
      <Dialog
        isOpen={Boolean(assigningWorker)}
        onClose={() => setAssigningWorker(null)}
        title={`${assigningWorker?.name} ને કામ ફાળવો`}
      >
        <p className="text-xs text-secondary mb-3 font-semibold">
          નીચેનામાંથી કયા પ્રોજેક્ટ માટે આ શ્રમિકને ફાળવવા માંગો છો?
        </p>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {jobs.map((job) => (
            <button
              key={job.id}
              onClick={() => handleAssignToJob(job.id)}
              className="w-full text-left p-3 rounded-2xl bg-gray-50 hover:bg-yellow-50 hover:border-accent border border-gray-200 transition-colors flex items-center justify-between"
            >
              <div>
                <h4 className="text-sm font-bold text-primary">{job.title}</h4>
                <span className="text-xs text-secondary">{job.location} • ₹{job.dailyWage}/દિવસ</span>
              </div>
              <Plus className="w-5 h-5 text-primary" />
            </button>
          ))}
        </div>
      </Dialog>

      {/* Worker Profile Summary Modal (PRIVACY SAFE) */}
      <Dialog
        isOpen={Boolean(viewingWorker)}
        onClose={() => setViewingWorker(null)}
        title="શ્રમિક વિગત (ગોપનીયતા રક્ષિત)"
      >
        {viewingWorker && (
          <div className="space-y-3 font-body">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-accent/30 font-heading text-xl font-bold flex items-center justify-center text-primary">
                {viewingWorker.name.substring(0, 2)}
              </div>
              <div>
                <h4 className="text-lg font-bold text-primary">{viewingWorker.name}</h4>
                <p className="text-xs text-secondary">{viewingWorker.city} • {viewingWorker.experience} વર્ષ અનુભવ</p>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-2xl text-xs space-y-1">
              <div><b>હાજરી ટકાવારી:</b> {viewingWorker.attendanceRate}%</div>
              <div><b>પૂરા થયેલ કામ:</b> {viewingWorker.completedJobsCount} પ્રોજેક્ટ્સ</div>
              <div><b>ઉપલબ્ધ સમય:</b> {viewingWorker.availability.join(', ')}</div>
              <div><b>ભાષાઓ:</b> {viewingWorker.languages.join(', ').toUpperCase()}</div>
            </div>

            <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 font-semibold">
              🔒 શ્રમિકના અંગત ફોન નંબર અને ફોટો Lemon સેફ્ટી પોલિસી હેઠળ સુરક્ષિત રાખવામાં આવે છે.
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                setAssigningWorker(viewingWorker);
                setViewingWorker(null);
              }}
            >
              કામ ફાળવો
            </Button>
          </div>
        )}
      </Dialog>
    </div>
  );
};
