'use client';

import { useEffect, useState } from 'react';
import { Bus, Route, MapPin, Activity } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { LoadingSpinner } from '@smart-bus/ui';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    buses: 0,
    routes: 0,
    activeTrips: 0,
    loading: true,
  });

  useEffect(() => {
    Promise.all([
      adminApi.getBuses().catch(() => []),
      adminApi.getRoutes().catch(() => []),
      adminApi.getTrips('active').catch(() => []),
    ])
      .then(([buses, routes, trips]) => {
        setStats({
          buses: Array.isArray(buses) ? buses.length : 0,
          routes: Array.isArray(routes) ? routes.length : 0,
          activeTrips: Array.isArray(trips) ? trips.length : 0,
          loading: false,
        });
      })
      .catch(() => setStats((s) => ({ ...s, loading: false })));
  }, []);

  if (stats.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size={32} />
      </div>
    );
  }

  const cards = [
    { label: 'Active Buses', value: stats.buses, icon: Bus, color: 'text-primary' },
    { label: 'Routes', value: stats.routes, icon: Route, color: 'text-accent' },
    { label: 'Active Trips', value: stats.activeTrips, icon: Activity, color: 'text-success' },
    { label: 'Stops', value: '—', icon: MapPin, color: 'text-secondary' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-on-surface mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-surface rounded-xl border border-outline p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-on-surface-muted">{card.label}</span>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <div className="text-3xl font-bold text-on-surface">{card.value}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-surface rounded-xl border border-outline p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-on-surface mb-2">System Status</h2>
        <p className="text-sm text-on-surface-muted">
          Simulation MVP running. Connect the simulator service to see live bus movement.
          API endpoint: <code className="text-primary">http://localhost:4000/api/v1</code>
        </p>
      </div>
    </div>
  );
}