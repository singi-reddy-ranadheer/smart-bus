'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import { LoadingSpinner } from '@smart-bus/ui';

export default function TripsPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getTrips()
      .then((data) => setTrips(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><LoadingSpinner size={32} /></div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-on-surface mb-6">Trip History</h1>
      <div className="bg-surface rounded-xl border border-outline shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-subtle">
            <tr>
              <th className="text-left p-4">Trip ID</th>
              <th className="text-left p-4">Bus</th>
              <th className="text-left p-4">Route</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Start</th>
              <th className="text-left p-4">End</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr key={trip.id} className="border-t border-outline">
                <td className="p-4 font-mono text-xs">{trip.id?.slice(0, 8)}...</td>
                <td className="p-4">{trip.bus?.bus_number || '—'}</td>
                <td className="p-4">{trip.route?.name || '—'}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${trip.status === 'active' ? 'bg-success/10 text-success' : trip.status === 'completed' ? 'bg-primary/10 text-primary' : 'bg-outline text-on-surface-muted'}`}>
                    {trip.status}
                  </span>
                </td>
                <td className="p-4">{trip.start_time ? new Date(trip.start_time).toLocaleTimeString() : '—'}</td>
                <td className="p-4">{trip.end_time ? new Date(trip.end_time).toLocaleTimeString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {trips.length === 0 && (
          <div className="p-8 text-center text-on-surface-muted">No trips yet. Start the simulator to generate trips.</div>
        )}
      </div>
    </div>
  );
}