import React from 'react';
import { User, CheckCircle2 } from 'lucide-react';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  verified?: boolean;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  verified = false,
  className = ''
}) => {
  const sizeMap = {
    sm: 'w-10 h-10 text-base',
    md: 'w-14 h-14 text-xl',
    lg: 'w-20 h-20 text-2xl',
    xl: 'w-28 h-28 text-4xl'
  };

  const getInitials = (str: string) => {
    if (!str) return 'L';
    const parts = str.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return str.substring(0, 2).toUpperCase();
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className={`${sizeMap[size]} rounded-full bg-accent/25 border-2 border-accent flex items-center justify-center font-bold text-primary shadow-soft overflow-hidden`}
      >
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="font-heading">{getInitials(name)}</span>
        )}
      </div>
      {verified && (
        <span
          className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm text-blue-600"
          title="Verified Worker"
        >
          <CheckCircle2 className={size === 'xl' ? 'w-7 h-7 fill-blue-600 text-white' : 'w-5 h-5 fill-blue-600 text-white'} />
        </span>
      )}
    </div>
  );
};
