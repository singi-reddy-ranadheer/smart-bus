import * as dotenv from 'dotenv';
import { SimulatorConfig } from './types';

dotenv.config();

export const CONFIG: SimulatorConfig = {
  apiUrl: process.env.API_URL || 'http://localhost:4000/api/v1',
  wsUrl: process.env.WS_URL || 'ws://localhost:4000/ws',
  tickIntervalMs: 2000,
};

export const SEED_UUIDS = {
  campusRoute: 'a1b2c3d4-0001-4000-8000-000000000001',
  cityRoute: 'a1b2c3d4-0002-4000-8000-000000000002',
  bus001: 'c1d2e3f4-0001-4000-8000-000000000001',
  bus002: 'c1d2e3f4-0002-4000-8000-000000000002',
  bus003: 'c1d2e3f4-0003-4000-8000-000000000003',
};