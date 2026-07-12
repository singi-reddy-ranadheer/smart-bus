import React from 'react';

export interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 24,
  className,
}) => {
  return (
    <div
      className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className || ''}`}
      style={{ width: size, height: size, color: '#0B5FFF' }}
      role="status"
      aria-label="Loading"
    />
  );
};