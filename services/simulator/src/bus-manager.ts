import { SupabaseClient } from '@supabase/supabase-js';
import { Engine } from './engine';
import { CampusRoute } from './routes/campus-route';
import { CityRoute } from './routes/city-route';

export interface BusConfig {
  registrationNumber: string;
  route: CampusRoute | CityRoute;
}

export class BusManager {
  private supabase: SupabaseClient;
  private engines: Map<string, Engine> = new Map();
  private intervalId?: NodeJS.Timeout;

  constructor() {
    this.supabase = require('@supabase/supabase-js').createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );
  }

  async start() {
    console.log('🚌 Starting Bus Manager...');
    
    const buses = await this.fetchBuses();
    console.log(`Found ${buses.length} buses`);

    for (const bus of buses) {
      const route = bus.current_route_id === 'campus-express' 
        ? new CampusRoute() 
        : new CityRoute();
      
      const engine = new Engine(bus, route, this.supabase);
      this.engines.set(bus.id, engine);
      engine.start();
    }

    this.intervalId = setInterval(() => {
      this.engines.forEach((engine) => engine.tick());
    }, 2000);

    console.log(`✅ Simulating ${this.engines.size} buses`);
  }

  async stop() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.engines.forEach((engine) => engine.stop());
    console.log('🛑 Bus Manager stopped');
  }

  private async fetchBuses() {
    const { data, error } = await this.supabase
      .from('buses')
      .select('id, registration_number, current_route_id, current_latitude, current_longitude');
    
    if (error) throw error;
    return data || [];
  }
}