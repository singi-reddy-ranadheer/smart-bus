import { BusState } from '../types';
import { BusManager } from './bus-manager';

export type TickCallback = (buses: BusState[]) => void;

export class SimulationEngine {
  private busManager: BusManager;
  private interval: NodeJS.Timeout | null = null;
  private tickIntervalMs: number;
  private onTick: TickCallback;
  private iterations: number = 0;
  private maxIterations: number;

  constructor(
    busManager: BusManager,
    onTick: TickCallback,
    tickIntervalMs: number = 2000,
    maxIterations: number = 1000,
  ) {
    this.busManager = busManager;
    this.onTick = onTick;
    this.tickIntervalMs = tickIntervalMs;
    this.maxIterations = maxIterations;
  }

  start(): void {
    if (this.interval) return;
    this.interval = setInterval(() => this.tick(), this.tickIntervalMs);
    console.log(`[SIM] Engine started. Tick every ${this.tickIntervalMs}ms`);
  }

  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      console.log('[SIM] Engine stopped.');
    }
  }

  private tick(): void {
    this.iterations++;
    const buses = this.busManager.tick();
    this.onTick(buses);

    if (this.iterations >= this.maxIterations) {
      console.log(`[SIM] Reached max iterations (${this.maxIterations}). Stopping.`);
      this.stop();
    }
  }

  isRunning(): boolean {
    return this.interval !== null;
  }
}