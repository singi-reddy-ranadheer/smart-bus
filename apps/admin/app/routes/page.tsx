'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import { LoadingSpinner } from '@smart-bus/ui';

export default function RoutesPage() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getRoutes()
      .then(setRoutes)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><LoadingSpinner size={32} /></div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-on-surface mb-6">Routes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {routes.map((route) => (
          <div key={route.id} className="bg-surface rounded-xl border border-outline p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-4 h-4 rounded-full" style={{ backgroundColor: route.color }} />
              <h3 className="font-semibold text-on-surface">{route.name}</h3>
            </div>
            <p className="text-sm text-on-surface-muted mb-2">{route.description || 'No description'}</p>
            <div className="text-xs text-on-surface-muted">
              <span className="mr-3">{route.total_distance} km</span>
              <span>{route.estimated_duration} min</span>
            </div>
            <div className="mt-3 text-xs text-on-surface-muted">
              {route.stops?.length || 0} stops
            </div>
          </div>
        ))}
        {routes.length === 0 && (
          <div className="col-span-full text-center text-on-surface-muted py-12">No routes configured yet.</div>
        )}
      </div>
    </div>
  );
}