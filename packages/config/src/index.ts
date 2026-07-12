// Smart Bus AI — Shared Configuration Package
// Centralized configuration for all services

export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
    version: 'v1',
    basePath: '/api/v1',
    wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4000/ws',
  },
  ai: {
    baseUrl: process.env.NEXT_PUBLIC_AI_API_URL || 'http://localhost:8000',
    basePath: '/api/v1',
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  },
  app: {
    name: 'Smart Bus AI',
    version: '0.1.0',
    environment: process.env.NODE_ENV || 'development',
  },
  map: {
    defaultCenter: { lat: 12.9716, lng: 77.5946 }, // Bangalore
    defaultZoom: 13,
    maxZoom: 18,
    minZoom: 4,
  },
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },
  realtime: {
    gpsUpdateIntervalMs: 2000,
    busLocationChannel: 'bus:*:location',
    tripEventsChannel: 'trip:*:events',
  },
} as const;

export type Config = typeof config;