'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Bus as BusIcon, Route as RouteIcon, Check, LocateFixed, MapPin } from 'lucide-react';
import { LoadingSpinner, EmptyState } from '@smart-bus/ui';
import { Route, Bus, LiveLocationUpdate } from '@/lib/data/types';
import { dataProvider } from '@/lib/data';

const MapSurface = dynamic(() => import('@/components/MapSurface'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-surface-variant animate-pulse" />
});

export default function RouteDetailsPage() {
  const params = useParams();
  const routeId = params?.id as string;
  const router = useRouter();

  const [route, setRoute] = useState<Route | null>(null);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dataProvider.getRouteById(routeId),
      dataProvider.getBuses()
    ]).then(([r, b]) => {
      setRoute(r);
      setBuses(b);
      setLoading(false);
    });

    const unsubscribe = dataProvider.subscribeToBusLocations((update: LiveLocationUpdate) => {
      setBuses(curr => curr.map(bus => 
        bus.id === update.bus_id ? { ...bus, current_location: { lat: update.lat, lng: update.lng } } : bus
      ));
    });

    return () => unsubscribe();
  }, [routeId]);

  const activeBuses = useMemo(() => buses.filter(b => b.current_route_id === routeId), [buses, routeId]);

  if (loading) return <div className="p-8 text-center flex items-center justify-center min-h-[50vh]"><LoadingSpinner size={32} /></div>;
  if (!route) return <div className="p-8 text-center min-h-[50vh] flex items-center justify-center"><EmptyState icon={<RouteIcon className="w-12 h-12 text-error" />} title="Route not found" description="The route you are looking for does not exist or has been removed." /></div>;

  return (
    <main className="md:pt-20 md:max-w-max-width-desktop md:mx-auto md:px-page-padding-desktop px-0 pb-24 bg-background min-h-screen">
      {/* Desktop Header Context */}
      <div className="hidden md:flex flex-col mb-8 pt-8 gap-2">
        <div className="flex items-center gap-4">
          <h1 className="font-display-lg text-display-lg text-primary">{route.name}</h1>
        </div>
        <p className="font-body-lg text-body-lg text-on-surface-variant ml-2">
          {route.stops?.length || 0} stops · {route.total_distance} km · {route.estimated_duration} min
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter md:gap-8 mt-4 md:mt-0 px-page-padding-mobile md:px-0">
        
        {/* Left Column: Map & Buses */}
        <div className="md:col-span-7 flex flex-col gap-6">
          {/* Mini Map Preview */}
          <div className="w-full h-48 md:h-64 bg-surface-variant rounded-xl overflow-hidden relative shadow-sm border border-outline-variant border-opacity-30">
             <MapSurface 
                buses={activeBuses} 
                routes={[route]} 
                showPolylineForRouteId={routeId}
                center={route.stops?.[0] ? { lat: route.stops[0].lat, lng: route.stops[0].lng } : undefined}
                zoom={12}
             />
            
            {/* Contextual Map overlay */}
            <div className="absolute bottom-4 right-4 bg-surface/90 backdrop-blur-sm rounded-lg px-3 py-1 border border-outline-variant/20 shadow-sm flex items-center gap-2 z-10">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <span className="font-label-data text-label-data text-primary">Live Tracking</span>
            </div>
          </div>

          {/* Active Buses Section */}
          <section className="bg-surface rounded-xl p-6 border border-outline-variant border-opacity-30 shadow-sm">
            <h2 className="font-headline-sm text-headline-sm text-secondary mb-4 flex items-center gap-2">
              <BusIcon className="w-6 h-6" />
              Buses on this route
            </h2>
            
            <div className="flex flex-col gap-4">
              {activeBuses.length === 0 ? (
                <p className="text-on-surface-variant font-body-md text-body-md">No active buses currently.</p>
              ) : (
                activeBuses.map((bus, i) => (
                  <div key={bus.id} className="bg-surface-container-lowest p-4 rounded-lg border border-outline-variant/40 flex items-center justify-between hover:border-primary-fixed transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center font-label-data text-label-data text-white" style={{ backgroundColor: bus.color }}>
                        <BusIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-label-data text-label-data text-on-surface">{bus.id}</h3>
                        <p className="font-body-md text-body-md text-on-surface-variant">Next: {route.stops?.[1]?.name || 'Unknown'}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="font-label-caps text-label-caps text-primary bg-primary-fixed px-2 py-1 rounded">
                        {i === 0 ? '2 MIN AWAY' : '15 MIN AWAY'}
                      </span>
                      <button className="font-label-data text-label-data text-primary hover:text-primary-fixed-dim transition-colors flex items-center gap-1">
                        Track <LocateFixed className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Stop Timeline */}
        <div className="md:col-span-5">
          <section className="bg-surface rounded-xl p-6 border border-outline-variant border-opacity-30 shadow-sm h-full">
            <h2 className="font-headline-sm text-headline-sm text-secondary mb-6 flex items-center gap-2">
              <RouteIcon className="w-6 h-6" />
              Stop Timeline
            </h2>
            
            <div className="flex flex-col gap-0 relative timeline-container">
              {route.stops?.map((stop, index) => {
                const isPassed = index === 0;
                const isNext = index === 1;
                const isLast = index === route.stops!.length - 1;

                return (
                  <div key={stop.id} className="timeline-item flex gap-4 relative pb-6 group">
                    {/* Timeline Line */}
                    {!isLast && (
                        <div className="absolute left-[11px] top-6 bottom-[-6px] w-[2px] bg-surface-variant z-0 group-last:hidden"></div>
                    )}

                    {/* Icon */}
                    {isPassed ? (
                      <div className="relative z-10 w-6 h-6 rounded-full bg-surface-variant border-2 border-surface flex items-center justify-center shrink-0 mt-1">
                        <Check className="w-3 h-3 text-outline" />
                      </div>
                    ) : isNext ? (
                      <div className="relative z-10 w-6 h-6 rounded-full bg-primary border-4 border-primary-fixed shrink-0 mt-1 shadow-sm flex items-center justify-center" style={{ borderColor: route.color }}>
                        <div className="w-2 h-2 bg-surface rounded-full"></div>
                      </div>
                    ) : isLast ? (
                       <div className="relative z-10 w-6 h-6 rounded-full bg-surface border-2 border-outline-variant shrink-0 mt-1 flex items-center justify-center">
                          <MapPin className="w-3 h-3 text-outline-variant" />
                       </div>
                    ) : (
                      <div className="relative z-10 w-6 h-6 rounded-full bg-surface border-2 border-outline-variant shrink-0 mt-1"></div>
                    )}

                    {/* Content */}
                    {isNext ? (
                      <div className="flex-1 bg-surface-container-low p-3 rounded-lg -mt-2 border border-primary/10">
                        <h4 className="font-label-data text-label-data text-primary">{stop.name}</h4>
                        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                          Arriving soon • {activeBuses[0]?.id || 'Bus'}
                        </p>
                      </div>
                    ) : (
                      <div className={`flex-1 ${isPassed ? 'opacity-60' : ''}`}>
                        <h4 className="font-label-data text-label-data text-on-surface">{stop.name}</h4>
                        <p className="font-body-md text-body-md text-on-surface-variant">
                          {isPassed ? 'Passed' : 'Est. later'}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

