'use client';

import { User, Bus, Shield, Phone } from 'lucide-react';

export default function ProfilePage() {
  const driver = {
    name: 'Rahul Sharma',
    license: 'DL-2024-00123456',
    phone: '+91 98765 43210',
    bus: 'BUS-001 (KA-01-AB-1234)',
    route: 'Campus Express',
  };

  return (
    <div className="max-w-lg mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-on-surface">Driver Profile</h1>

      <div className="bg-surface rounded-xl border border-outline p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold">
            {driver.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h2 className="font-semibold text-lg">{driver.name}</h2>
            <p className="text-sm text-on-surface-muted">Driver ID: DRV-001</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Shield className="w-4 h-4 text-accent" />
            <span className="text-on-surface-muted">License:</span>
            <span className="font-mono text-xs">{driver.license}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-primary" />
            <span className="text-on-surface-muted">Phone:</span>
            <span>{driver.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Bus className="w-4 h-4 text-success" />
            <span className="text-on-surface-muted">Assigned Bus:</span>
            <span>{driver.bus}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-secondary" />
            <span className="text-on-surface-muted">Route:</span>
            <span>{driver.route}</span>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-outline p-6 shadow-sm">
        <h3 className="font-semibold mb-2">Performance This Week</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-2xl font-bold text-primary">12</div>
            <div className="text-on-surface-muted">Trips</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-success">98%</div>
            <div className="text-on-surface-muted">On-time</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-accent">4.8</div>
            <div className="text-on-surface-muted">Rating</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-secondary">320</div>
            <div className="text-on-surface-muted">km Today</div>
          </div>
        </div>
      </div>
    </div>
  );
}