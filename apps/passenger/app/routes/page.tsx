'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight } from 'lucide-react';
import { Route, Bus } from '@/lib/data/types';
import { dataProvider } from '@/lib/data';
import { EmptyState, LoadingSpinner } from '@smart-bus/ui';

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dataProvider.getRoutes(),
      dataProvider.getBuses()
    ]).then(([r, b]) => {
      setRoutes(r);
      setBuses(b);
      setLoading(false);
    });
  }, []);

  const filteredRoutes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return routes;
    return routes.filter((route) => route.name.toLowerCase().includes(query));
  }, [routes, searchQuery]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background px-4 py-6 text-on-background flex items-center justify-center">
        <LoadingSpinner size={32} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-on-background">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Explore Routes</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-outline" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by route name"
              className="h-12 w-full rounded-lg border border-outline-variant bg-surface pl-10 pr-4 outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {filteredRoutes.map((route) => {
            const activeBusesCount = buses.filter((bus) => bus.current_route_id === route.id).length;
            return (
              <div key={route.id} className="rounded-2xl border border-outline-variant bg-surface p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">{route.name}</h3>
                    <p className="mt-1 text-sm text-on-surface-variant">
                      {route.stops?.[0]?.name || 'Start'} - {route.stops?.[route.stops.length - 1]?.name || 'End'}
                    </p>
                  </div>
                  {activeBusesCount > 0 && (
                    <span className="rounded-full bg-primary-container px-3 py-1 text-sm font-medium text-on-primary-container">{activeBusesCount} active</span>
                  )}
                </div>
                <div className="mt-4 grid gap-3 rounded-xl border border-outline-variant/50 bg-background/60 p-3 sm:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-outline">Distance</p>
                    <p className="mt-1 text-sm">{route.total_distance} km</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-outline">Duration</p>
                    <p className="mt-1 text-sm">{route.estimated_duration} min</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-outline">Stops</p>
                    <p className="mt-1 text-sm">{route.stops?.length || 0} total</p>
                  </div>
                </div>
                <Link href={'/route/' + route.id} className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-medium text-on-primary">
                  View route
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            );
          })}

          {filteredRoutes.length === 0 && (
            <EmptyState
              title={searchQuery ? 'No routes found' : 'No routes available'}
              description={searchQuery ? 'Try a different search term.' : 'Routes will appear here once available.'}
            />
          )}
        </div>
      </div>
    </main>
  );
}