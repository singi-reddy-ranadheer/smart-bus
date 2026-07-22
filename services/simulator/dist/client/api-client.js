"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiClient = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
class ApiClient {
    constructor(baseUrl = config_1.CONFIG.apiUrl) {
        this.client = axios_1.default.create({
            baseURL: baseUrl,
            headers: { 'Content-Type': 'application/json' },
            timeout: 5000,
        });
    }
    async createTrip(busId, routeId) {
        try {
            const response = await this.client.post('/trips', {
                bus_id: busId,
                route_id: routeId,
            });
            return response.data?.data?.id || null;
        }
        catch (err) {
            console.error(`[API] Failed to create trip for bus ${busId}: ${err.message}`);
            return null;
        }
    }
    async recordTripEvent(event) {
        try {
            await this.client.post('/trip-events', event);
            return true;
        }
        catch (err) {
            console.error(`[API] Failed to record event: ${err.message}`);
            return false;
        }
    }
}
exports.ApiClient = ApiClient;
