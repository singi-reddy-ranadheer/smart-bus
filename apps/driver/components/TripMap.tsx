'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons in Leaflet with webpack/bundlers
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
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

interface TripMapProps {
  center: [number, number] | null;
}

export default function TripMap({ center }: TripMapProps) {
  return (
    <MapContainer center={center || [12.9716, 77.5946]} zoom={15} className="h-full w-full">
      <TileLayer
        attribution="&copy; OpenStreetMap"
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
  );
}
