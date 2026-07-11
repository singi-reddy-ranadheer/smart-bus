'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, Bus, User } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function BottomNavigation() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Map', href: '/', icon: Map },
    { label: 'Routes', href: '/routes', icon: Bus },
    { label: 'Profile', href: '/profile', icon: User },
  ];

  // Do not render bottom nav on login/register
  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 flex justify-around items-center px-4 py-2 pb-safe bg-surface dark:bg-background shadow-[0_-8px_24px_rgba(16,42,67,0.14)] rounded-t-xl border-t border-outline-variant/30">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={twMerge(
              'flex flex-col items-center justify-center px-5 py-1 transition-transform duration-200',
              isActive
                ? 'bg-secondary-container dark:bg-secondary text-on-secondary-container dark:text-on-secondary rounded-full active:scale-90'
                : 'text-on-surface-variant dark:text-on-surface-variant hover:text-primary dark:hover:text-primary-fixed'
            )}
          >
            <Icon className="w-6 h-6 mb-1" fill={isActive ? 'currentColor' : 'none'} />
            <span className="font-label-caps text-label-caps">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

