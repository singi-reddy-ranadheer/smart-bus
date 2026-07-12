import WebSocket from 'ws';
import { CONFIG } from '../config';

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private connected: boolean = false;

  constructor(url: string = CONFIG.wsUrl) {
    this.url = url;
  }

  connect(): void {
    this.ws = new WebSocket(this.url);

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

  sendGpsUpdate(payload: {
    trip_id: string;
    lat: number;
    lng: number;
    speed: number;
    heading: number;
  }): void {
    if (!this.connected || !this.ws) return;
    this.ws.send(
      JSON.stringify({
        event: 'gps:update',
        data: payload,
      }),
    );
  }

  disconnect(): void {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.ws) this.ws.close();
  }
}