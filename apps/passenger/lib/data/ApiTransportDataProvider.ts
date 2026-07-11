import { TransportDataProvider } from './TransportDataProvider';
import { User, Bus, Route, LiveLocationUpdate } from './types';

// API STUB: Do not make actual external unauthenticated calls in this prototype.
export class ApiTransportDataProvider implements TransportDataProvider {
  async signIn(email: string, password: string): Promise<User> {
    throw new Error('Not implemented for v0.1 prototype');
  }

  async register(email: string, password: string, name: string, phone?: string): Promise<User> {
    throw new Error('Not implemented for v0.1 prototype');
  }

  async getCurrentUser(): Promise<User | null> {
    throw new Error('Not implemented for v0.1 prototype');
  }

  async signOut(): Promise<void> {
      throw new Error('Not implemented for v0.1 prototype');
  }

  async getBuses(): Promise<Bus[]> {
    throw new Error('Not implemented for v0.1 prototype');
  }

  async getRoutes(): Promise<Route[]> {
    throw new Error('Not implemented for v0.1 prototype');
  }

  async getRouteById(id: string): Promise<Route | null> {
    throw new Error('Not implemented for v0.1 prototype');
  }

  subscribeToBusLocations(callback: (update: LiveLocationUpdate) => void): () => void {
    throw new Error('Not implemented for v0.1 prototype');
  }
}

