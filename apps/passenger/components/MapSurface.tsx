'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Bus, Route } from '@/lib/data/types';

// Custom icons
const createBusIcon = (color: string, heading: number) => {
  return L.divIcon({
    className: 'custom-bus-marker',
    html: `
      <div class="relative flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-md border border-outline-variant" style="border-color: ${color}">
        <div class="w-6 h-6 rounded-full flex items-center justify-center text-white" style="background-color: ${color}">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(${heading}deg)"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const createSelectedBusIcon = (color: string, heading: number) => {
  return L.divIcon({
    className: 'custom-selected-bus-marker',
    html: `
      <div class="relative flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg border-2 ring-4 ring-white z-50" style="border-color: ${color}">
        <div class="w-8 h-8 rounded-full flex items-center justify-center text-white" style="background-color: ${color}">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(${heading}deg)"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
        </div>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });
};

const createStopIcon = () => {
  return L.divIcon({
    className: 'custom-stop-marker',
    html: `
      <div class="w-4 h-4 bg-white border-2 border-outline rounded-full shadow-sm"></div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

// Map recenter hook
function Recenter({ lat, lng, zoom }: { lat: number; lng: number; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], zoom || map.getZoom(), { animate: true, duration: 0.5 });
  }, [lat, lng, zoom, map]);
  return null;
}

interface MapSurfaceProps {
  buses: Bus[];
  routes: Route[];
  selectedBusId?: string | null;
  onBusClick?: (busId: string) => void;
  showPolylineForRouteId?: string;
  center?: { lat: number; lng: number };
  zoom?: number;
  interactive?: boolean;
}

export default function MapSurface({ 
  buses, 
  routes, 
  selectedBusId, 
  onBusClick, 
  showPolylineForRouteId,
  center = { lat: 52.6613, lng: -8.5721 },
  zoom = 13,
  interactive = true,
}: MapSurfaceProps) {
  const selectedBus = buses.find(b => b.id === selectedBusId);
  const routeToShow = routes.find(r => r.id === showPolylineForRouteId);

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer 
        center={[center.lat, center.lng]} 
        zoom={zoom} 
        zoomControl={false}
        scrollWheelZoom={interactive}
        dragging={interactive}
        doubleClickZoom={interactive}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Dynamic Center */}
        {(selectedBus?.current_location && !interactive) && (
          <Recenter lat={selectedBus.current_location.lat} lng={selectedBus.current_location.lng} />
        )}

        {/* Draw Route Polyline (Demo Only) */}
        {routeToShow && routeToShow.stops && routeToShow.stops.length > 0 && (
          <Polyline 
            positions={routeToShow.stops.map(s => [s.lat, s.lng])} 
            color={routeToShow.color} 
            weight={4}
            opacity={0.7}
          />
        )}

        {/* Draw Stops if Route is selected */}
        {routeToShow && routeToShow.stops && routeToShow.stops.map(stop => (
          <Marker 
            key={`stop-${stop.id}`} 
            position={[stop.lat, stop.lng]} 
            icon={createStopIcon()}
          >
             <Popup>{stop.name}</Popup>
          </Marker>
        ))}

        {/* Draw Buses */}
        {buses.filter(b => b.current_location).map((bus) => {
          const isSelected = bus.id === selectedBusId;
          const icon = isSelected 
            ? createSelectedBusIcon(bus.color, bus.heading || 0) 
            : createBusIcon(bus.color, bus.heading || 0);

          return (
            <Marker
              key={bus.id}
              position={[bus.current_location!.lat, bus.current_location!.lng]}
              icon={icon}
              eventHandlers={{
                click: () => {
                  if (onBusClick) onBusClick(bus.id);
                },
              }}
              zIndexOffset={isSelected ? 1000 : 1}
            >
              {!isSelected && (
                 <Popup>
                    <div className="text-center">
                      <p className="font-label-data text-label-data text-on-surface m-0">{bus.current_route?.name || 'Bus'}</p>
                      
                    </div>
                 </Popup>
              )}
            </Marker>
          );
        })}
      </MapContainer>

      {/* Tailwind specific overrides for leaflet */}
      <style jsx global>{`
        .leaflet-container {
          font-family: inherit;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(16,42,67,0.14);
        }
      `}</style>
    </div>
  );
}
