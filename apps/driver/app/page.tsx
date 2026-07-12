'use client';

import { useEffect, useState } from 'react';
import { Play, Square, MapPin, Bus, AlertTriangle } from 'lucide-react';
import { driverApi, wsClient } from '@/lib/api';
import { useLocation } from '@/hooks/use-location';

export default function DriverHomePage() {
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [assignedBus, setAssignedBus] = useState<{ id: string; bus_number: string; plate_number: string } | null>(null);
  const [assignedRoute, setAssignedRoute] = useState<{ id: string; name: string; color: string } | null>(null);
  const { position } = useLocation();

  useEffect(() => {
    // Simulated assigned bus/route for driver
    setAssignedBus({
      id: 'c1d2e3f4-0001-4000-8000-000000000001',
      bus_number: 'BUS-001',
      plate_number: 'KA-01-AB-1234',
    });
    setAssignedRoute({
      id: 'a1b2c3d4-0001-4000-8000-000000000001',
      name: 'Campus Express',
      color: '#E4572E',
    });
  }, []);

  useEffect(() => {
    if (trip?.id) {
      wsClient.connect();
    }
  }, [trip?.id]);

  useEffect(() => {
    if (!trip?.id || !position) return;

    const interval = setInterval(() => {
      wsClient.send('gps:update', {
        trip_id: trip.id,
        lat: position.lat,
        lng: position.lng,
        speed: 30,
        heading: 0,
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [trip?.id, position]);

  const startTrip = async () => {
    if (!assignedBus || !assignedRoute) return;
    setLoading(true);
    try {
      const newTrip = await driverApi.createTrip(assignedBus.id, assignedRoute.id);
      setTrip(newTrip);
      wsClient.connect();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const endTrip = async () => {
    if (!trip) return;
    try {
      await driverApi.updateTrip(trip.id, { status: 'completed' });
      setTrip(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-on-surface">Driver Console</h1>

      {!trip ? (
        <div className="bg-surface rounded-xl border border-outline p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-lg">Ready to start</h2>
          {assignedBus && (
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><Bus className="w-4 h-4 text-primary" /> {assignedBus.bus_number} ({assignedBus.plate_number})</div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-accent" /> {assignedRoute?.name}</div>
            </div>
          )}
          <button
            onClick={startTrip}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-success text-white rounded-lg hover:bg-success/80 disabled:opacity-50"
          >
            <Play className="w-5 h-5" /> {loading ? 'Starting...' : 'Start Trip'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-surface rounded-xl border border-outline p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Trip in Progress</h2>
              <span className="px-2 py-1 rounded-full text-xs bg-success/10 text-success">Active</span>
            </div>
            <div className="text-sm text-on-surface-muted">Trip ID: {trip.id.slice(0, 8)}...</div>
            {position ? (
              <div className="text-xs text-on-surface-muted">
                GPS: {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
              </div>
            ) : (
              <div className="text-xs text-warning">Waiting for GPS...</div>
            )}
            <button
              onClick={endTrip}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-error text-white rounded-lg"
            >
              <Square className="w-5 h-5" /> End Trip
            </button>
          </div>
        </div>
      )}

      <div className="bg-surface rounded-xl border border-outline p-6 shadow-sm flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
        <div>
          <h3 className="font-semibold text-sm">SOS Emergency</h3>
          <p className="text-xs text-on-surface-muted">Use only in genuine emergencies.</p>
          <button
            onClick={() => trip && wsClient.send('sos:alert', { trip_id: trip.id, message: 'SOS from driver' })}
            disabled={!trip}
            className="mt-2 px-3 py-2 bg-error text-white rounded-lg text-sm disabled:opacity-50"
          >
            Send SOS
          </button>
        </div>
      </div>
    </div>
  );
}