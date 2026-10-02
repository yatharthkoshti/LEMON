import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'secondary' | 'outline' | 'danger' | 'success';
  size?: 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'lg',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = true,
  disabled,
  className = '',
  onClick,
  ...props
}) => {
  const baseClasses =
    'relative inline-flex items-center justify-center font-bold transition-all duration-150 select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 shadow-sm';

  const sizeClasses = {
    md: 'min-h-[46px] px-4 py-2.5 text-base rounded-2xl gap-2',
    lg: 'min-h-[54px] px-5 py-3 text-lg rounded-2xl gap-2.5',
    xl: 'min-h-[62px] px-6 py-4 text-xl rounded-3xl gap-3 font-extrabold',
  }[size];

  const variantClasses = {
    primary:
      'bg-primary text-white hover:bg-primary-hover active:bg-black shadow-soft',
    accent:
      'bg-accent text-primary hover:bg-accent-hover active:bg-accent-dark shadow-accent',
    secondary:
      'bg-gray-100 text-secondary-dark hover:bg-gray-200 active:bg-gray-300',
    outline:
      'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white',
    danger:
      'bg-red-50 text-lemonRed border border-red-200 hover:bg-red-100 active:bg-red-200',
    success:
      'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 shadow-soft',
  }[variant];

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${widthClass} ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...(props as any)}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
          <span className="truncate">{children}</span>
          {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
};
