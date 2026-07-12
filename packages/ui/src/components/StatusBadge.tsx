import React from 'react';

export type StatusType = 'live' | 'offline' | 'delayed' | 'active' | 'inactive';

export interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
}

const STATUS_CONFIG: Record<StatusType, { color: string; bg: string; label: string }> = {
  live: { color: '#168A5B', bg: 'rgba(22, 138, 91, 0.12)', label: 'Live now' },
  active: { color: '#168A5B', bg: 'rgba(22, 138, 91, 0.12)', label: 'Active' },
  offline: { color: '#627D98', bg: 'rgba(98, 125, 152, 0.12)', label: 'Offline' },
  inactive: { color: '#627D98', bg: 'rgba(98, 125, 152, 0.12)', label: 'Inactive' },
  delayed: { color: '#B54708', bg: 'rgba(181, 71, 8, 0.12)', label: 'Delayed' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  className,
}) => {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${className || ''}`}
      style={{ color: config.color, backgroundColor: config.bg }}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{
          backgroundColor: config.color,
          animation: status === 'live' || status === 'active' ? 'pulse 1.5s infinite' : 'none',
        }}
      />
      {label || config.label}
    </span>
  );
};