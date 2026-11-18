export type Language = 'gu' | 'hi' | 'en';

export type UserRole = 'worker' | 'job_poster' | 'admin';

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

export type WorkUnitType = 'individual' | 'group' | 'family' | 'friends';
export type RequestedUnitType = 'individual' | 'group' | 'family' | 'friends' | 'mixed' | 'any';

export interface GroupMember {
  id: string;
  name: string;
  role: string;
  wage: number;
  hasAccepted?: boolean;
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
  
  // Group / Family / Friends details
  workUnitType: WorkUnitType;
  unitName?: string;
  members: GroupMember[];
  
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
  memberAcceptances?: Record<string, boolean>; // memberId -> boolean
  photoUrl?: string;
  phone?: string;
}

export interface JobTimelineEvent {
  timestamp: string;
  event: string;
}

export type JobPaymentStatus = 'paid' | 'pending' | 'pending_verification' | 'rejected';

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
  targetDate?: string; // Standard ISO date 'YYYY-MM-DD' for date filtering
  time: string;
  dailyWage: number;
  transportProvided: boolean;
  
  // Job Poster requirements
  requestedUnitTypes: RequestedUnitType[];
  workersRequired: number;
  
  workersAssignedCount: number;
  status: JobStatus;
  paymentStatus: JobPaymentStatus;
  paymentScreenshotUrl?: string; // Contractor uploaded screenshot of 20 rs/person advance
  platformPostingFee?: number; // 20 rs per worker
  adminApproved?: boolean; // Set by Admin upon payment verification
  cancellationReason?: string; // Populated if Admin cancels due to non-payment
  totalJobCost: number;
  platformFee: number; // 10%
  netWorkerPayout: number;
  description: string;
  instructions: string[];
  mapCoords: { lat: number; lng: number; address: string };
  assignedWorkers: JobAssignment[];
  timeline: JobTimelineEvent[];
  urgent?: boolean;
  voiceDescriptionUrl?: string;
  groupChatId?: string;
  workerRoles?: WorkerRoleSlot[];  // Per-role wage breakdown
  
  // 10-minute timer for group acceptance
  acceptanceTimerStartedAt?: string; // ISO string
}

export interface WorkerRoleSlot {
  role: string;       // e.g. 'Majdoor', 'Karigar', 'Mistri', 'Helper'
  count: number;      // how many of this role
  dailyWage: number;  // wage per day for this role
}

export interface DisputeRecord {
  id: string;
  ticketId: string;
  jobId: string;
  jobTitle: string;
  company: string;
  workerId: string;
  workerName: string;
  workerPhone: string;
  category: string;
  disputedAmount: number;
  statement: string;
  audioUrl?: string;
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  jobId: string;
  senderId: string;
  senderName: string;
  senderPhone: string;
  type: 'text' | 'voice';
  content: string; // text content or audio URL
  timestamp: string;
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
  type: 'new_job' | 'tomorrow_reminder' | 'job_cancelled' | 'job_accepted' | 'payment_received' | 'worker_applied' | 'worker_checked_in' | 'group_acceptance_pending';
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
