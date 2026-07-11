Exit code: 0
Wall time: 0.7 seconds
Output:
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, ArrowUpRight, ArrowRight, WifiOff } from 'lucide-react';
import { Route, Bus } from '@/lib/data/types';
import { dataProvider } from '@/lib/data';

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dataProvider.getRoutes().then(setRoutes);
    dataProvider.getBuses().then(setBuses);
  }, []);

  const filteredRoutes = routes.filter(route => 
    route.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="flex-1 w-full max-w-max-width-desktop mx-auto px-page-padding-mobile pt-20 pb-24 md:pt-24 flex flex-col gap-6 bg-background min-h-screen">
      {/* Header & Search */}
      <div className="flex flex-col gap-4">
        <h2 className="font-headline-lg-mobile md:font-display-lg text-headline-lg-mobile md:text-display-lg text-on-surface">Explore Routes</h2>
        
        {/* Input Field */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
          <input 
            type="text" 
            placeholder="Search by route name or destination" 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-14 pl-12 pr-4 bg-surface rounded-lg border border-outline-variant focus:border-primary focus:border-2 focus:outline-none transition-all font-body-lg text-on-surface placeholder:text-on-surface-variant/70 shadow-sm"
          />
        </div>

        {/* Quick Filters (Route Chips) */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1 -mx-page-padding-mobile px-page-padding-mobile md:mx-0 md:px-0">
          <button className="whitespace-nowrap px-4 py-2 bg-secondary-container text-on-secondary-container rounded-full font-label-data text-label-data border border-transparent">All Routes</button>
          <button className="whitespace-nowrap px-4 py-2 bg-surface text-on-surface-variant border border-outline-variant rounded-full font-label-data text-label-data hover:bg-surface-container transition-colors">Favorites</button>
          <button className="whitespace-nowrap px-4 py-2 bg-surface text-on-surface-variant border border-outline-variant rounded-full font-label-data text-label-data hover:bg-surface-container transition-colors">Express</button>
          <button className="whitespace-nowrap px-4 py-2 bg-surface text-on-surface-variant border border-outline-variant rounded-full font-label-data text-label-data hover:bg-surface-container transition-colors">Local</button>
        </div>
      </div>

      {/* Routes List */}
      <div className="flex flex-col gap-4">
        {filteredRoutes.map((route) => {
          const activeBusesCount = buses.filter(b => b.current_route_id === route.id).length;

          return (
            <div key={route.id} className="bg-surface rounded-xl p-5 border border-outline-variant shadow-[0_4px_12px_rgba(16,42,67,0.06)] flex flex-col gap-5 relative overflow-hidden group hover:border-primary-fixed-dim transition-colors">
              {/* Decorative subtle gradient backdrop */}
              <div 
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-10"
                style={{ backgroundColor: route.color }}
              ></div>
              
              <div className="flex justify-between items-start z-10">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm" style={{ backgroundColor: route.color }}>
                    <ArrowUpRight className="w-3 h-3" />
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">{route.name}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">{route.stops?.[0]?.name} - {route.stops?.[route.stops.length-1]?.name}</p>
                  </div>
                </div>
                {activeBusesCount > 0 && (
                  <div className="flex items-center gap-1.5 bg-surface-container px-2.5 py-1 rounded-md border border-outline-variant/50">
                    <div className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: route.color }}></span>
                      <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: route.color }}></span>
                    </div>
                    <span className="font-label-caps text-label-caps" style={{ color: route.color }}>{activeBusesCount} ACTIVE</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 py-3 border-y border-surface-variant/50 z-10">
                <div className="flex flex-col gap-1">
                  <span className="font-label-caps text-label-caps text-outline">DISTANCE</span>
                  <span className="font-label-data text-label-data text-on-surface flex items-center gap-1">
                    {route.total_distance} km
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-label-caps text-label-caps text-outline">EST. DURATION</span>
                  <span className="font-label-data text-label-data text-on-surface">{route.estimated_duration} min</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-label-caps text-label-caps text-outline">STOPS</span>
                  <span className="font-label-data text-label-data text-on-surface">{route.stops?.length || 0} total</span>
                </div>
              </div>

              <Link 
                href={`/route/${route.id}`}
                className="w-full h-12 bg-primary-container text-on-primary-container font-label-data text-label-data rounded-lg flex items-center justify-center gap-2 hover:bg-primary-fixed-dim transition-colors z-10"
              >
                View route
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          );
        })}

        {/* Empty State Placeholder */}
        {filteredRoutes.length === 0 && (
          <div className="bg-surface-container-lowest rounded-xl p-8 border-2 border-dashed border-outline-variant/50 flex flex-col items-center justify-center text-center mt-2 gap-3">
            <div className="w-16 h-16 rounded-full bg-surface-variant flex items-center justify-center mb-2">
              <WifiOff className="w-8 h-8 text-outline" />
            </div>
            <h4 className="font-headline-sm text-headline-sm text-on-surface">No active routes found</h4>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-[250px]">
              We couldn&apos;t find any routes matching your search.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
