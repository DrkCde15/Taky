import { baseURL } from "../utils/api";

const wsBase = baseURL.replace(/^http/, "ws");

class WebSocketClient {
  private ws: WebSocket | null = null;
  private projectId: number | null = null;
  private url: string = "";
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private listeners: Record<string, Function[]> = {};

  connect(projectId: number) {
    if (this.ws && this.projectId === projectId) return;
    this.disconnect();
    
    this.projectId = projectId;
    this.url = `${wsBase}/ws/projects/${projectId}`;
    this.setupConnection();
  }

  private setupConnection() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log(`Connected to WS for project ${this.projectId}`);
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event && this.listeners[data.event]) {
          this.listeners[data.event].forEach(cb => cb(data.data));
        }
      } catch (e) {
        console.error("Failed to parse WS message", e);
      }
    };

    this.ws.onclose = () => {
      console.log("WS closed");
      this.attemptReconnect();
    };

    this.ws.onerror = (error) => {
      console.error("WS Error", error);
      this.ws?.close();
    };
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts})`);
        this.setupConnection();
      }, 2000 * this.reconnectAttempts);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.projectId = null;
  }

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: Function) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }
}

export const wsClient = new WebSocketClient();
