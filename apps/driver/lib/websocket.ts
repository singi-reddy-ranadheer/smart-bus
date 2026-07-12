const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4000/ws';

type MessageHandler = (data: any) => void;

export class DriverWebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private handlers = new Map<string, MessageHandler[]>();
  private stopped = false;

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    try {
      this.ws = new WebSocket(WS_URL);

      this.ws.onopen = () => {
        console.log('[WS] Connected to gateway');
      };

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          const handlers = this.handlers.get(msg.event) || [];
          handlers.forEach((fn) => fn(msg.data));
        } catch {
          // ignore parse errors
        }
      };

      this.ws.onclose = () => {
        if (!this.stopped) {
          this.reconnectTimer = setTimeout(() => this.connect(), 3000);
        }
      };

      this.ws.onerror = (err) => {
        console.error('[WS] Error', err);
        if (this.ws) this.ws.close();
      };
    } catch {
      if (!this.stopped) {
        this.reconnectTimer = setTimeout(() => this.connect(), 3000);
      }
    }
  }

  on(event: string, handler: MessageHandler): () => void {
    const existing = this.handlers.get(event) || [];
    this.handlers.set(event, [...existing, handler]);
    return () => {
      const list = this.handlers.get(event) || [];
      this.handlers.set(event, list.filter((fn) => fn !== handler));
    };
  }

  send(event: string, data: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ event, data }));
    }
  }

  disconnect(): void {
    this.stopped = true;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.ws) this.ws.close();
  }
}

export const wsClient = new DriverWebSocketClient();