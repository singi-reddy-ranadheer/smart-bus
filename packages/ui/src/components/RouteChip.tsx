import React from 'react';

export interface RouteChipProps {
  name: string;
  color: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export const RouteChip: React.FC<RouteChipProps> = ({
  name,
  color,
  selected = false,
  onClick,
  className,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm transition-colors ${
        selected ? 'text-white' : 'bg-white text-on-surface hover:bg-surface-container-low'
      } ${className || ''}`}
      style={{
        borderColor: selected ? color : 'rgb(217, 226, 236)',
        backgroundColor: selected ? color : 'white',
      }}
      aria-pressed={selected}
    >
      <span
        className="w-3 h-3 rounded-full"
        style={{ backgroundColor: selected ? 'white' : color }}
      />
      <span className="font-label-data text-label-data">{name}</span>
    </button>
  );
};