const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4000/ws';

export interface LiveLocationUpdate {
  bus_id: string;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  timestamp: string;
}

type LocationCallback = (update: LiveLocationUpdate) => void;

export function subscribeToBusLocations(callback: LocationCallback): () => void {
  let ws: WebSocket | null = null;
  let reconnectTimer: NodeJS.Timeout | null = null;
  let stopped = false;

  const connect = () => {
    if (stopped) return;

    try {
      ws = new WebSocket(WS_URL);

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.event === 'bus:location' || message.event === 'bus:location') {
            const update: LiveLocationUpdate = {
              bus_id: message.data.bus_id,
              lat: message.data.lat,
              lng: message.data.lng,
              speed: message.data.speed,
              heading: message.data.heading,
              timestamp: message.data.ts || new Date().toISOString(),
            };
            callback(update);
          }
        } catch {
          // ignore invalid messages
        }
      };

      ws.onclose = () => {
        if (!stopped) {
          reconnectTimer = setTimeout(connect, 3000);
        }
      };

      ws.onerror = () => {
        if (ws) ws.close();
      };
    } catch {
      if (!stopped) {
        reconnectTimer = setTimeout(connect, 3000);
      }
    }
  };

  connect();

  return () => {
    stopped = true;
    if (reconnectTimer) clearTimeout(reconnectTimer);
    if (ws) ws.close();
  };
}

export const apiClient = {
  async getBuses() {
    const res = await fetch(`${API_BASE_URL}/buses?limit=100`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch buses');
    const json = await res.json();
    return json.data;
  },
  async getRoutes() {
    const res = await fetch(`${API_BASE_URL}/routes?limit=100`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch routes');
    const json = await res.json();
    return json.data;
  },
  async getStops() {
    const res = await fetch(`${API_BASE_URL}/stops?limit=1000`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch stops');
    const json = await res.json();
    return json.data;
  },
};