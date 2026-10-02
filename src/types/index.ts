export type Language = 'gu' | 'hi' | 'en';

export type UserRole = 'worker' | 'job_poster';

export type PosterType = 'staffing_agency' | 'business' | 'individual';

export type ExperienceLevel = '0-1' | '1-3' | '3-5' | '5+';

export type AvailabilitySlot = 
  | 'morning' 
  | 'afternoon' 
  | 'evening' 
  | 'night' 
  | 'weekdays' 
  | 'weekends' 
  | 'anytime';

export type SkillCategory = 
  | 'general_labour'
  | 'construction'
  | 'household'
  | 'loading'
  | 'other';

export interface SkillItem {
  id: string;
  category: SkillCategory;
  icon: string;
  titleKey: string;
  descKey: string;
}

export interface GroupDetails {
  isGroup: boolean;
  teamName: string;
  leaderName: string;
  memberCount: number;
  memberSkills: string[];
  wagePerMember: number;
  totalDailyWage: number;
}

export interface WorkerProfile {
  id: string;
  name: string;
  phone: string; // Worker phone is stored in worker profile, but NEVER exposed to job posters
  photoUrl: string; // Worker photo is stored, but NEVER exposed to job posters (only initials/avatar badge)
  city: string;
  locationCoords: { lat: number; lng: number };
  skills: string[];
  experience: ExperienceLevel;
  availability: AvailabilitySlot[];
  dailyWage: number;
  groupDetails: GroupDetails;
  attendanceRate: number; // e.g., 98
  completedJobsCount: number; // e.g., 42
  joinedDate: string;
  rating: number; // e.g. 4.9
  languages: Language[];
  isShortlisted?: boolean;
}

export type JobStatus = 'upcoming' | 'assigned' | 'accepted' | 'declined' | 'completed' | 'cancelled';

export interface JobAssignment {
  workerId: string;
  workerName: string;
  skills: string[];
  status: 'invited' | 'applied' | 'accepted' | 'declined' | 'checked_in';
  appliedAt?: string;
  checkedInAt?: string;
  selfieUrl?: string;
  coords?: { lat: number; lng: number };
}

export interface JobTimelineEvent {
  timestamp: string;
  event: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  posterId: string;
  posterType: PosterType;
  category: SkillCategory;
  location: string;
  distanceKm: number;
  date: string;
  time: string;
  dailyWage: number;
  workersRequired: number;
  workersAssignedCount: number;
  status: JobStatus;
  paymentStatus: 'paid' | 'pending';
  totalJobCost: number;
  platformFee: number; // 10%
  netWorkerPayout: number;
  description: string;
  instructions: string[];
  mapCoords: { lat: number; lng: number; address: string };
  assignedWorkers: JobAssignment[];
  timeline: JobTimelineEvent[];
  urgent?: boolean;
}

export interface PosterProfile {
  id: string;
  name: string;
  companyName: string;
  posterType: PosterType;
  city: string;
  email: string;
  phone: string;
  locationCoords: { lat: number; lng: number };
  verified: boolean;
  totalJobsPosted: number;
  activeJobsCount: number;
  totalSpent: number;
}

export interface NotificationItem {
  id: string;
  type: 'new_job' | 'tomorrow_reminder' | 'job_cancelled' | 'job_accepted' | 'payment_received' | 'worker_applied' | 'worker_checked_in';
  titleKey: string;
  messageKey: string;
  timeAgoKey: string;
  date: string;
  read: boolean;
  jobId?: string;
  workerId?: string;
}

export type NavigationTab = 'home' | 'jobs' | 'map' | 'my_work' | 'notifications' | 'profile';

export type PosterTab = 'overview' | 'create_job' | 'jobs' | 'workers' | 'map' | 'analytics' | 'profile';
