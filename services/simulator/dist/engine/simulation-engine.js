"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimulationEngine = void 0;
class SimulationEngine {
    constructor(busManager, onTick, tickIntervalMs = 2000, maxIterations = 1000) {
        this.interval = null;
        this.iterations = 0;
        this.busManager = busManager;
        this.onTick = onTick;
        this.tickIntervalMs = tickIntervalMs;
        this.maxIterations = maxIterations;
    }
    start() {
        if (this.interval)
            return;
        this.interval = setInterval(() => this.tick(), this.tickIntervalMs);
        console.log(`[SIM] Engine started. Tick every ${this.tickIntervalMs}ms`);
    }
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
            console.log('[SIM] Engine stopped.');
        }
    }
    tick() {
        this.iterations++;
        const buses = this.busManager.tick();
        this.onTick(buses);
        if (this.iterations >= this.maxIterations) {
            console.log(`[SIM] Reached max iterations (${this.maxIterations}). Stopping.`);
            this.stop();
        }
    }
    isRunning() {
        return this.interval !== null;
    }
}
exports.SimulationEngine = SimulationEngine;
