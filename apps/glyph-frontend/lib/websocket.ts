import { CanvasElement } from './canvas-types';

export type WebSocketMessageType = 
  | 'join_room'
  | 'join_room_success'
  | 'leave_room'
  | 'leave_room_success'
  | 'shape_create'
  | 'shape_update'
  | 'shape_delete'
  | 'clear_all_shapes'
  | 'load_shapes'
  | 'shapes_loaded'
  | 'error';

export interface WebSocketMessage {
  type: WebSocketMessageType;
  roomId?: string;
  shape?: CanvasElement;
  shapes?: CanvasElement[];
  shapeId?: string;
  senderId?: string;
  timestamp?: string;
  message?: string;
}

export class CanvasWebSocket {
  private ws: WebSocket | null = null;
  private roomId: string | null = null;
  private token: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private messageQueue: WebSocketMessage[] = [];
  private isConnected = false;

  // Event listeners
  private onShapeCreateListener?: (shape: CanvasElement, senderId: string) => void;
  private onShapeUpdateListener?: (shape: CanvasElement, senderId: string) => void;
  private onShapeDeleteListener?: (shapeId: string, senderId: string) => void;
  private onClearAllShapesListener?: (senderId: string) => void;
  private onShapesLoadedListener?: (shapes: CanvasElement[]) => void;
  private onErrorListener?: (error: string) => void;
  private onConnectionStatusListener?: (connected: boolean) => void;

  constructor(token: string) {
    this.token = token;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      const wsUrl = `ws://api.glyph-board.xyz:8081?token=${encodeURIComponent(this.token || '')}`;
      
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.onConnectionStatusListener?.(true);
        
        // Process queued messages
        while (this.messageQueue.length > 0) {
          const message = this.messageQueue.shift();
          if (message) {
            this.send(message);
          }
        }
        
        resolve();
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.onConnectionStatusListener?.(false);
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket connection failed. Server might not be running on ws://api.glyph-board.xyz:8081');
        console.error('Error details:', {
          readyState: this.ws?.readyState,
          url: this.ws?.url,
          error: error
        });
        this.onErrorListener?.('Failed to connect to server. Please check if the WebSocket server is running.');
        reject(new Error('WebSocket connection failed - server may not be running'));
      };
    });
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      
      setTimeout(() => {
        this.connect().catch((error) => {
          console.error(`Reconnection attempt ${this.reconnectAttempts} failed:`, error.message);
        });
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached. WebSocket server may be down.');
      this.onErrorListener?.('Connection lost. Please check if the server is running and refresh the page.');
    }
  }

  private handleMessage(message: WebSocketMessage) {

    switch (message.type) {
      case 'shape_create':
        if (message.shape && message.senderId) {
          this.onShapeCreateListener?.(message.shape, message.senderId);
        }
        break;

      case 'shape_update':
        if (message.shape && message.senderId) {
          this.onShapeUpdateListener?.(message.shape, message.senderId);
        }
        break;

      case 'shape_delete':
        if (message.shapeId && message.senderId) {
          this.onShapeDeleteListener?.(message.shapeId, message.senderId);
        }
        break;

      case 'clear_all_shapes':
        if (message.senderId) {
          this.onClearAllShapesListener?.(message.senderId);
        }
        break;

      case 'shapes_loaded':
        if (message.shapes) {
          this.onShapesLoadedListener?.(message.shapes);
        }
        break;

      case 'error':
        if (message.message) {
          this.onErrorListener?.(message.message);
        }
        break;

      default:
    }
  }

  private send(message: WebSocketMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      // Queue message for later if not connected
      this.messageQueue.push(message);
    }
  }

  joinRoom(roomId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.roomId = roomId;
      
      const handleJoinSuccess = (message: WebSocketMessage) => {
        if (message.type === 'join_room_success' && message.roomId === roomId) {
          this.ws?.removeEventListener('message', handleMessage);
          resolve();
        }
      };

      const handleMessage = (event: MessageEvent) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          if (message.type === 'join_room_success' && message.roomId === roomId) {
            resolve();
          } else if (message.type === 'error') {
            reject(new Error(message.message || 'Failed to join room'));
          }
        } catch (error) {
          console.error('Error parsing join room response:', error);
        }
      };

      this.ws?.addEventListener('message', handleMessage);
      
      this.send({
        type: 'join_room',
        roomId
      });

      // Timeout after 5 seconds
      setTimeout(() => {
        this.ws?.removeEventListener('message', handleMessage);
        reject(new Error('Join room timeout'));
      }, 5000);
    });
  }

  leaveRoom() {
    if (this.roomId) {
      this.send({
        type: 'leave_room',
        roomId: this.roomId
      });
      this.roomId = null;
    }
  }

  createShape(shape: CanvasElement) {
    if (this.roomId) {
      this.send({
        type: 'shape_create',
        roomId: this.roomId,
        shape
      });
    }
  }

  updateShape(shape: CanvasElement) {
    if (this.roomId) {
      this.send({
        type: 'shape_update',
        roomId: this.roomId,
        shape
      });
    }
  }

  deleteShape(shapeId: string) {
    if (this.roomId) {
      this.send({
        type: 'shape_delete',
        roomId: this.roomId,
        shapeId
      });
    }
  }

  loadShapes() {
    if (this.roomId) {
      this.send({
        type: 'load_shapes',
        roomId: this.roomId
      });
    }
  }

  clearAllShapes() {
    if (this.roomId) {
      this.send({
        type: 'clear_all_shapes',
        roomId: this.roomId
      });
    } else {
      console.error('No room ID available for clear all shapes');
    }
  }

  // Event listener setters
  onShapeCreate(listener: (shape: CanvasElement, senderId: string) => void) {
    this.onShapeCreateListener = listener;
  }

  onShapeUpdate(listener: (shape: CanvasElement, senderId: string) => void) {
    this.onShapeUpdateListener = listener;
  }

  onShapeDelete(listener: (shapeId: string, senderId: string) => void) {
    this.onShapeDeleteListener = listener;
  }

  onClearAllShapes(listener: (senderId: string) => void) {
    this.onClearAllShapesListener = listener;
  }

  onShapesLoaded(listener: (shapes: CanvasElement[]) => void) {
    this.onShapesLoadedListener = listener;
  }

  onError(listener: (error: string) => void) {
    this.onErrorListener = listener;
  }

  onConnectionStatus(listener: (connected: boolean) => void) {
    this.onConnectionStatusListener = listener;
  }

  disconnect() {
    
    // Leave room if connected
    this.leaveRoom();
    
    // Close WebSocket connection
    if (this.ws) {
      this.ws.close(1000, 'Client disconnecting'); // Normal closure
      this.ws = null;
    }
    
    // Clear state
    this.isConnected = false;
    this.roomId = null;
    this.reconnectAttempts = 0;
    this.messageQueue = [];
    
    // Notify listeners
    this.onConnectionStatusListener?.(false);
    
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}
