import { io, Socket } from 'socket.io-client';

export interface AuctionUpdate {
  type: 'auction_started' | 'auction_ended' | 'bid_placed' | 'auction_status_changed';
  auction: any;
  data?: any;
}

export interface BidUpdate {
  auctionId: string;
  newBid: number;
  bidder: string;
  totalBidders: number;
  timeLeft?: number;
}

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    this.connect();
  }

  private connect() {
    const wsUrl = (import.meta as any).env.VITE_WS_URL || 'wss://auction-app-backend-production.up.railway.app';
    
    console.log('🔌 Connecting to WebSocket:', wsUrl);
    
    this.socket = io(wsUrl, {
      transports: ['websocket', 'polling'],
      upgrade: true,
      rememberUpgrade: true,
      timeout: 20000,
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
      auth: {
        token: 'guest' // Temporary guest token to bypass authentication
      }
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected:', this.socket?.id);
      this.reconnectAttempts = 0;
      this.emit('connected', { socketId: this.socket?.id });
    });

    this.socket.on('disconnect', (reason: any) => {
      console.log('❌ WebSocket disconnected:', reason);
      this.emit('disconnected', { reason });
    });

    this.socket.on('connect_error', (error: any) => {
      console.error('🔥 WebSocket connection error:', error);
      this.handleReconnect();
    });

    // Auction-specific events
    this.socket.on('auction_started', (data: any) => {
      console.log('🚀 Auction started:', data);
      this.emit('auction_started', data);
    });

    this.socket.on('auction_ended', (data: any) => {
      console.log('🏁 Auction ended:', data);
      this.emit('auction_ended', data);
    });

    this.socket.on('bid_placed', (data: BidUpdate) => {
      console.log('💰 New bid placed:', data);
      this.emit('bid_placed', data);
    });

    this.socket.on('auction_status_changed', (data: any) => {
      console.log('🔄 Auction status changed:', data);
      this.emit('auction_status_changed', data);
    });

    this.socket.on('auction_time_update', (data: any) => {
      console.log('⏰ Auction time update:', data);
      this.emit('auction_time_update', data);
    });

    // Real-time auction list updates
    this.socket.on('auctions_updated', (data: any) => {
      console.log('📋 Auctions list updated:', data);
      this.emit('auctions_updated', data);
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('❌ Max reconnection attempts reached');
      this.emit('max_reconnect_attempts_reached', {});
    }
  }

  // Subscribe to events
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  // Unsubscribe from events
  off(event: string, callback?: Function) {
    if (!callback) {
      this.listeners.delete(event);
      return;
    }
    
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  // Emit events to listeners
  private emit(event: string, data: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data));
    }
  }

  // Join auction room for real-time updates
  joinAuctionRoom(auctionId: string) {
    if (this.socket?.connected) {
      console.log('🏠 Joining auction room:', auctionId);
      this.socket.emit('join_auction', { auctionId });
    }
  }

  // Leave auction room
  leaveAuctionRoom(auctionId: string) {
    if (this.socket?.connected) {
      console.log('🚪 Leaving auction room:', auctionId);
      this.socket.emit('leave_auction', { auctionId });
    }
  }

  // Place bid via WebSocket
  placeBid(auctionId: string, bidAmount: number) {
    if (this.socket?.connected) {
      console.log('💰 Placing bid via WebSocket:', { auctionId, bidAmount });
      this.socket.emit('place_bid', { auctionId, bidAmount });
    }
  }

  // Get connection status
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Disconnect
  disconnect() {
    if (this.socket) {
      console.log('🔌 Disconnecting WebSocket...');
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Reconnect manually
  reconnect() {
    this.disconnect();
    this.reconnectAttempts = 0;
    this.connect();
  }
}

// Create singleton instance
export const webSocketService = new WebSocketService();
export default webSocketService;
