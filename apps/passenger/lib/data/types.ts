export type User = {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: string;
  avatar_url?: string;
  created_at: string;
};

export type Stop = {
  id: string;
  name: string;
  order: number;
  lat: number;
  lng: number;
};

export type Route = {
  id: string;
  name: string;
  color: string;
  total_distance: number;
  estimated_duration: number;
  status: 'active' | 'inactive';
  stops: Stop[];
};

export type Bus = {
  id: string;
  plate_number: string;
  bus_number: string;
  capacity: number;
  model: string;
  color: string;
  status: 'active' | 'inactive' | 'maintenance';
  current_location?: { lat: number; lng: number };
  current_speed?: number;
  heading?: number;
  current_route_id?: string;
  current_route?: { id: string; name: string };
};

export type LiveLocationUpdate = {
  bus_id: string;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  ts: number;
};

