import React from 'react';

export interface BusMarkerProps {
  busNumber: string;
  routeColor?: string;
  heading?: number;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export const BusMarker: React.FC<BusMarkerProps> = ({
  busNumber,
  routeColor = '#3B82F6',
  heading = 0,
  selected = false,
  onClick,
  className,
}) => {
  return (
    <div
      className={`relative flex items-center justify-center ${className || ''}`}
      style={{ width: 40, height: 40 }}
      onClick={onClick}
      role="button"
      aria-label={`Bus ${busNumber}`}
    >
      {/* Direction indicator */}
      <div
        className="absolute"
        style={{
          transform: `rotate(${heading}deg)`,
          width: 0,
          height: 0,
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderBottom: `14px solid ${routeColor}`,
          top: -4,
        }}
      />
      {/* Bus icon circle */}
      <div
        className={`flex items-center justify-center rounded-full text-white font-bold text-xs transition-all ${
          selected ? 'ring-4 ring-white' : ''
        }`}
        style={{
          width: 28,
          height: 28,
          backgroundColor: routeColor,
        }}
      >
        {busNumber.replace('BUS-', '')}
      </div>
    </div>
  );
};