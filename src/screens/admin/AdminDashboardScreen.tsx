import React, { useState } from 'react';
import { 
  ShieldCheck, AlertTriangle, Users, Building2, Briefcase, 
  IndianRupee, Check, X, Eye, Phone, Mail, Search,
  Filter, CheckCircle2, XCircle, ArrowLeft, ExternalLink,
  Clock, AlertOctagon, RefreshCw
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';
import { Job, PosterProfile, WorkerProfile, DisputeRecord } from '../../types';

export const AdminDashboardScreen: React.FC = () => {
  const { t } = useTranslation();
  const { 
    jobs, 
    workers, 
    posters, 
    disputes, 
    approveJobPayment, 
    cancelJobByAdmin, 
    verifyPoster,
    setPortal,
    showToast 
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'payments' | 'contractors' | 'employees' | 'disputes'>('payments');
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'pending' | 'paid' | 'cancelled'>('all');
  
  // Screenshot modal preview
  const [previewScreenshotUrl, setPreviewScreenshotUrl] = useState<string | null>(null);
  
  // Cancellation dialog
  const [jobToCancel, setJobToCancel] = useState<Job | null>(null);
  const [cancelReason, setCancelReason] = useState('ચુકવણી ના મળવા અથવા અમાન્ય સ્ક્રીનશોટને લીધે એડમિન દ્વારા કામ રદ કરવામાં આવ્યું છે.');

  // Summary Metrics
  const totalPendingPayments = jobs.filter(j => j.paymentStatus === 'pending_verification' || (j.paymentStatus === 'pending' && !j.adminApproved)).length;
  const totalApprovedPayments = jobs.filter(j => j.paymentStatus === 'paid' && j.adminApproved !== false).length;
  const totalRevenue = jobs
    .filter(j => j.paymentStatus === 'paid')
    .reduce((sum, j) => sum + (j.platformPostingFee || (j.workersRequired * 20)), 0);

  // Filtered jobs
  const filteredJobs = jobs.filter(j => {
    const matchesSearch = j.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          j.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          j.location.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (paymentFilter === 'pending') {
      return j.paymentStatus === 'pending_verification' || (j.paymentStatus === 'pending' && !j.adminApproved);
    }
    if (paymentFilter === 'paid') {
      return j.paymentStatus === 'paid';
    }
    if (paymentFilter === 'cancelled') {
      return j.status === 'cancelled' || j.paymentStatus === 'rejected';
    }
    return true;
  });

  const handleApprove = (jobId: string, jobTitle: string) => {
    approveJobPayment(jobId);
    showToast(`કામ "${jobTitle}" નું પેમેન્ટ મંજૂર કરવામાં આવ્યું!`, 'success');
  };

  const handleConfirmCancel = () => {
    if (!jobToCancel) return;
    cancelJobByAdmin(jobToCancel.id, cancelReason);
    showToast(`કામ "${jobToCancel.title}" સફળતાપૂર્વક રદ કરવામાં આવ્યું.`, 'info');
    setJobToCancel(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-primary pb-24 font-body">
      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-40 bg-gray-900 text-white shadow-soft px-4 py-3 border-b border-gray-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent text-primary flex items-center justify-center font-black text-xl shadow-xs">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-lg font-bold tracking-tight">
                  LEMON Admin Control Center
                </h1>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-600 text-white">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-gray-400">Digital Labour Chowk Governance & Verification</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPortal('worker')}
              className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-bold text-gray-200 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Exit Admin</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto p-4 space-y-5">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between text-secondary mb-1">
              <span className="text-xs font-bold uppercase">Pending Payments</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-2xl font-bold text-amber-600">
                {totalPendingPayments}
              </span>
              <span className="text-xs text-amber-700 font-semibold">ચકાસણી બાકી</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between text-secondary mb-1">
              <span className="text-xs font-bold uppercase">Platform Revenue</span>
              <IndianRupee className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-2xl font-bold text-emerald-700">
                ₹{totalRevenue}
              </span>
              <span className="text-[11px] text-gray-500 font-medium">₹20 / worker fee</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between text-secondary mb-1">
              <span className="text-xs font-bold uppercase">Contractors</span>
              <Building2 className="w-4 h-4 text-primary" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-2xl font-bold text-primary">
                {posters.length}
              </span>
              <span className="text-xs text-gray-500 font-semibold">કંપનીઓ / શેઠ</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between text-secondary mb-1">
              <span className="text-xs font-bold uppercase">Employees</span>
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-2xl font-bold text-primary">
                {workers.length}
              </span>
              <span className="text-xs text-gray-500 font-semibold">શ્રમિકો</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('payments')}
            className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'payments'
                ? 'bg-primary text-white shadow-xs'
                : 'text-gray-600 hover:text-primary hover:bg-gray-50'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>ચુકવણી & જોબ્સ ({jobs.length})</span>
            {totalPendingPayments > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-400 text-primary text-[10px] font-black flex items-center justify-center">
                {totalPendingPayments}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('contractors')}
            className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'contractors'
                ? 'bg-primary text-white shadow-xs'
                : 'text-gray-600 hover:text-primary hover:bg-gray-50'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>કોન્ટ્રાક્ટર્સ ({posters.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('employees')}
            className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'employees'
                ? 'bg-primary text-white shadow-xs'
                : 'text-gray-600 hover:text-primary hover:bg-gray-50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>શ્રમિકો / Employees ({workers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('disputes')}
            className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'disputes'
                ? 'bg-primary text-white shadow-xs'
                : 'text-gray-600 hover:text-primary hover:bg-gray-50'
            }`}
          >
            <AlertOctagon className="w-4 h-4 text-red-500" />
            <span>ફરિયાદો / Disputes ({disputes.length})</span>
          </button>
        </div>

        {/* Tab 1: Payments & Jobs Approval */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="bg-white p-3.5 rounded-3xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="જોબનું નામ, કંપની અથવા સ્થળ શોધો..."
                  className="w-full bg-gray-50 border-none rounded-2xl pl-9 pr-4 py-2 text-sm text-primary focus:ring-2 focus:ring-accent outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <button
                  onClick={() => setPaymentFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    paymentFilter === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  All ({jobs.length})
                </button>
                <button
                  onClick={() => setPaymentFilter('pending')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    paymentFilter === 'pending' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-800'
                  }`}
                >
                  Pending ({totalPendingPayments})
                </button>
                <button
                  onClick={() => setPaymentFilter('paid')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    paymentFilter === 'paid' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800'
                  }`}
                >
                  Paid ({totalApprovedPayments})
                </button>
                <button
                  onClick={() => setPaymentFilter('cancelled')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    paymentFilter === 'cancelled' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-800'
                  }`}
                >
                  Cancelled
                </button>
              </div>
            </div>

            {/* Jobs List */}
            <div className="space-y-3">
              {filteredJobs.length === 0 ? (
                <div className="bg-white p-8 rounded-3xl border border-gray-200 text-center text-gray-500 font-semibold">
                  કોઈ જોબ મળી નથી.
                </div>
              ) : (
                filteredJobs.map((job) => {
                  const fee = job.platformPostingFee || (job.workersRequired * 20);
                  const isPending = job.paymentStatus === 'pending_verification' || (job.paymentStatus === 'pending' && !job.adminApproved);
                  const isPaid = job.paymentStatus === 'paid';
                  const isCancelled = job.status === 'cancelled' || job.paymentStatus === 'rejected';

                  return (
                    <div
                      key={job.id}
                      className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs space-y-4 hover:border-gray-300 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-xs font-black uppercase text-secondary tracking-wider">
                              {job.company}
                            </span>
                            <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                              ID: {job.id}
                            </span>
                            {isPending && (
                              <span className="text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                <Clock className="w-3 h-3" /> પેમેન્ટ ચકાસણી બાકી (Pending Approval)
                              </span>
                            )}
                            {isPaid && (
                              <span className="text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> પેમેન્ટ મંજૂર (Paid & Active)
                              </span>
                            )}
                            {isCancelled && (
                              <span className="text-xs font-bold bg-red-100 text-red-800 border border-red-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                <XCircle className="w-3 h-3" /> રદ કરેલ (Cancelled / Rejected)
                              </span>
                            )}
                          </div>

                          <h3 className="font-heading text-lg font-bold text-primary leading-tight">
                            {job.title}
                          </h3>
                          <p className="text-xs text-gray-600 mt-1">
                            📍 {job.location} • 📅 {job.date} ({job.time})
                          </p>
                        </div>

                        {/* Fee Badge */}
                        <div className="text-left sm:text-right bg-yellow-50 border border-accent/60 p-3 rounded-2xl shrink-0">
                          <p className="text-[11px] font-bold text-gray-600 uppercase">પ્લેટફોર્મ ચાર્જ (₹20/worker)</p>
                          <p className="font-heading text-2xl font-black text-primary leading-none mt-0.5">
                            ₹{fee}
                          </p>
                          <p className="text-[10px] text-gray-500 font-medium">
                            {job.workersRequired} શ્રમિકો × ₹20
                          </p>
                        </div>
                      </div>

                      {/* Payment Screenshot Preview Box */}
                      <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          {job.paymentScreenshotUrl ? (
                            <div 
                              onClick={() => setPreviewScreenshotUrl(job.paymentScreenshotUrl!)}
                              className="w-16 h-16 rounded-xl overflow-hidden border border-gray-300 cursor-pointer hover:opacity-80 transition-opacity shrink-0 bg-white"
                              title="Click to view full screenshot"
                            >
                              <img 
                                src={job.paymentScreenshotUrl} 
                                alt="Payment Proof" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-xl bg-gray-200 border border-dashed border-gray-400 flex items-center justify-center text-xs text-gray-500 font-bold shrink-0">
                              No image
                            </div>
                          )}

                          <div>
                            <p className="text-xs font-bold text-primary">
                              {job.paymentScreenshotUrl ? 'પેમેન્ટ સ્ક્રીનશોટ ઉપલબ્ધ છે' : 'સ્ક્રીનશોટ મળ્યો નથી'}
                            </p>
                            <p className="text-[11px] text-gray-500 font-medium">
                              ચુકવણીની રકમ: ₹{fee} • રસીદ ચકાસીને મંજૂર કરો
                            </p>
                            {job.cancellationReason && (
                              <p className="text-[11px] font-bold text-red-600 mt-0.5">
                                રદ કરવાનું કારણ: {job.cancellationReason}
                              </p>
                            )}
                          </div>
                        </div>

                        {job.paymentScreenshotUrl && (
                          <Button
                            variant="outline"
                            size="md"
                            onClick={() => setPreviewScreenshotUrl(job.paymentScreenshotUrl!)}
                            leftIcon={<Eye className="w-3.5 h-3.5" />}
                            className="text-xs w-full sm:w-auto"
                          >
                            સ્ક્રીનશોટ મોટો કરો (View Proof)
                          </Button>
                        )}
                      </div>

                      {/* Admin Actions Bar */}
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                        {isCancelled ? (
                          <span className="text-xs font-bold text-gray-500 italic">
                            આ કામ એડમિન દ્વારા રદ કરવામાં આવ્યું છે
                          </span>
                        ) : (
                          <>
                            {/* Cancel Job Button */}
                            <Button
                              variant="danger"
                              size="md"
                              onClick={() => setJobToCancel(job)}
                              leftIcon={<X className="w-4 h-4" />}
                              className="text-xs"
                            >
                              કામ રદ કરો (Cancel Job)
                            </Button>

                            {/* Approve Button */}
                            {isPending && (
                              <Button
                                variant="success"
                                size="md"
                                onClick={() => handleApprove(job.id, job.title)}
                                leftIcon={<Check className="w-4 h-4 stroke-[3]" />}
                                className="text-xs"
                              >
                                પેમેન્ટ મંજૂર કરો (Approve ₹{fee})
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Contractors / Posters */}
        {activeTab === 'contractors' && (
          <div className="space-y-3">
            <h3 className="font-heading text-lg font-bold text-primary">
              તમામ રજિસ્ટર્ડ કોન્ટ્રાક્ટર્સ / એમ્પ્લોયર્સ ({posters.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {posters.map((poster: PosterProfile) => (
                <div
                  key={poster.id}
                  className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <h4 className="font-heading text-base font-bold text-primary">
                          {poster.companyName}
                        </h4>
                        {poster.verified && (
                          <span className="text-xs text-blue-600" title="Verified Contractor">✓</span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-gray-600">{poster.name}</p>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-700 mt-1 inline-block">
                        {poster.posterType}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-heading text-lg font-bold text-primary block leading-none">
                        {poster.totalJobsPosted}
                      </span>
                      <span className="text-[10px] font-bold text-gray-500">કુલ જોબ્સ</span>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-xs font-medium space-y-1">
                    <p className="flex items-center gap-1.5 text-gray-700">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{poster.phone}</span>
                    </p>
                    <p className="flex items-center gap-1.5 text-gray-700">
                      <Mail className="w-3.5 h-3.5 text-blue-600" />
                      <span>{poster.email}</span>
                    </p>
                    <p className="text-[11px] text-gray-500">📍 {poster.city}</p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => verifyPoster(poster.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        poster.verified 
                          ? 'bg-blue-50 text-blue-800 border border-blue-200' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {poster.verified ? '✓ ચકાસાયેલ (Verified)' : 'Verify Contractor'}
                    </button>

                    <a
                      href={`tel:${poster.phone}`}
                      className="p-2 rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors flex items-center gap-1 text-xs font-bold"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Employees / Workers */}
        {activeTab === 'employees' && (
          <div className="space-y-3">
            <h3 className="font-heading text-lg font-bold text-primary">
              તમામ નોંધાયેલ શ્રમિકો / Employees ({workers.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {workers.map((worker: WorkerProfile) => (
                <div
                  key={worker.id}
                  className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-heading text-base font-bold text-primary">
                        {worker.name}
                      </h4>
                      <p className="text-xs font-bold text-emerald-700 mt-0.5">
                        📞 {worker.phone}
                      </p>
                      <p className="text-xs text-gray-500">📍 {worker.city}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-accent/30 text-primary uppercase">
                        {worker.workUnitType}
                      </span>
                      <p className="text-[11px] font-bold text-gray-500 mt-1">
                        ★ {worker.rating} • {worker.completedJobsCount} જોબ્સ
                      </p>
                    </div>
                  </div>

                  {/* Skills badges */}
                  <div className="flex flex-wrap gap-1">
                    {worker.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100">
                    <span className="font-bold text-gray-600">
                      હાજરી દર: <strong className="text-primary">{worker.attendanceRate}%</strong>
                    </span>

                    <a
                      href={`tel:${worker.phone}`}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors font-bold text-xs flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call Worker
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Disputes */}
        {activeTab === 'disputes' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg font-bold text-primary">
                  શ્રમિક વિવાદ અને ફરિયાદો (Reported Disputes)
                </h3>
                <p className="text-xs text-gray-500">Dispute resolution desk for lemonabuses@gmail.com</p>
              </div>
            </div>

            <div className="space-y-3">
              {disputes.map((disp: DisputeRecord) => (
                <div
                  key={disp.id}
                  className="bg-white p-5 rounded-3xl border border-red-200 shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase text-red-700 bg-red-100 px-2 py-0.5 rounded">
                          {disp.ticketId}
                        </span>
                        <span className="text-xs font-bold text-gray-500">{disp.createdAt}</span>
                      </div>
                      <h4 className="font-heading text-base font-bold text-primary mt-1">
                        {disp.category}
                      </h4>
                      <p className="text-xs text-gray-600">
                        સંબંધિત જોબ: <strong>{disp.jobTitle}</strong> ({disp.company})
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-gray-500 uppercase block">વિવાદિત રકમ</span>
                      <span className="font-heading text-xl font-bold text-red-600">
                        ₹{disp.disputedAmount}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-red-50/60 rounded-2xl border border-red-100 text-xs text-gray-800 leading-relaxed">
                    <strong>ફરિયાદી શ્રમિક:</strong> {disp.workerName} (📞 {disp.workerPhone})<br />
                    <strong>વિગત:</strong> {disp.statement}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <a
                      href={`mailto:lemonabuses@gmail.com?subject=Resolution%20for%20${disp.ticketId}&body=Investigation%20status%20for%20worker%20${disp.workerName}`}
                      className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1.5 hover:bg-primary-hover"
                    >
                      <Mail className="w-3.5 h-3.5" /> Reply to lemonabuses@gmail.com
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Screenshot Full Image Preview Modal */}
      <Dialog
        isOpen={!!previewScreenshotUrl}
        onClose={() => setPreviewScreenshotUrl(null)}
        title="ચુકવણી સ્ક્રીનશોટ (Payment Proof Screenshot)"
        confirmText="બંધ કરો (Close)"
        onConfirm={() => setPreviewScreenshotUrl(null)}
      >
        {previewScreenshotUrl && (
          <div className="space-y-3">
            <div className="max-h-[60vh] overflow-y-auto rounded-2xl border border-gray-200 bg-black flex items-center justify-center p-2">
              <img 
                src={previewScreenshotUrl} 
                alt="Payment Receipt" 
                className="max-h-[55vh] max-w-full object-contain rounded-lg"
              />
            </div>
            <p className="text-xs text-gray-500 text-center font-medium">
              ખાતરી કરો કે UPI ટ્રાન્ઝેક્શન આઈડી, તારીખ અને રકમ બરાબર છે.
            </p>
          </div>
        )}
      </Dialog>

      {/* Cancel Job Dialog */}
      <Dialog
        isOpen={!!jobToCancel}
        onClose={() => setJobToCancel(null)}
        title="કામ રદ કરવું છે? (Cancel Job Due to Non-Payment)"
        confirmText="હા, કામ રદ કરો (Cancel Job)"
        confirmVariant="danger"
        cancelText="પાછા જાઓ"
        onConfirm={handleConfirmCancel}
      >
        {jobToCancel && (
          <div className="space-y-3">
            <p className="text-sm text-gray-700">
              શું તમે ખરેખર <strong>"{jobToCancel.title}"</strong> ({jobToCancel.company}) નું કામ રદ કરવા માંગો છો?
            </p>
            <div className="p-3 bg-red-50 rounded-2xl border border-red-200 text-xs text-red-900 font-semibold">
              ⚠️ કામ રદ કરવાથી તે શ્રમિકોની યાદીમાંથી હટી જશે અને કોન્ટ્રાક્ટરને જાણ કરવામાં આવશે.
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                રદ કરવાનું કારણ (Reason for Cancellation):
              </label>
              <textarea
                rows={2}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-primary outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};
