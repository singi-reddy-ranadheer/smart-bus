'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bus, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { dataProvider } from '@/lib/data';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    setLoading(true);
    try {
      await dataProvider.register(email, password, name, phone);
      router.push('/');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col md:justify-center md:items-center">
      {/* Top App Bar (Mobile Only) */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-page-padding-mobile h-14 bg-surface dark:bg-background md:hidden pt-safe">
        <button 
            onClick={() => router.back()}
            className="p-2 -ml-2 text-primary hover:bg-surface-container-low transition-colors rounded-full"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-headline-sm text-headline-sm text-on-surface">Create Account</h1>
        <div className="w-10"></div> {/* Spacer */}
      </header>

      <main className="w-full max-w-md mx-auto pt-20 pb-safe md:pt-0 px-page-padding-mobile md:px-0 flex-1 flex flex-col">
        {/* Desktop He…2815 tokens truncated… transition-colors">Favorites</button>
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

