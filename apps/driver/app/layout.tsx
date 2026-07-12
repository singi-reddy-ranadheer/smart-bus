import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { Home, Map, User } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Smart Bus AI — Driver',
  description: 'Driver app for Smart Bus AI fleet',
};

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/trip', label: 'Trip', icon: Map },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col h-screen bg-background">
          <main className="flex-1 overflow-auto">{children}</main>
          <nav className="bg-surface border-t border-outline flex justify-around py-2 pb-[calc(16px+env(safe-area-inset-bottom))]">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center gap-1 px-3 py-1 text-on-surface-muted hover:text-primary"
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-xs">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </body>
    </html>
  );
}