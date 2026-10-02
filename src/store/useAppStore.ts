import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Language, WorkerProfile, Job, NotificationItem, NavigationTab, 
  UserRole, PosterType, PosterProfile, PosterTab, JobAssignment 
} from '../types';
import { INITIAL_JOBS, INITIAL_NOTIFICATIONS } from '../data/sampleJobs';
import { SAMPLE_WORKERS } from '../data/sampleWorkers';
import i18n from '../i18n';

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppState {
  // Current active portal
  currentPortal: UserRole;
  setPortal: (portal: UserRole) => void;

  // Auth & General
  isAuthenticated: boolean;
  phone: string;
  hasSelectedLanguage: boolean;
  isOnboarded: boolean;
  isAvailableToday: boolean;
  language: Language;

  // Worker Profile
  profile: WorkerProfile;

  // Job Poster Profile & Flow
  hasSelectedPosterRole: boolean;
  posterProfile: PosterProfile;
  posterTab: PosterTab;
  setPosterTab: (tab: PosterTab) => void;
  setPosterType: (type: PosterType) => void;
  updatePosterProfile: (updates: Partial<PosterProfile>) => void;

  // Jobs, Workers & Feed
  jobs: Job[];
  workers: WorkerProfile[];
  selectedJobForDetails: Job | null;
  notifications: NotificationItem[];

  // Navigation & UI
  activeTab: NavigationTab;
  toast: ToastState | null;
  speechEnabled: boolean;

  // Worker Check-In Modal State
  checkInModalJob: Job | null;
  setCheckInModalJob: (job: Job | null) => void;

  // Actions
  login: (phone: string) => void;
  verifyOtp: (code: string) => boolean;
  setLanguage: (lang: Language) => void;
  completeLanguageSelection: () => void;
  updateProfile: (profile: Partial<WorkerProfile>) => void;
  completeOnboarding: (profile: WorkerProfile) => void;
  toggleAvailability: () => void;
  setAvailability: (available: boolean) => void;

  // Worker Job Actions
  applyForJob: (jobId: string) => void;
  acceptJob: (jobId: string) => void;
  declineJob: (jobId: string) => void;
  completeJob: (jobId: string) => void;
  checkInJob: (jobId: string, selfieUrl: string, coords: { lat: number; lng: number }) => void;
  openJobDetails: (job: Job) => void;
  closeJobDetails: () => void;

  // Job Poster Job Management Actions
  createJob: (job: Partial<Job>) => string;
  updateJob: (jobId: string, updates: Partial<Job>) => void;
  duplicateJob: (jobId: string) => void;
  cancelJob: (jobId: string) => void;
  deleteJob: (jobId: string) => void;
  assignWorkerToJob: (jobId: string, workerId: string) => void;
  toggleShortlistWorker: (workerId: string) => void;

  // Utility Actions
  setActiveTab: (tab: NavigationTab) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  toggleSpeechEnabled: () => void;
  logout: () => void;
}

const DEFAULT_PROFILE: WorkerProfile = {
  id: 'worker-001',
  name: 'રમેશભાઈ પરમાર (Ramesh Parmar)',
  phone: '98250 11223',
  photoUrl: '',
  city: 'અમદાવાદ (Ahmedabad)',
  locationCoords: { lat: 23.0225, lng: 72.5714 },
  skills: ['raj_mistri', 'tile_karigar'],
  experience: '3-5',
  availability: ['morning', 'afternoon', 'weekdays'],
  dailyWage: 1200,
  groupDetails: {
    isGroup: false,
    teamName: '',
    leaderName: 'રમેશભાઈ પરમાર',
    memberCount: 1,
    memberSkills: ['raj_mistri'],
    wagePerMember: 1200,
    totalDailyWage: 1200
  },
  attendanceRate: 98,
  completedJobsCount: 46,
  joinedDate: 'જાન્યુઆરી ૨૦૨૪',
  rating: 4.9,
  languages: ['gu', 'hi']
};

