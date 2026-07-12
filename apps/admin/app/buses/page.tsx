'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { adminApi, type ApiBus } from '@/lib/api';
import { LoadingSpinner } from '@smart-bus/ui';

export default function BusesPage() {
  const [buses, setBuses] = useState<ApiBus[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ plate_number: '', bus_number: '', capacity: 50, model: '', color: '#3B82F6' });

  useEffect(() => {
    adminApi.getBuses()
      .then(setBuses)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newBus = await adminApi.createBus(form);
      setBuses((s) => [...s, newBus]);
      setShowForm(false);
      setForm({ plate_number: '', bus_number: '', capacity: 50, model: '', color: '#3B82F6' });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><LoadingSpinner size={32} /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-on-surface">Fleet Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
        >
          <Plus className="w-4 h-4" /> Add Bus
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-surface rounded-xl border border-outline p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">New Bus</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <input
              required
              placeholder="Plate Number"
              className="px-3 py-2 border border-outline rounded-lg"
              value={form.plate_number}
              onChange={(e) => setForm({ ...form, plate_number: e.target.value })}
            />
            <input
              required
              placeholder="Bus Number"
              className="px-3 py-2 border border-outline rounded-lg"
              value={form.bus_number}
              onChange={(e) => setForm({ ...form, bus_number: e.target.value })}
            />
            <input
              required
              type="number"
              placeholder="Capacity"
              className="px-3 py-2 border border-outline rounded-lg"
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) || 0 })}
            />
            <input
              placeholder="Model"
              className="px-3 py-2 border border-outline rounded-lg"
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
            />
            <input
              type="color"
              className="h-10 cursor-pointer"
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg">Save</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-surface-subtle rounded-lg">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-surface rounded-xl border border-outline shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-subtle">
            <tr>
              <th className="text-left p-4">Bus</th>
              <th className="text-left p-4">Plate</th>
              <th className="text-left p-4">Capacity</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Route</th>
              <th className="text-left p-4">Speed</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {buses.map((bus) => (
              <tr key={bus.id} className="border-t border-outline">
                <td className="p-4 font-medium">{bus.bus_number}</td>
                <td className="p-4">{bus.plate_number}</td>
                <td className="p-4">{bus.capacity}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${bus.status === 'active' ? 'bg-success/10 text-success' : 'bg-outline text-on-surface-muted'}`}>
                    {bus.status}
                  </span>
                </td>
                <td className="p-4">{bus.current_route?.name || '—'}</td>
                <td className="p-4">{bus.current_speed} km/h</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button className="p-1 hover:text-primary"><Edit className="w-4 h-4" /></button>
                    <button className="p-1 hover:text-error"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {buses.length === 0 && (
          <div className="p-8 text-center text-on-surface-muted">No buses found. Add one above.</div>
        )}
      </div>
    </div>
  );
}