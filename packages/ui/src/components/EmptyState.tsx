import React from 'react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-12 px-6 ${className || ''}`}
    >
      {icon && <div className="mb-4 text-on-surface-variant opacity-60">{icon}</div>}
      <h3 className="font-headline-md text-headline-md text-on-surface mb-2">{title}</h3>
      {description && (
        <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mb-4">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};