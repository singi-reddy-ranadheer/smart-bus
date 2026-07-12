'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Users, AlertTriangle, Navigation } from 'lucide-react';
import { driverApi, wsClient } from '@/lib/api';
import { useLocation } from '@/hooks/use-location';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons in Leaflet with webpack/bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function RecenterMap({ center }: { center: [number, number] | null }) {
  const map = useMap();
  if (center) map.setView(center, 15);
  return null;
}

export default function TripPage() {
  const [trip, setTrip] = useState<any>(null);
  const [passengerCount, setPassengerCount] = useState(0);
  const { position } = useLocation();

  useEffect(() => {
    // In a real app, fetch the active trip for the driver
    // For demo, we check if there's an active trip from the backend
    driverApi.getTrips()
      .then((trips) => {
        const active = trips.find((t: any) => t.status === 'active');
        if (active) setTrip(active);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!trip?.id) return;

    wsClient.connect();

    const unsub = wsClient.on('trip:ended', () => {
      setTrip(null);
    });

    return () => {
      unsub();
    };
  }, [trip?.id]);

  const updatePassengerCount = async () => {
    if (!trip) return;
    try {
      const updated = await driverApi.updateTrip(trip.id, { passenger_count: passengerCount });
      setTrip(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const sendSOS = () => {
    if (!trip) return;
    wsClient.send('sos:alert', { trip_id: trip.id, message: 'SOS from driver' });
  };

  if (!trip) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-on-surface-muted">
        <Navigation className="w-12 h-12 mb-4 opacity-40" />
        <p>No active trip</p>
        <p className="text-sm">Start a trip from the Home tab</p>
      </div>
    );
  }

  const center: [number, number] | null = position ? [position.lat, position.lng] : null;

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <div className="flex-1 relative rounded-xl overflow-hidden border border-outline">
        <MapContainer center={center || [12.9716, 77.5946]} zoom={15} className="h-full w-full">
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {center && <RecenterMap center={center} />}
          {center && (
            <Marker position={center}>
              <Popup>
                <div className="text-xs">
                  <strong>Your location</strong>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      <div className="mt-4 space-y-3">
        <div className="bg-surface rounded-xl border border-outline p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <span className="font-medium">Passengers</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              className="w-16 px-2 py-1 border border-outline rounded text-center text-sm"
              value={passengerCount}
              onChange={(e) => setPassengerCount(parseInt(e.target.value) || 0)}
              min={0}
            />
            <button onClick={updatePassengerCount} className="px-3 py-1 bg-primary text-white rounded text-sm">
              Update
            </button>
          </div>
        </div>

        <button
          onClick={sendSOS}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-error text-white rounded-lg"
        >
          <AlertTriangle className="w-5 h-5" /> Send SOS Alert
        </button>
      </div>
    </div>
  );
}