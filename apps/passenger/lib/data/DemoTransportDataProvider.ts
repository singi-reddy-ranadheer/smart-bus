import { TransportDataProvider } from './TransportDataProvider';
import { User, Bus, Route, Stop, LiveLocationUpdate } from './types';

// DEMO ONLY DATA
const DEMO_USER: User = {
  id: 'usr_demo_1',
  email: 'alex.johnson@example.com',
  name: 'Alex Johnson',
  phone: '555-0100',
  role: 'passenger',
  avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_Xw8Xga4G3MylYT_-zczU1fV2p4k8UPABXL9G8Uq0xw98nKvIZ_jO00NdxGN5kO1xjBNJUfIebAdLcKMIyu7pZ0yahLNIainogxsDkMugKwFW22r1YwN03jDE52IQLqg9dUtdNdJC84EJ9sI67WU0yV-c9ib1ybZEPI-hgMxT6gTz7bEy6OmZNNEt_2Abh6CbnbI_wR9GQ3F2UrjLUCfJE8Jn7dOp-ovFVXmS8P1Ur-bRKIg_bTdRNA',
  created_at: new Date().toISOString(),
};

const DEMO_STOPS_CAMPUS: Stop[] = [
  { id: 'stop_1', name: 'Campus Gate', order: 1, lat: 52.6613, lng: -8.5721 },
  { id: 'stop_2', name: 'Library', order: 2, lat: 52.6681, lng: -8.5750 },
  { id: 'stop_3', name: 'Bus Stand', order: 3, lat: 52.6645, lng: -8.6010 },
  { id: 'stop_4', name: 'Railway Station', order: 4, lat: 52.6582, lng: -8.6231 },
  { id: 'stop_5', name: 'Airport', order: 5, lat: 52.6997, lng: -8.9248 },
];

const DEMO_STOPS_CITY: Stop[] = [
  { id: 'stop_6', name: 'City Center', order: 1, lat: 52.6641, lng: -8.6253 },
  { id: 'stop_7', name: 'Market', order: 2, lat: 52.6620, lng: -8.6210 },
  { id: 'stop_8', name: 'Hospital', order: 3, lat: 52.6482, lng: -8.6360 },
  { id: 'stop_9', name: 'University', order: 4, lat: 52.6734, lng: -8.5744 },
  { id: 'stop_10', name: 'Tech Park', order: 5, lat: 52.6610, lng: -8.5420 },
  { id: 'stop_11', name: 'City Center', order: 6, lat: 52.6641, lng: -8.6253 },
];

const DEMO_ROUTES: Route[] = [
  {
    id: 'route_campus',
    name: 'Campus Express',
    color: '#3b82f6', // Primary
    total_distance: 12.5,
    estimated_duration: 35,
    status: 'active',
    stops: DEMO_STOPS_CAMPUS,
  },
  {
    id: 'route_city',
    name: 'City Loop',
    color: '#10b981', // Tertiary
    total_distance: 8.5,
    estimated_duration: 45,
    status: 'active',
    stops: DEMO_STOPS_CITY,
  },
];

const DEMO_BUSES: Bus[] = [
  {
    id: 'BUS-001',
    plate_number: 'AB 123 CD',
    bus_number: '001',
    capacity: 40,
    model: 'Volvo B11R',
    color: '#3b82f6',
    status: 'active',
    current_location: { lat: 52.6645, lng: -8.6010 },
    current_speed: 35,
    heading: 45,
    current_route_id: 'route_campus',
    current_route: { id: 'route_campus', name: 'Campus Express' },
  },
  {
    id: 'BUS-002',
    plate_number: 'EF 456 GH',
    bus_number: '002',
    capacity: 40,
    model: 'Volvo B11R',
    color: '#3b82f6',
    status: 'active',
    current_location: { lat: 52.6613, lng: -8.5721 },
    current_speed: 40,
    heading: 90,
    current_route_id: 'route_campus',
    current_route: { id: 'route_campus', name: 'Campus Express' },
  },
  {
    id: 'BUS-003',
    plate_number: 'IJ 789 KL',
    bus_number: '003',
    capacity: 35,
    model: 'Scania K250',
    color: '#10b981',
    status: 'active',
    current_location: { lat: 52.6641, lng: -8.6253 },
    current_speed: 25,
    heading: 180,
    current_route_id: 'route_city',
    current_route: { id: 'route_city', name: 'City Loop' },
  },
];

export class DemoTransportDataProvider implements TransportDataProvider {
  private user: User | null = null;
  private intervalId: NodeJS.Timeout | null = null;

  async signIn(email: string, password: string): Promise<User> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    this.user = DEMO_USER;
    if (typeof window !== 'undefined') {
        localStorage.setItem('demo_user', JSON.stringify(this.user));
    }
    return DEMO_USER;
  }

  async register(email: string, password: string, name: string, phone?: string): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    this.user = { ...DEMO_USER, email, name, phone };
    if (typeof window !== 'undefined') {
        localStorage.setItem('demo_user', JSON.stringify(this.user));
    }
    return this.user;
  }

  async getCurrentUser(): Promise<User | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('demo_user');
        if (stored) {
            this.user = JSON.parse(stored);
        }
    }
    return this.user;
  }

  async signOut(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    this.user = null;
    if (typeof window !== 'undefined') {
        localStorage.removeItem('demo_user');
    }
  }

  async getBuses(): Promise<Bus[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return DEMO_BUSES;
  }

  async getRoutes(): Promise<Route[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return DEMO_ROUTES;
  }

  async getRouteById(id: string): Promise<Route | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return DEMO_ROUTES.find((r) => r.id === id) || null;
  }

  subscribeToBusLocations(callback: (update: LiveLocationUpdate) => void): () => void {
    // Simulate real-time movement (demo only deterministic local movement)
    let step = 0;
    this.intervalId = setInterval(() => {
      DEMO_BUSES.forEach((bus) => {
        if (!bus.current_location) return;
        // Just wiggle the bus a tiny bit for demo purposes
        const dLat = (Math.sin(step + bus.current_location.lat) * 0.0001);
        const dLng = (Math.cos(step + bus.current_location.lng) * 0.0001);
        bus.current_location.lat += dLat;
        bus.current_location.lng += dLng;
        bus.heading = (bus.heading! + 5) % 360;
        
        callback({
          bus_id: bus.id,
          lat: bus.current_location.lat,
          lng: bus.current_location.lng,
          speed: bus.current_speed || 0,
          heading: bus.heading,
          ts: Date.now(),
        });
      });
      step += 0.5;
    }, 2000);

    return () => {
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
    };
  }
}

