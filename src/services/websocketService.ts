type MessageListener = (data: any) => void

export class WebSocketService {
  private socket: WebSocket | null = null
  private listeners: Set<MessageListener> = new Set()
  private reconnectInterval = 5000
  private url: string

  constructor(url: string) {
    this.url = url
    this.connect()
  }

  private connect(): void {
    this.socket = new WebSocket(this.url)

    this.socket.onopen = () => {
      console.log('[WebSocket] Connected')
    }

    this.socket.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data)
        this.listeners.forEach(cb => cb(data))
      } catch (err) {
        console.error('[WebSocket] Failed to parse message:', err)
      }
    }

    this.socket.onclose = () => {
      console.warn('[WebSocket] Disconnected. Reconnecting...')
      setTimeout(() => this.connect(), this.reconnectInterval)
    }

    this.socket.onerror = err => {
      console.error('[WebSocket] Error:', err)
      this.socket?.close()
    }
  }

  public send(data: any): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data))
    } else {
      console.warn('[WebSocket] Not ready to send:', data)
    }
  }

  public addListener(callback: MessageListener): void {
    this.listeners.add(callback)
  }

  public removeListener(callback: MessageListener): void {
    this.listeners.delete(callback)
  }

  public close(): void {
    this.socket?.close()
  }
}
