import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './Button';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  confirmVariant?: 'primary' | 'accent' | 'danger' | 'success';
  isLoading?: boolean;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  confirmText,
  cancelText,
  onConfirm,
  confirmVariant = 'primary',
  isLoading = false
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm bg-card rounded-3xl shadow-soft-lg border border-gray-100 z-10 max-h-[80vh] flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between p-5 pb-3 border-b border-gray-100 shrink-0">
              <h3 className="text-xl font-bold text-primary tracking-tight font-heading">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-primary active:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-5 py-4 text-base text-gray-700 leading-relaxed font-body overflow-y-auto flex-1">
              {children}
            </div>

            {(confirmText || cancelText) && (
              <div className="flex flex-col gap-2 p-5 pt-3 border-t border-gray-100 shrink-0">
                {confirmText && (
                  <Button
                    variant={confirmVariant}
                    size="lg"
                    onClick={onConfirm}
                    isLoading={isLoading}
                  >
                    {confirmText}
                  </Button>
                )}
                {cancelText && (
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={onClose}
                    disabled={isLoading}
                  >
                    {cancelText}
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
