import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface LiveLocationUpdate {
  bus_id: string;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  timestamp: string;
}

type LocationCallback = (update: LiveLocationUpdate) => void;

let supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (!supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
    }
    supabase = createClient(url, key);
  }
  return supabase;
}

export function subscribeToBusLocations(callback: LocationCallback): () => void {
  const client = getSupabase();

  const channel = client
    .channel('buses-realtime')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'buses',
      },
      (payload) => {
        const row = payload.new;
        const update: LiveLocationUpdate = {
          bus_id: row.id,
          lat: row.current_latitude,
          lng: row.current_longitude,
          speed: row.current_speed ?? 0,
          heading: 0,
          timestamp: row.last_gps_update || new Date().toISOString(),
        };
        callback(update);
      }
    )
    .subscribe();

  return () => {
    client.removeChannel(channel);
  };
}