import { User, Bus, Route, LiveLocationUpdate } from './types';

export interface TransportDataProvider {
  signIn(email: string, password: string): Promise<User>;
  register(email: string, password: string, name: string, phone?: string): Promise<User>;
  getCurrentUser(): Promise<User | null>;
  signOut(): Promise<void>;
  
  getBuses(): Promise<Bus[]>;
  getRoutes(): Promise<Route[]>;
  getRouteById(id: string): Promise<Route | null>;
  
  subscribeToBusLocations(callback: (update: LiveLocationUpdate) => void): () => void;
}

