'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Search, LocateFixed, Plus, Minus } from 'lucide-react';
import { Bus, Route, LiveLocationUpdate } from '@/lib/data/types';
import { dataProvider } from '@/lib/data';
import { BusInfoSheet } from '@/components/BusInfoSheet';
import { LoadingSpinner, RouteChip } from '@smart-bus/ui';

const MapSurface = dynamic(() => import('@/components/MapSurface'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-surface-variant animate-pulse" />
});

export default function HomePage() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    dataProvider.getCurrentUser().then(user => {
      if (!user) {
        router.push('/login');
      } else {
        setAuthLoading(false);
      }
    });
    dataProvider.getBuses().then(setBuses);
    dataProvider.getRoutes().then(setRoutes);
    const unsubscribe = dataProvider.subscribeToBusLocations((update) => {
      setBuses((current) =>
        current.map((bus) =>
          bus.id === update.bus_id
            ? { ...bus, current_location: { lat: update.lat, lng: update.lng }, current_speed: update.speed, heading: update.heading }
            : bus
        )
      );
    });
    return () => unsubscribe();
  }, [router]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-surface-variant">
        <LoadingSpinner size={32} />
      </div>
    );
  }

  const selectedBus = useMemo(() => buses.find(b => b.id === selectedBusId) || null, [buses, selectedBusId]);
  const selectedRoute = useMemo(() => routes.find(r => r.id === selectedBus?.current_route_id) || null, [routes, selectedBus]);

  return (
    <main className="flex-1 w-full h-full relative overflow-hidden bg-surface-variant">
      <div className="absolute inset-0 z-0">
        <MapSurface buses={buses} routes={routes} selectedBusId={selectedBusId} onBusClick={setSelectedBusId} />
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between pb-[calc(72px+env(safe-area-inset-bottom))] md:pb-0 md:pt-14">
        <div className="pt-safe mt-4 px-page-padding-mobile md:px-page-padding-desktop pointer-events-auto">
          <div className="flex justify-between items-center mb-4 md:hidden">
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface drop-shadow-md">Good Morning</h1>
          </div>
          <div className="relative flex items-center w-full max-w-md mx-auto md:mx-0 bg-surface rounded-xl shadow-[0_8px_24px_rgba(16,42,67,0.14)] border border-outline-variant">
            <div className="pl-4 pr-2 py-3 flex items-center"><Search className="w-5 h-5 text-on-surface-variant" /></div>
            <input type="text" placeholder="Search a route or stop" className="w-full bg-transparent border-none focus:outline-none focus:ring-0 font-body-lg text-body-lg text-on-surface placeholder:text-on-surface-variant py-3" />
          </div>
          <div className="mt-4 flex gap-3 overflow-x-auto hide-scrollbar pb-2 max-w-full">
            <div className="flex-shrink-0 flex items-center gap-2 bg-surface px-4 py-2 rounded-full border border-outline-variant shadow-sm">
              <div className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></div>
              <span className="font-label-data text-label-data text-on-surface">{buses.length} buses live</span>
            </div>
            {routes.map(route => (
              <RouteChip key={route.id} name={route.name} color={route.color} />
            ))}
          </div>
        </div>

        <div className="px-page-padding-mobile md:px-page-padding-desktop pb-8 flex flex-col items-end gap-4 pointer-events-auto max-w-max-width-desktop mx-auto w-full">
          <button onClick={() => setSelectedBusId(null)} className="w-12 h-12 bg-surface rounded-full shadow-[0_8px_24px_rgba(16,42,67,0.14)] border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors">
            <LocateFixed className="w-6 h-6" />
          </button>
          <div className="flex flex-col bg-surface rounded-lg shadow-[0_8px_24px_rgba(16,42,67,0.14)] border border-outline-variant overflow-hidden">
            <button className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low border-b border-outline-variant transition-colors"><Plus className="w-5 h-5" /></button>
            <button className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors"><Minus className="w-5 h-5" /></button>
          </div>
        </div>
      </div>

      <BusInfoSheet bus={selectedBus} route={selectedRoute} onClose={() => setSelectedBusId(null)} />
    </main>
  );
}
