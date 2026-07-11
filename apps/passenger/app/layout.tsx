import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import 'leaflet/dist/leaflet.css';
import './globals.css';
import { AppHeader } from '@/components/AppHeader';
import { BottomNavigation } from '@/components/BottomNavigation';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Smart Bus AI',
  description: 'Smart Bus AI Passenger App Prototype',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable}`}>
      <body suppressHydrationWarning className="bg-background text-on-background min-h-screen antialiased flex flex-col font-body-md">
        <AppHeader />
        {children}
        <BottomNavigation />
      </body>
    </html>
  );
}

