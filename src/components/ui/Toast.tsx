import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const Toast: React.FC = () => {
  const { toast, hideToast } = useAppStore();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        hideToast();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast, hideToast]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed top-5 left-4 right-4 z-50 max-w-md mx-auto pointer-events-auto"
        >
          <div
            className={`flex items-center gap-3 p-4 rounded-2xl shadow-soft-lg border text-base font-semibold ${
              toast.type === 'success'
                ? 'bg-primary text-white border-primary/50'
                : toast.type === 'error'
                ? 'bg-rose-600 text-white border-rose-700'
                : 'bg-white text-primary border-gray-200'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-6 h-6 text-accent shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-6 h-6 text-white shrink-0" />}
            {toast.type === 'info' && <Info className="w-6 h-6 text-accent shrink-0" />}
            
            <p className="flex-1 leading-snug">{toast.message}</p>

            <button
              onClick={hideToast}
              className="p-1 rounded-full hover:bg-white/20 active:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5 opacity-80" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
