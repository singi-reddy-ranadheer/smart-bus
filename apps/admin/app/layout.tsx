import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { Bus, Route, MapPin, LayoutDashboard } from 'lucide-react';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: 'Smart Bus AI — Admin',
  description: 'Fleet management dashboard for Smart Bus AI',
};

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/buses', label: 'Buses', icon: Bus },
  { href: '/routes', label: 'Routes', icon: Route },
  { href: '/trips', label: 'Trips', icon: MapPin },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen bg-background">
          {/* Sidebar */}
          <aside className="w-64 bg-surface border-r border-outline flex flex-col">
            <div className="p-6 border-b border-outline">
              <h1 className="font-bold text-lg text-primary">🚍 Smart Bus</h1>
              <p className="text-xs text-on-surface-muted">Admin Dashboard</p>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-on-surface hover:bg-surface-subtle transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-outline text-xs text-on-surface-muted">
              v0.1.0 — Simulation
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 overflow-auto p-8">{children}</main>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
