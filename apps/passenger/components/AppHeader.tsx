'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, ArrowLeft, Search, UserRound } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  // Mobile Back header for specific routes like route details
  const isRouteDetail = pathname?.startsWith('/route/');
  if (isRouteDetail) {
    return (
      <div className="md:hidden flex items-center p-page-padding-mobile gap-4 bg-surface sticky top-0 z-40 border-b border-outline-variant/30 pt-safe">
          <button
          aria-label="Go back"
          onClick={() => router.back()}
          className="p-2 -ml-2 rounded-full bg-surface-container-low hover:bg-surface-container-highest transition-colors text-on-surface-variant flex items-center justify-center"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="font-headline-sm text-headline-sm text-primary">Route Details</h1>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Default Header */}
      <header className="md:hidden fixed top-0 w-full z-50 flex justify-between items-center px-page-padding-mobile h-14 bg-surface border-b border-outline-variant pt-safe">
        <div className="flex items-center gap-4">
          <button aria-label="Menu" className="text-primary dark:text-primary-fixed hover:bg-surface-container-low transition-colors rounded-full p-2 active:scale-95 duration-100 -ml-2">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="font-headline-md text-headline-md font-bold text-primary">Smart Bus AI</h1>
        </div>
        <div className="flex items-center">
          <Link href="/profile" aria-label="Open profile" className="w-10 h-10 rounded-full bg-primary-fixed border border-outline-variant flex items-center justify-center text-primary hover:bg-surface-container transition-colors">
            <UserRound className="w-5 h-5" aria-hidden="true" />
          </Link>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden md:flex fixed top-0 w-full z-50 justify-between items-center px-page-padding-desktop h-14 bg-surface border-b border-outline-variant">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-headline-md text-headline-md font-bold text-primary">
            Smart Bus AI
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className={twMerge('flex items-center gap-2 font-bold px-3 py-2 rounded-lg transition-colors', pathname === '/' ? 'text-primary' : 'text-on-surface-variant hover:bg-surface-container-low')}>
            Map
          </Link>
          <Link href="/routes" className={twMerge('flex items-center gap-2 font-bold px-3 py-2 rounded-lg transition-colors', pathname === '/routes' ? 'text-primary' : 'text-on-surface-variant hover:bg-surface-container-low')}>
            Routes
          </Link>
          <Link href="/profile" className={twMerge('flex items-center gap-2 font-bold px-3 py-2 rounded-lg transition-colors', pathname === '/profile' ? 'text-primary' : 'text-on-surface-variant hover:bg-surface-container-low')}>
            Profile
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <div className="relative w-64 hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
            <input 
              type="text" 
              placeholder="Search routes or stops" 
              className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-body-md font-body-md placeholder-outline transition-colors" 
            />
          </div>
          <Link href="/profile" aria-label="Open profile" className="w-10 h-10 rounded-full bg-primary-fixed border border-outline-variant flex items-center justify-center text-primary">
            <UserRound className="w-5 h-5" aria-hidden="true" />
          </Link>
        </div>
      </header>
    </>
  );
}
