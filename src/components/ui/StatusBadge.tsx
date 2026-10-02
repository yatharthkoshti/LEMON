import React from 'react';

interface StatusBadgeProps {
  status: 'available' | 'unavailable' | 'assigned' | 'accepted' | 'declined' | 'completed' | 'high_wage' | 'urgent';
  label: string;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'md',
  icon
}) => {
  const styles = {
    available: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    unavailable: 'bg-gray-100 text-gray-700 border-gray-300',
    assigned: 'bg-amber-100 text-amber-900 border-amber-300',
    accepted: 'bg-blue-100 text-blue-900 border-blue-300',
    declined: 'bg-red-100 text-red-800 border-red-300',
    completed: 'bg-purple-100 text-purple-900 border-purple-300',
    high_wage: 'bg-accent/40 text-amber-950 border-accent font-bold',
    urgent: 'bg-rose-500 text-white animate-pulse'
  }[status];

  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm font-semibold';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border shadow-2xs ${styles} ${sizeClasses}`}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
    </span>
  );
};
