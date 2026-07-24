'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/data/types';
import { dataProvider } from '@/lib/data';
import { Edit2, UserCog, HelpCircle, Shield, LogOut, ChevronRight } from 'lucide-react';
import { LoadingSpinner } from '@smart-bus/ui';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    dataProvider.getCurrentUser().then(u => {
        if (!u) {
            router.push('/login');
        } else {
            setUser(u);
        }
    });
  }, [router]);

  const handleSignOut = async () => {
    await dataProvider.signOut();
    router.push('/login');
  };

  if (!user) return <div className="flex items-center justify-center min-h-screen"><LoadingSpinner size={32} /></div>;

  return (
    <main className="flex-grow pt-[calc(56px+env(safe-area-inset-top))] pb-[calc(72px+env(safe-area-inset-bottom))] px-page-padding-mobile md:px-page-padding-desktop max-w-max-width-desktop mx-auto w-full">
      {/* Profile Header Section */}
      <section className="mt-8 mb-10 flex flex-col items-center justify-center text-center">
        <div className="relative w-24 h-24 mb-4">
          <img 
            className="w-full h-full object-cover rounded-full shadow-[0_8px_24px_rgba(16,42,67,0.14)] border-2 border-surface" 
            src={user.avatar_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuD-jAiaTWUy-1myGr58EeHYhy5nHKDGGG2LXVZuzk-o6d2bXj6ZWeZ0fqNlOPRAmElrEdkK_FdkaCWzzj1lwjPy3S1l9wgsvRfx7NC5CSPvzbSzfqQRm-_5E-saRBPqtejcjQZrFkhnzL6IYkU9zSqrcsVLz3OKbrga1rp1tPRwVJGxmhtnasj7M1hd0vRetO-jCIiwfUCmPKbn9SPWjLZRQRMyLJjT2-QmRRuDdefjVSa2NSeu-MMEOw"}
            alt="Profile"
          />
          <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform">
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
        <h2 className="font-headline-md text-headline-md text-on-background">{user.name}</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">{user.email}</p>
        <div className="mt-3 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-caps text-label-caps capitalize">
          {user.role}
        </div>
      </section>

      {/* List Sections */}
      <section className="max-w-md mx-auto w-full space-y-4">
        {/* Settings Card */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
          <button className="w-full flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors active:bg-surface-container-high">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary">
                <UserCog className="w-6 h-6" />
              </div>
              <span className="font-label-data text-label-data text-on-surface">Account Settings</span>
            </div>
            <ChevronRight className="w-6 h-6 text-outline" />
          </button>
          <div className="h-[1px] bg-outline-variant w-full"></div>
          
          <button className="w-full flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors active:bg-surface-container-high">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary">
                <HelpCircle className="w-6 h-6" />
              </div>
              <span className="font-label-data text-label-data text-on-surface">Help &amp; Support</span>
            </div>
            <ChevronRight className="w-6 h-6 text-outline" />
          </button>
          <div className="h-[1px] bg-outline-variant w-full"></div>
          
          <button className="w-full flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors active:bg-surface-container-high">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary">
                <Shield className="w-6 h-6" />
              </div>
              <span className="font-label-data text-label-data text-on-surface">Privacy Policy</span>
            </div>
            <ChevronRight className="w-6 h-6 text-outline" />
          </button>
        </div>

        {/* Sign Out Action */}
        <div className="pt-6 flex justify-center">
          <button 
            onClick={handleSignOut}
            className="px-6 py-3 rounded-xl bg-surface-container text-error font-label-data text-label-data flex items-center gap-2 hover:bg-surface-container-highest transition-colors active:scale-95"
          >
            <LogOut className="w-5 h-5" />
            Sign out
          </button>
        </div>
      </section>
    </main>
  );
}

