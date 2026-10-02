import React, { useState } from 'react';
import { useAppStore } from './store/useAppStore';
import { Job } from './types';

// UI Components
import { Header } from './components/ui/Header';
import { BottomNavigation } from './components/ui/BottomNavigation';
import { Toast } from './components/ui/Toast';
import { JobDetailsModal } from './components/jobs/JobDetailsModal';
import { WorkerCheckInModal } from './components/worker/WorkerCheckInModal';

// Worker Screens
import { AuthScreen } from './screens/AuthScreen';
import { LanguageSelectScreen } from './screens/LanguageSelectScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { WorkerMapHome } from './screens/WorkerMapHome';
import { JobsScreen } from './screens/JobsScreen';
import { MyWorkScreen } from './screens/MyWorkScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SettingsScreen } from './screens/SettingsScreen';

// Job Poster Components & Screens
import { PosterLayout } from './components/poster/PosterLayout';
import { PosterMapHome } from './screens/poster/PosterMapHome';
import { PosterCreateJobScreen } from './screens/poster/PosterCreateJobScreen';
import { PosterJobsScreen } from './screens/poster/PosterJobsScreen';
import { PosterJobDetailScreen } from './screens/poster/PosterJobDetailScreen';
import { PosterWorkersScreen } from './screens/poster/PosterWorkersScreen';
import { PosterAnalyticsScreen } from './screens/poster/PosterAnalyticsScreen';
import { PosterProfileScreen } from './screens/poster/PosterProfileScreen';
import { PosterRoleSelectModal } from './screens/poster/PosterRoleSelectModal';

export const App: React.FC = () => {
  const { 
    currentPortal,
    isAuthenticated, 
    hasSelectedLanguage, 
    isOnboarded, 
    activeTab, 
    posterTab,
    selectedJobForDetails, 
    closeJobDetails,
    checkInModalJob,
    setCheckInModalJob,
    hasSelectedPosterRole
  } = useAppStore();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedPosterJob, setSelectedPosterJob] = useState<Job | null>(null);
  const [posterRoleModalOpen, setPosterRoleModalOpen] = useState(false);

  // 1. Authentication Flow
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-primary">
        <AuthScreen />
        <Toast />
      </div>
    );
  }

  // 2. Language Selection Flow (PRD: The very first screen after login should ask: Choose your language)
  if (!hasSelectedLanguage) {
    return (
      <div className="min-h-screen bg-background text-primary">
        <LanguageSelectScreen />
        <Toast />
      </div>
    );
  }

  // 3. Worker Onboarding Flow (if in worker portal and not yet onboarded)
  if (!isOnboarded && currentPortal === 'worker') {
    return (
      <div className="min-h-screen bg-background text-primary">
        <OnboardingScreen />
        <Toast />
      </div>
    );
  }

  // 4. JOB POSTER APPLICATION PORTAL
  if (currentPortal === 'job_poster') {
    return (
      <PosterLayout forceOverlay={!!selectedPosterJob}>
        {selectedPosterJob ? (
          <PosterJobDetailScreen
            job={selectedPosterJob}
            onBack={() => setSelectedPosterJob(null)}
          />
        ) : (
          <>
            {(posterTab === 'overview' || posterTab === 'map') && <PosterMapHome />}
            {posterTab === 'create_job' && <PosterCreateJobScreen />}
            {posterTab === 'jobs' && (
              <PosterJobsScreen onViewJobDetail={(job) => setSelectedPosterJob(job)} />
            )}
            {posterTab === 'workers' && <PosterWorkersScreen />}
            {posterTab === 'analytics' && <PosterAnalyticsScreen />}
            {posterTab === 'profile' && (
              <PosterProfileScreen onOpenRoleModal={() => setPosterRoleModalOpen(true)} />
            )}
          </>
        )}

        {/* Poster Role Selection Modal */}
        <PosterRoleSelectModal
          isOpen={posterRoleModalOpen || !hasSelectedPosterRole}
          onClose={() => setPosterRoleModalOpen(false)}
        />

        {/* Global Toast */}
        <Toast />
      </PosterLayout>
    );
  }

  const isMapLanding = !isSettingsOpen && (activeTab === 'home' || activeTab === 'map');

  // 5. WORKER APPLICATION PORTAL
  if (isMapLanding) {
    return (
      <div className="h-[100dvh] bg-background text-primary overflow-hidden font-body">
        <WorkerMapHome />
        <BottomNavigation />
        <JobDetailsModal
          job={selectedJobForDetails}
          onClose={closeJobDetails}
        />
        <WorkerCheckInModal
          job={checkInModalJob}
          onClose={() => setCheckInModalJob(null)}
        />
        <Toast />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-primary flex flex-col font-body">
      {/* App Header */}
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Main Content Area (Responsive container 360px-430px mobile-first) */}
      <main className="flex-1 w-full max-w-lg mx-auto px-4 pt-4">
        {isSettingsOpen ? (
          <SettingsScreen onBack={() => setIsSettingsOpen(false)} />
        ) : (
          <>
            {activeTab === 'jobs' && <JobsScreen />}
            {activeTab === 'my_work' && <MyWorkScreen />}
            {activeTab === 'profile' && (
              <ProfileScreen onOpenSettings={() => setIsSettingsOpen(true)} />
            )}
          </>
        )}
      </main>

      {/* Bottom Navigation for Worker */}
      {!isSettingsOpen && <BottomNavigation />}

      {/* Global Job Details Modal for Worker */}
      <JobDetailsModal
        job={selectedJobForDetails}
        onClose={closeJobDetails}
      />

      {/* Worker Attendance Selfie + GPS Check-in Modal */}
      <WorkerCheckInModal
        job={checkInModalJob}
        onClose={() => setCheckInModalJob(null)}
      />

      {/* Global Toast */}
      <Toast />
    </div>
  );
};

export default App;
