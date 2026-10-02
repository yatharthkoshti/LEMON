import React from 'react';
import { 
  ArrowLeft, MapPin, Calendar, Clock, Users, IndianRupee, 
  CheckCircle2, Clock3, AlertCircle, ShieldCheck, FileText 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Job } from '../../types';
import { Button } from '../../components/ui/Button';
import { OpenStreetMap } from '../../components/map/OpenStreetMap';

interface PosterJobDetailScreenProps {
  job: Job;
  onBack: () => void;
}

export const PosterJobDetailScreen: React.FC<PosterJobDetailScreenProps> = ({
  job,
  onBack
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-5 pb-20">
      {/* Top back button & title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all text-primary"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <span className="text-xs font-bold text-secondary uppercase">
            જોબ વિગત • ID: {job.id}
          </span>
          <h2 className="text-2xl font-extrabold text-primary font-heading tracking-tight">
            {job.title}
          </h2>
        </div>
      </div>

      {/* Hero Card */}
      <div className="bg-card rounded-4xl p-6 border border-gray-100 shadow-soft space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-xs font-black uppercase text-secondary">
              {job.company}
            </span>
            <p className="text-sm font-semibold text-gray-700 mt-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-lemonRed shrink-0" />
              <span>{job.location}</span>
            </p>
          </div>

          <div className="text-right shrink-0 bg-yellow-50 p-3 rounded-2xl border border-accent/60">
            <span className="font-heading text-3xl text-primary leading-none block">
              ₹{job.dailyWage}
            </span>
            <span className="text-[11px] font-bold text-secondary">
              / શ્રમિક દીઠ
            </span>
          </div>
        </div>

        {/* Date, Time, Payment Status */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-bold text-gray-800 bg-gray-50 p-3 rounded-2xl">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{job.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span>{job.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-secondary">ચુકવણી:</span>
            {job.paymentStatus === 'paid' ? (
              <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                ચુકવાયેલ (Paid)
              </span>
            ) : (
              <span className="text-lemonRed bg-red-100 px-2 py-0.5 rounded-md">
                બાકી (Pending)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* OpenStreetMap Preview */}
      <div className="bg-card rounded-3xl p-4 border border-gray-100 shadow-soft space-y-2">
        <h4 className="text-xs font-bold text-secondary uppercase">
          સાઇટ મેપ લોકેશન
        </h4>
        <OpenStreetMap
          center={[job.mapCoords.lat, job.mapCoords.lng]}
          zoom={14}
          jobs={[job]}
          height="180px"
        />
      </div>

      {/* Description & Instructions */}
      <div className="bg-card rounded-3xl p-5 border border-gray-100 shadow-soft space-y-4">
        <div>
          <h4 className="text-sm font-bold text-primary font-heading mb-1.5 flex items-center gap-1.5">
            <FileText className="w-4 h-4" />
            <span>કામનું વર્ણન</span>
          </h4>
          <p className="text-sm text-gray-700 leading-relaxed font-medium">
            {job.description}
          </p>
        </div>

        <div className="pt-3 border-t border-gray-100">
          <h4 className="text-sm font-bold text-primary font-heading mb-1.5">
            સાઇટ સૂચનાઓ
          </h4>
          <ul className="space-y-1.5">
            {job.instructions.map((inst, idx) => (
              <li key={idx} className="text-xs sm:text-sm text-gray-700 font-medium flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-accent/40 text-primary font-bold flex items-center justify-center text-[10px]">
                  {idx + 1}
                </span>
                <span>{inst}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Workers Assigned & Attendance Section */}
      <div className="bg-card rounded-3xl p-5 border border-gray-100 shadow-soft space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <h4 className="text-base font-bold text-primary font-heading">
              ફાળવેલ શ્રમિકો ({job.assignedWorkers.length} / {job.workersRequired})
            </h4>
          </div>
          <span className="text-xs font-bold text-secondary">
            {job.workersRequired - job.assignedWorkers.length} શ્રમિકો બાકી
          </span>
        </div>

        {job.assignedWorkers.length > 0 ? (
          <div className="space-y-2.5">
            {job.assignedWorkers.map((w, idx) => (
              <div
                key={idx}
                className="p-3 bg-gray-50 rounded-2xl flex items-center justify-between border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  {/* Initials badge - PRIVACY SAFE: NO photo */}
                  <div className="w-9 h-9 rounded-xl bg-accent/30 font-heading text-primary font-bold flex items-center justify-center text-sm">
                    {w.workerName.substring(0, 2)}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-primary">
                      {w.workerName}
                    </h5>
                    <span className="text-[11px] text-secondary capitalize">
                      {w.skills.join(', ')}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  {w.status === 'checked_in' ? (
                    <span className="inline-flex items-center gap-1 text-xs font-extrabold text-purple-900 bg-purple-100 px-2.5 py-1 rounded-full border border-purple-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> સેલ્ફી હાજર
                    </span>
                  ) : w.status === 'accepted' ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      સ્વીકારેલ છે
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                      અરજી થયેલ
                    </span>
                  )}
                  {w.checkedInAt && (
                    <span className="text-[10px] text-gray-500 block mt-0.5">
                      {w.checkedInAt}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 py-3 text-center">
            હજુ કોઈ શ્રમિક જોડાયો નથી. શ્રમિક ટેબમાંથી સીધા ફાળવી શકો છો.
          </p>
        )}
      </div>

      {/* Activity Timeline */}
      <div className="bg-card rounded-3xl p-5 border border-gray-100 shadow-soft">
        <h4 className="text-sm font-bold text-primary font-heading mb-3">
          પ્રવૃત્તિ ટાઇમલાઇન (Timeline)
        </h4>
        <div className="space-y-2">
          {job.timeline.map((event, idx) => (
            <div key={idx} className="flex items-start gap-3 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
              <div className="flex-1">
                <span className="font-bold text-primary">{event.event}</span>
                <span className="text-secondary ml-2 font-normal">({event.timestamp})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
