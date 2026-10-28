import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HardHat, Briefcase, Lock, ArrowRight, Eye, EyeOff, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import { Dialog } from '../components/ui/Dialog';
import { Button } from '../components/ui/Button';

const ADMIN_USERNAME = 'yatharthkoshti';
const ADMIN_PASSWORD = 'NG7E2SHL';

export const RoleSelectionScreen: React.FC = () => {
  const { t } = useTranslation();
  const { setPortal, completeRoleSelection, showToast } = useAppStore();

  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  const handleSelectRole = (role: 'worker' | 'job_poster' | 'admin') => {
    setPortal(role);
    completeRoleSelection();
  };

  const handleAdminLogin = () => {
    if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setAdminModalOpen(false);
      showToast('✓ Admin access granted!', 'success');
      handleSelectRole('admin');
    } else {
      setError(true);
      showToast('ખોટું username અથવા password', 'error');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-gray-50/50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <div className="w-16 h-16 bg-white rounded-3xl shadow-soft flex items-center justify-center mx-auto mb-3 border border-gray-100">
          <span className="text-3xl">🍋</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-1">
          {t('role_selection.title')}
        </h1>
        <p className="text-xs sm:text-sm text-secondary font-medium">
          તમારો ખાતા પ્રકાર પસંદ કરો — Choose your account type
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl mb-4">
        {/* Worker Card - Green */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSelectRole('worker')}
          className="flex-1 flex flex-col items-center justify-center p-8 bg-emerald-50 border-2 border-emerald-500 rounded-3xl shadow-soft transition-colors hover:bg-emerald-100 group text-center"
        >
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:shadow-md transition-shadow">
            <HardHat className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-emerald-700 mb-2 font-heading">
            {t('role_selection.worker_title')}
          </h2>
          <p className="text-emerald-600/80 font-medium text-sm">
            {t('role_selection.worker_desc')}
          </p>
          <span className="mt-4 px-3 py-1 rounded-full bg-emerald-200 text-emerald-800 text-xs font-bold uppercase">
            મજૂર / મિસ્ત્રી (Labourer / Mistri)
          </span>
        </motion.button>

        {/* Job Poster Card - Red */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSelectRole('job_poster')}
          className="flex-1 flex flex-col items-center justify-center p-8 bg-red-50 border-2 border-red-500 rounded-3xl shadow-soft transition-colors hover:bg-red-100 group text-center"
        >
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:shadow-md transition-shadow">
            <Briefcase className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-red-700 mb-2 font-heading">
            {t('role_selection.poster_title')}
          </h2>
          <p className="text-red-600/80 font-medium text-sm">
            {t('role_selection.poster_desc')}
          </p>
          <span className="mt-4 px-3 py-1 rounded-full bg-red-200 text-red-800 text-xs font-bold uppercase">
            ઠેકેદાર / શેઠ (Employer)
          </span>
        </motion.button>
      </div>

      {/* Admin Portal Button */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => {
          setUsername('');
          setPassword('');
          setError(false);
          setAdminModalOpen(true);
        }}
        className="w-full max-w-2xl p-4 bg-white hover:bg-gray-100 border border-gray-200 rounded-2xl shadow-2xs flex items-center justify-between transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-900 text-yellow-400 flex items-center justify-center font-bold text-lg">
            🔒
          </div>
          <div className="text-left">
            <p className="font-heading text-sm font-bold text-primary">
              Admin Control Center (એડમિન પોર્ટલ)
            </p>
            <p className="text-[11px] text-gray-500 font-medium">
              ચુકવણી, ઠેકેદારો, કારીગરો, ફરિયાદ
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-primary bg-gray-100 px-3 py-1.5 rounded-xl">
          <Lock className="w-3.5 h-3.5 text-gray-500" />
          <span>Login</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </div>
      </motion.button>

      {/* Admin Login Dialog */}
      <Dialog
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        title="Admin Login (એડમિન)"
        confirmText="Login"
        cancelText="રદ કરો"
        onConfirm={handleAdminLogin}
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-600">
            એડમિન Control Center ખોલવા માટે credentials દાખલ કરો:
          </p>

          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={e => { setUsername(e.target.value); setError(false); }}
                placeholder="username"
                className={`w-full pl-10 pr-4 py-3 bg-gray-50 border-2 rounded-2xl text-sm font-semibold text-primary outline-none ${error ? 'border-red-500' : 'border-gray-200 focus:border-primary'}`}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(false); }}
                placeholder="••••••••"
                className={`w-full pl-10 pr-12 py-3 bg-gray-50 border-2 rounded-2xl text-sm font-semibold text-primary outline-none ${error ? 'border-red-500' : 'border-gray-200 focus:border-primary'}`}
                onKeyDown={e => e.key === 'Enter' && handleAdminLogin()}
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute right-3 top-3 text-gray-400"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-600 font-semibold text-center">
              ❌ ખોટું username અથવા password
            </p>
          )}
        </div>
      </Dialog>
    </div>
  );
};