const DEFAULT_POSTER: PosterProfile = {
  id: 'poster-01',
  name: 'વિજયભાઈ પટેલ (Vijay Patel)',
  companyName: 'શિવાલય ઇન્ફ્રાસ્ટ્રક્ચર (Shivalay Infra)',
  posterType: 'business',
  city: 'અમદાવાદ (Ahmedabad)',
  email: 'vijay@shivalayinfra.com',
  phone: '98250 12345',
  locationCoords: { lat: 23.0135, lng: 72.5085 },
  verified: true,
  totalJobsPosted: 14,
  activeJobsCount: 2,
  totalSpent: 48500
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentPortal: 'worker',
      setPortal: (portal) => set({ currentPortal: portal }),

      isAuthenticated: false,
      phone: '',
      hasSelectedLanguage: false,
      isOnboarded: false,
      isAvailableToday: true,
      language: 'gu',
      profile: DEFAULT_PROFILE,

      hasSelectedPosterRole: true,
      posterProfile: DEFAULT_POSTER,
      posterTab: 'overview',
      setPosterTab: (tab) => set({ posterTab: tab }),

      setPosterType: (type) => {
        set((state) => ({
          hasSelectedPosterRole: true,
          posterProfile: {
            ...state.posterProfile,
            posterType: type,
            companyName: type === 'staffing_agency' 
              ? 'ગુજરાત લેબર સપ્લાય એજન્સી' 
              : type === 'individual' 
              ? 'વ્યક્તિગત ક્લાયન્ટ' 
              : 'શિવાલય ઇન્ફ્રાસ્ટ્રક્ચર'
          }
        }));
      },

      updatePosterProfile: (updates) => {
        set((state) => ({
          posterProfile: { ...state.posterProfile, ...updates }
        }));
      },

      jobs: INITIAL_JOBS,
      workers: SAMPLE_WORKERS,
      selectedJobForDetails: null,
      notifications: INITIAL_NOTIFICATIONS,
      activeTab: 'home',
      toast: null,
      speechEnabled: true,
      checkInModalJob: null,
      setCheckInModalJob: (job) => set({ checkInModalJob: job }),

      login: (phone: string) => {
        set({ phone });
      },

      verifyOtp: (code: string) => {
        if (code.length >= 4) {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },

      setLanguage: (lang: Language) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('lemon_language', lang);
        set({ language: lang });
      },

      completeLanguageSelection: () => {
        set({ hasSelectedLanguage: true });
      },

      updateProfile: (updates) => {
        set((state) => ({
          profile: { ...state.profile, ...updates }
        }));
      },

      completeOnboarding: (newProfile) => {
        set({
          profile: newProfile,
          isOnboarded: true,
          activeTab: 'home'
        });
      },

      toggleAvailability: () => {
        set((state) => ({ isAvailableToday: !state.isAvailableToday }));
      },

      setAvailability: (available: boolean) => {
        set({ isAvailableToday: available });
      },

      // Worker applies to a nearby job
      applyForJob: (jobId: string) => {
        set((state) => {
          const currentWorker = state.profile;
          const updatedJobs = state.jobs.map((job) => {
            if (job.id === jobId) {
              const alreadyApplied = job.assignedWorkers.some(w => w.workerId === currentWorker.id);
              if (alreadyApplied) return job;
              const newAssignment: JobAssignment = {
                workerId: currentWorker.id,
                workerName: currentWorker.name,
                skills: currentWorker.skills,
                status: 'applied',
                appliedAt: 'હમણાં જ (Just now)'
              };
              return {
                ...job,
                assignedWorkers: [...job.assignedWorkers, newAssignment],
                timeline: [
                  ...job.timeline,
                  { timestamp: 'હમણાં જ', event: `${currentWorker.name} દ્વારા અરજી કરવામાં આવી` }
                ]
              };
            }
            return job;
          });

          const appliedJob = state.jobs.find(j => j.id === jobId);
          const newNotif: NotificationItem = {
            id: `notif-${Date.now()}`,
            type: 'worker_applied',
            titleKey: 'notifications.worker_applied_title',
            messageKey: 'notifications.worker_applied_msg',
            timeAgoKey: 'હમણાં જ',
            date: 'આજે',
            read: false,
            jobId
          };

          return {
            jobs: updatedJobs,
            notifications: [newNotif, ...state.notifications],
            selectedJobForDetails: appliedJob ? { ...appliedJob, status: 'assigned' } : null
          };
        });
      },

      acceptJob: (jobId: string) => {
        set((state) => {
          const updatedJobs = state.jobs.map((job) => {
            if (job.id === jobId) {
              const updatedAssignments = job.assignedWorkers.map(w => 
                w.workerId === state.profile.id ? { ...w, status: 'accepted' as const } : w
              );
              if (!job.assignedWorkers.some(w => w.workerId === state.profile.id)) {
                updatedAssignments.push({
                  workerId: state.profile.id,
                  workerName: state.profile.name,
                  skills: state.profile.skills,
                  status: 'accepted'
                });
              }
              return {
                ...job,
                status: 'accepted' as const,
                workersAssignedCount: Math.min(job.workersRequired, job.workersAssignedCount + 1),
                assignedWorkers: updatedAssignments,
                timeline: [
                  ...job.timeline,
                  { timestamp: 'હમણાં જ', event: `${state.profile.name} એ કામ સ્વીકાર્યું` }
                ]
              };
            }
            return job;
          });

          const acceptedJob = updatedJobs.find(j => j.id === jobId);
          return {
            jobs: updatedJobs,
            selectedJobForDetails: acceptedJob || null
          };
        });
      },

      declineJob: (jobId: string) => {
        set((state) => {
          const updatedJobs = state.jobs.map((job) =>
            job.id === jobId ? { ...job, status: 'declined' as const } : job
          );
          return {
            jobs: updatedJobs,
            selectedJobForDetails: null
          };
        });
      },

      completeJob: (jobId: string) => {
        set((state) => {
          const updatedJobs = state.jobs.map((job) =>
            job.id === jobId ? { ...job, status: 'completed' as const } : job
          );
          return {
            jobs: updatedJobs,
            profile: {
              ...state.profile,
              completedJobsCount: state.profile.completedJobsCount + 1
            }
          };
        });
      },

      // Worker Selfie + GPS check-in
      checkInJob: (jobId, selfieUrl, coords) => {
        set((state) => {
          const updatedJobs = state.jobs.map((job) => {
            if (job.id === jobId) {
              const updatedAssignments = job.assignedWorkers.map((w) => {
                if (w.workerId === state.profile.id) {
                  return {
                    ...w,
                    status: 'checked_in' as const,
                    checkedInAt: 'આજે સવારે ૦૮:૩૦',
                    selfieUrl,
                    coords
                  };
                }
                return w;
              });

              return {
                ...job,
                assignedWorkers: updatedAssignments,
                timeline: [
                  ...job.timeline,
                  { timestamp: 'આજે સવારે ૦૮:૩૦', event: `${state.profile.name} એ સાઇટ પર સેલ્ફી + GPS ચેક-ઇન પૂર્ણ કર્યું` }
                ]
              };
            }
            return job;
          });

          return {
            jobs: updatedJobs,
            checkInModalJob: null
          };
        });
      },

      openJobDetails: (job: Job) => {
        set({ selectedJobForDetails: job });
      },

      closeJobDetails: () => {
        set({ selectedJobForDetails: null });
      },

      // Job Poster creates job (Step 1-4)
      createJob: (newJobData) => {
        const id = `job-${Date.now()}`;
        const wage = newJobData.dailyWage || 1000;
        const count = newJobData.workersRequired || 1;
        const netWorkerPayout = wage * count;
        const platformFee = Math.round(netWorkerPayout * 0.10); // 10% platform fee
        const totalJobCost = netWorkerPayout + platformFee;

        const newJob: Job = {
          id,
          title: newJobData.title || 'નવું કન્સ્ટ્રક્શન કામ',
          company: get().posterProfile.companyName || 'શિવાલય ઇન્ફ્રાસ્ટ્રક્ચર',
          posterId: get().posterProfile.id,
          posterType: get().posterProfile.posterType,
          category: newJobData.category || 'construction',
          location: newJobData.location || 'એસ.જી. હાઇવે, અમદાવાદ',
          distanceKm: 2.5,
          date: newJobData.date || 'આજે (Today)',
          time: newJobData.time || '૦૮:૩૦ સવારે - ૦૫:૩૦ સાંજે',
          dailyWage: wage,
          workersRequired: count,
          workersAssignedCount: 0,
          status: 'upcoming',
          paymentStatus: newJobData.paymentStatus || 'pending',
          totalJobCost,
          platformFee,
          netWorkerPayout,
          description: newJobData.description || 'સાઇટ પર જરૂરિયાત મુજબ કામ.',
          instructions: newJobData.instructions || ['સવારે ૮:૩૦ વાગ્યે પહોંચવું.', 'સેફ્ટી સાધનો સાથે લાવવા.'],
          mapCoords: newJobData.mapCoords || {
            lat: 23.0225,
            lng: 72.5714,
            address: newJobData.location || 'Ahmedabad, Gujarat'
          },
          assignedWorkers: [],
          timeline: [
            { timestamp: 'હમણાં જ', event: 'જોબ સફળતાપૂર્વક પોસ્ટ કરવામાં આવી' }
          ]
        };

        set((state) => ({
          jobs: [newJob, ...state.jobs],
          posterProfile: {
            ...state.posterProfile,
            totalJobsPosted: state.posterProfile.totalJobsPosted + 1,
            activeJobsCount: state.posterProfile.activeJobsCount + 1
          }
        }));

        return id;
      },

      updateJob: (jobId, updates) => {
        set((state) => ({
          jobs: state.jobs.map((j) => (j.id === jobId ? { ...j, ...updates } : j))
        }));
      },

      duplicateJob: (jobId) => {
        const target = get().jobs.find((j) => j.id === jobId);
        if (!target) return;
        const clone: Job = {
          ...target,
          id: `job-${Date.now()}`,
          title: `${target.title} (નકલ)`,
          status: 'upcoming',
          workersAssignedCount: 0,
          assignedWorkers: [],
          timeline: [
            { timestamp: 'હમણાં જ', event: 'જોબ ડુપ્લિકેટ કરવામાં આવી' }
          ]
        };
        set((state) => ({
          jobs: [clone, ...state.jobs]
        }));
      },

      cancelJob: (jobId) => {
        set((state) => ({
          jobs: state.jobs.map((j) =>
            j.id === jobId ? { ...j, status: 'cancelled' as const } : j
          )
        }));
      },

      deleteJob: (jobId) => {
        set((state) => ({
          jobs: state.jobs.filter((j) => j.id !== jobId)
        }));
      },

      assignWorkerToJob: (jobId, workerId) => {
        set((state) => {
          const worker = state.workers.find((w) => w.id === workerId) || state.profile;
          const updatedJobs = state.jobs.map((job) => {
            if (job.id === jobId) {
              const existing = job.assignedWorkers.some((w) => w.workerId === workerId);
              if (existing) return job;
              const newAssignment: JobAssignment = {
                workerId: worker.id,
                workerName: worker.name,
                skills: worker.skills,
                status: 'invited'
              };
              return {
                ...job,
                workersAssignedCount: job.workersAssignedCount + 1,
                assignedWorkers: [...job.assignedWorkers, newAssignment],
                timeline: [
                  ...job.timeline,
                  { timestamp: 'હમણાં જ', event: `${worker.name} ને કામ ફાળવવામાં આવ્યું` }
                ]
              };
            }
            return job;
          });
          return { jobs: updatedJobs };
        });
      },

      toggleShortlistWorker: (workerId) => {
        set((state) => ({
          workers: state.workers.map((w) =>
            w.id === workerId ? { ...w, isShortlisted: !w.isShortlisted } : w
          )
        }));
      },

      setActiveTab: (tab: NavigationTab) => {
        set({ activeTab: tab });
      },

      showToast: (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        set({ toast: { message, type } });
      },

      hideToast: () => {
        set({ toast: null });
      },

      markNotificationRead: (id: string) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          )
        }));
      },

      markAllNotificationsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true }))
        }));
      },

      toggleSpeechEnabled: () => {
        set((state) => ({ speechEnabled: !state.speechEnabled }));
      },

      logout: () => {
        set({
          isAuthenticated: false,
          hasSelectedLanguage: false,
          isOnboarded: false,
          phone: '',
          selectedJobForDetails: null,
          activeTab: 'home',
          posterTab: 'overview',
          currentPortal: 'worker'
        });
      }
    }),
    {
      name: 'lemon_unified_store',
      partialize: (state) => ({
        currentPortal: state.currentPortal,
        isAuthenticated: state.isAuthenticated,
        phone: state.phone,
        hasSelectedLanguage: state.hasSelectedLanguage,
        isOnboarded: state.isOnboarded,
        isAvailableToday: state.isAvailableToday,
        language: state.language,
        profile: state.profile,
        hasSelectedPosterRole: state.hasSelectedPosterRole,
        posterProfile: state.posterProfile,
        jobs: state.jobs,
        workers: state.workers,
        notifications: state.notifications,
        speechEnabled: state.speechEnabled
      })
    }
  )
);
