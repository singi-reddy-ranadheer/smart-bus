"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketClient = void 0;
const ws_1 = __importDefault(require("ws"));
const config_1 = require("../config");
class WebSocketClient {
    constructor(url = config_1.CONFIG.wsUrl) {
        this.ws = null;
        this.reconnectTimer = null;
        this.connected = false;
        this.url = url;
    }
    connect() {
        this.ws = new ws_1.default(this.url);
        this.ws.on('open', () => {
            this.connected = true;
            console.log('[WS] Connected to tracking gateway');
        });
        this.ws.on('close', () => {
            this.connected = false;
            console.log('[WS] Disconnected. Reconnecting in 3s...');
            this.reconnectTimer = setTimeout(() => this.connect(), 3000);
        });
        this.ws.on('error', (err) => {
            console.error(`[WS] Error: ${err.message}`);
        });
    }
    sendGpsUpdate(payload) {
        if (!this.connected || !this.ws)
            return;
        this.ws.send(JSON.stringify({
            event: 'gps:update',
            data: payload,
        }));
    }
    disconnect() {
        if (this.reconnectTimer)
            clearTimeout(this.reconnectTimer);
        if (this.ws)
            this.ws.close();
    }
}
exports.WebSocketClient = WebSocketClient;
