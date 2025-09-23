"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CanvasElement, CanvasState, DrawingState, Point, ToolType } from '../../lib/canvas-types';
import { 
  createRectangle, 
  createCircle, 
  createDiamond, 
  createArrow, 
  createLine, 
  createPencilStroke,
  isPointInElement,
  generateId
} from '../../lib/canvas-utils';
import { CanvasWebSocket } from '../../lib/websocket';
import { testWebSocketConnection } from '../../lib/websocket-debug';
import CanvasRenderer from './CanvasRenderer';
import Toolbar from './Toolbar';

interface CanvasProps {
  roomId: string;
}

export default function Canvas({ roomId }: CanvasProps) {
  const router = useRouter();
  const [canvasState, setCanvasState] = useState<CanvasState>({
    elements: [],
    selectedTool: 'select',
    selectedElements: [],
    viewportX: 0,
    viewportY: 0,
    zoom: 1,
    gridSize: 20,
    snapToGrid: false,
  });

  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawing: false,
    startPoint: null,
    currentElement: null,
    dragOffset: null,
  });

  const [history, setHistory] = useState<CanvasElement[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState<Point | null>(null);
  
  const [wsConnection, setWsConnection] = useState<CanvasWebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const pencilPointsRef = useRef<Point[]>([]);
  const currentUserIdRef = useRef<string | null>(null);

  const MIN_ZOOM = 0.1;
  const MAX_ZOOM = 5.0;

  // Handle back navigation
  const handleBack = useCallback(() => {
    // Show confirmation if connected and there are elements on canvas
    if (isConnected && canvasState.elements.length > 0) {
      const confirmLeave = window.confirm(
        'Are you sure you want to leave? Your work is automatically saved, but you will disconnect from the collaborative session.'
      );
      if (!confirmLeave) {
        return;
      }
    }
    
    if (wsConnection) {
      wsConnection.disconnect();
      setWsConnection(null);
    }
    router.push('/dashboard');
  }, [wsConnection, router, isConnected, canvasState.elements.length]);

  // Initialize WebSocket connection
  useEffect(() => {
    const initializeWebSocket = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          console.error('No authentication token found in localStorage');
          setConnectionError('No authentication token found');
          return;
        }

        
        const ws = new CanvasWebSocket(token);
        
        // Set up event listeners
        ws.onConnectionStatus((connected) => {
          setIsConnected(connected);
          if (!connected) {
            setConnectionError('Connection lost');
          } else {
            setConnectionError(null);
          }
        });

        ws.onError((error) => {
          setConnectionError(error);
        });

        ws.onShapeCreate((shape, senderId) => {
          if (senderId !== currentUserIdRef.current) {
            setCanvasState(prev => ({
              ...prev,
              elements: [...prev.elements, shape]
            }));
          }
        });

        ws.onShapeUpdate((shape, senderId) => {
          if (senderId !== currentUserIdRef.current) {
            setCanvasState(prev => ({
              ...prev,
              elements: prev.elements.map(el => 
                el.id === shape.id ? shape : el
              )
            }));
          }
        });

        ws.onShapeDelete((shapeId, senderId) => {
          if (senderId !== currentUserIdRef.current) {
            setCanvasState(prev => ({
              ...prev,
              elements: prev.elements.filter(el => el.id !== shapeId),
              selectedElements: prev.selectedElements.filter(id => id !== shapeId)
            }));
          }
        });

        ws.onClearAllShapes((senderId) => {
          if (senderId !== currentUserIdRef.current) {
            setCanvasState(prev => ({
              ...prev,
              elements: [],
              selectedElements: []
            }));
          }
        });

        ws.onShapesLoaded((shapes) => {
          setCanvasState(prev => ({
            ...prev,
            elements: shapes
          }));
        });

        // Connect and join room
        await ws.connect();
        await ws.joinRoom(roomId);
        
        // Load existing shapes
        ws.loadShapes();
        
        setWsConnection(ws);

        // Get current user ID from token
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          currentUserIdRef.current = payload.userId;
        } catch (error) {
          console.error('Error parsing token:', error);
        }

      } catch (error: any) {
        console.error('WebSocket initialization error:', error);
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          roomId: roomId
        });
        setConnectionError(error.message || 'Failed to connect to server');
      }
    };

    initializeWebSocket();

    // Make debug function available in console
    if (typeof window !== 'undefined') {
      (window as any).testWebSocketConnection = testWebSocketConnection;
    }

    return () => {
      wsConnection?.disconnect();
    };
  }, [roomId]);

  // Handle browser navigation and cleanup
  useEffect(() => {
    // Handle browser back button
    const handlePopState = (e: PopStateEvent) => {
      // Show confirmation if connected and there are elements
      if (isConnected && canvasState.elements.length > 0) {
        const confirmLeave = window.confirm(
          'Are you sure you want to leave? Your work is automatically saved, but you will disconnect from the collaborative session.'
        );
        if (!confirmLeave) {
          // Prevent navigation by pushing current state back
          window.history.pushState(null, '', window.location.href);
          return;
        }
      }
      
      if (wsConnection) {
        wsConnection.disconnect();
        setWsConnection(null);
      }
    };

    // Handle page unload (refresh, close tab, navigate away)
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (wsConnection) {
        wsConnection.disconnect();
      }
      
      // Show browser confirmation dialog if there's work to lose
      if (isConnected && canvasState.elements.length > 0) {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave? Your work is automatically saved.';
        return 'Are you sure you want to leave? Your work is automatically saved.';
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [wsConnection, isConnected, canvasState.elements.length]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Escape key to go back
      if (e.key === 'Escape') {
        e.preventDefault();
        handleBack();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleBack]);

  // Prevent browser zoom on the entire page when in canvas
  useEffect(() => {
    const preventBrowserZoom = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    };

    // Add event listener to document to catch all wheel events
    document.addEventListener('wheel', preventBrowserZoom, { passive: false });
    
    return () => {
      document.removeEventListener('wheel', preventBrowserZoom);
    };
  }, []);

  const getMousePosition = useCallback((e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  }, []);


  const getWorldPosition = useCallback((screenPoint: Point): Point => {
    // Convert screen coordinates to world coordinates accounting for zoom and viewport
    return {
      x: (screenPoint.x - canvasState.viewportX) / canvasState.zoom,
      y: (screenPoint.y - canvasState.viewportY) / canvasState.zoom,
    };
  }, [canvasState.viewportX, canvasState.viewportY, canvasState.zoom]);

  const addToHistory = useCallback((elements: CanvasElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...elements]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const screenPoint = getMousePosition(e);
    const worldPoint = getWorldPosition(screenPoint);
    
    
    
    if (canvasState.selectedTool === 'select') {
      // Handle canvas panning - use screen coordinates for panning
      setIsPanning(true);
      setLastPanPoint(screenPoint);
    } else if (canvasState.selectedTool === 'pencil') {
      // Start pencil drawing - use world coordinates for drawing
      pencilPointsRef.current = [worldPoint];
      setDrawingState({
        isDrawing: true,
        startPoint: worldPoint,
        currentElement: null,
        dragOffset: null,
      });
    } else if (canvasState.selectedTool === 'eraser') {
      // Handle eraser - use world coordinates for element detection
      const elementToErase = canvasState.elements
        .slice()
        .reverse()
        .find(el => isPointInElement(worldPoint, el));

      if (elementToErase) {
        const newElements = canvasState.elements.filter(el => el.id !== elementToErase.id);
        setCanvasState(prev => ({ ...prev, elements: newElements }));
        addToHistory(newElements);
        
        // Send delete to WebSocket
        wsConnection?.deleteShape(elementToErase.id);
      }
    } else {
      // Start drawing shapes - use world coordinates for drawing
      setDrawingState({
        isDrawing: true,
        startPoint: worldPoint,
        currentElement: null,
        dragOffset: null,
      });
    }
  }, [canvasState, getMousePosition, getWorldPosition, addToHistory, wsConnection]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const screenPoint = getMousePosition(e);

    if (isPanning && lastPanPoint && canvasState.selectedTool === 'select') {
      // Handle canvas panning - use screen coordinates for smooth panning
      const deltaX = screenPoint.x - lastPanPoint.x;
      const deltaY = screenPoint.y - lastPanPoint.y;
      
      setCanvasState(prev => ({
        ...prev,
        viewportX: prev.viewportX + deltaX,
        viewportY: prev.viewportY + deltaY,
      }));
      
      setLastPanPoint(screenPoint);
      return;
    }

    if (!drawingState.isDrawing || !drawingState.startPoint) return;

    const worldPoint = getWorldPosition(screenPoint);

    if (canvasState.selectedTool === 'pencil') {
      // Add point to pencil stroke
      pencilPointsRef.current.push(worldPoint);
      
      // Create temporary pencil element for preview
      const tempPencilElement = createPencilStroke(pencilPointsRef.current);
      setCanvasState(prev => ({
        ...prev,
        elements: [
          ...prev.elements.filter(el => el.id !== 'temp-pencil'),
          { ...tempPencilElement, id: 'temp-pencil' }
        ]
      }));
    } else {
      // Preview shape creation
      let previewElement: CanvasElement | null = null;

      switch (canvasState.selectedTool) {
        case 'rectangle':
          previewElement = createRectangle(drawingState.startPoint, worldPoint);
          break;
        case 'circle':
          previewElement = createCircle(drawingState.startPoint, worldPoint);
          break;
        case 'diamond':
          previewElement = createDiamond(drawingState.startPoint, worldPoint);
          break;
        case 'arrow':
          previewElement = createArrow(drawingState.startPoint, worldPoint);
          break;
        case 'line':
          previewElement = createLine([drawingState.startPoint, worldPoint]);
          break;
      }

      if (previewElement) {
        setCanvasState(prev => ({
          ...prev,
          elements: [
            ...prev.elements.filter(el => el.id !== 'temp-preview'),
            { ...previewElement, id: 'temp-preview' }
          ]
        }));
      }
    }
  }, [drawingState, canvasState.selectedTool, getMousePosition, getWorldPosition, isPanning, lastPanPoint, canvasState]);

  const handleMouseUp = useCallback(() => {
    if (isPanning) {
      setIsPanning(false);
      setLastPanPoint(null);
      return;
    }

    if (!drawingState.isDrawing || !drawingState.startPoint) return;

    if (canvasState.selectedTool === 'pencil') {
      // Finalize pencil stroke
      if (pencilPointsRef.current.length > 1) {
        const pencilElement = createPencilStroke(pencilPointsRef.current);
        const newElements = [
          ...canvasState.elements.filter(el => el.id !== 'temp-pencil'),
          pencilElement
        ];
        setCanvasState(prev => ({ ...prev, elements: newElements }));
        addToHistory(newElements);
        
        // Send shape to WebSocket
        wsConnection?.createShape(pencilElement);
      }
      pencilPointsRef.current = [];
    } else {
      // Finalize shape creation
      const tempElement = canvasState.elements.find(el => el.id === 'temp-preview');
      if (tempElement) {
        // For lines and arrows, don't require minimum size
        const isLineLike = canvasState.selectedTool === 'line' || canvasState.selectedTool === 'arrow';
        const hasMinimumSize = tempElement.width > 5 && tempElement.height > 5;
        const hasMinimumLength = isLineLike && (tempElement.width > 3 || tempElement.height > 3);
        
        if (hasMinimumSize || hasMinimumLength) {
          const finalElement = { ...tempElement, id: generateId() };
          const newElements = [
            ...canvasState.elements.filter(el => el.id !== 'temp-preview'),
            finalElement
          ];
          setCanvasState(prev => ({ ...prev, elements: newElements }));
          addToHistory(newElements);
          
          // Send shape to WebSocket
          wsConnection?.createShape(finalElement);
        } else {
          // Remove temp preview if too small
          setCanvasState(prev => ({
            ...prev,
            elements: prev.elements.filter(el => el.id !== 'temp-preview')
          }));
        }
      }
    }

    setDrawingState({
      isDrawing: false,
      startPoint: null,
      currentElement: null,
      dragOffset: null,
    });
  }, [drawingState, canvasState, addToHistory]);

  const handleMouseLeave = useCallback(() => {
    setIsPanning(false);
    setLastPanPoint(null);
    setDrawingState({
      isDrawing: false,
      startPoint: null,
      currentElement: null,
      dragOffset: null,
    });
    
    // Clean up temp elements
    setCanvasState(prev => ({
      ...prev,
      elements: prev.elements.filter(el => !el.id.startsWith('temp-'))
    }));
  }, []);

  const handleToolChange = useCallback((tool: ToolType) => {
    setCanvasState(prev => ({ ...prev, selectedTool: tool }));
    
    // Clear selection when changing tools
    if (tool !== 'select') {
      setCanvasState(prev => ({
        ...prev,
        selectedElements: [],
        elements: prev.elements.map(el => ({ ...el, isSelected: false }))
      }));
    }
  }, []);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCanvasState(prev => ({ ...prev, elements: [...history[newIndex]] }));
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCanvasState(prev => ({ ...prev, elements: [...history[newIndex]] }));
    }
  }, [history, historyIndex]);

  const handleClear = useCallback(() => {
    setCanvasState(prev => ({ ...prev, elements: [] }));
    addToHistory([]);
    
    // Send clear all to WebSocket to persist in database
    if (wsConnection) {
      wsConnection.clearAllShapes();
    } else {
      console.error('No WebSocket connection available for clear all');
    }
  }, [addToHistory, wsConnection]);

  const handleZoomIn = useCallback(() => {
    setCanvasState(prev => ({
      ...prev,
      zoom: Math.min(prev.zoom * 1.2, MAX_ZOOM)
    }));
  }, [MAX_ZOOM]);

  const handleZoomOut = useCallback(() => {
    setCanvasState(prev => ({
      ...prev,
      zoom: Math.max(prev.zoom / 1.2, MIN_ZOOM)
    }));
  }, [MIN_ZOOM]);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    // Prevent default browser zoom
    e.preventDefault();
    
    // Only zoom when Ctrl key is held (like Excalidraw)
    if (e.ctrlKey || e.metaKey) {
      const canvas = e.currentTarget;
      const rect = canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
      const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);
      
      // Calculate zoom factor
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, canvasState.zoom * zoomFactor));
      
      if (newZoom !== canvasState.zoom) {
        // Zoom towards mouse position
        const zoomRatio = newZoom / canvasState.zoom;
        const newViewportX = mouseX - (mouseX - canvasState.viewportX) * zoomRatio;
        const newViewportY = mouseY - (mouseY - canvasState.viewportY) * zoomRatio;
        
        setCanvasState(prev => ({
          ...prev,
          zoom: newZoom,
          viewportX: newViewportX,
          viewportY: newViewportY,
        }));
      }
    }
  }, [canvasState.zoom, canvasState.viewportX, canvasState.viewportY, MIN_ZOOM, MAX_ZOOM]);


  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      <Toolbar
        selectedTool={canvasState.selectedTool}
        onToolChange={handleToolChange}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={handleClear}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        zoom={canvasState.zoom}
      />
      
      {/* Back Button */}
      <div className="fixed top-4 left-24 z-50">
        <button
          onClick={handleBack}
          title="Back to Dashboard (Esc)"
          className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 text-slate-200 hover:bg-slate-700/50 hover:border-slate-500/50 hover:text-white rounded-xl transition-all duration-300 hover:scale-105 group"
        >
          <svg className="w-5 h-5 group-hover:transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Back to Dashboard</span>
          <span className="text-xs text-gray-400 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">Esc</span>
        </button>
      </div>
      
      {/* Connection Status */}
      <div className="fixed top-4 right-4 z-50">
        <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg backdrop-blur-sm ${
          isConnected ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'
        }`}>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className={`text-sm font-medium ${isConnected ? 'text-green-700' : 'text-red-700'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        {connectionError && (
          <div className="mt-2 px-3 py-2 bg-red-500/20 border border-red-500/30 rounded-lg backdrop-blur-sm">
            <span className="text-xs text-red-700">{connectionError}</span>
          </div>
        )}
      </div>
      
      <div className="w-full h-full pl-20">
        <CanvasRenderer
          elements={canvasState.elements}
          width={1920}
          height={1080}
          viewportX={canvasState.viewportX}
          viewportY={canvasState.viewportY}
          zoom={canvasState.zoom}
          selectedTool={canvasState.selectedTool}
          isPanning={isPanning}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onWheel={handleWheel}
        />
      </div>


      {/* Debug info */}
      <div className="fixed bottom-4 left-4 bg-white rounded-lg shadow-lg px-4 py-2 text-sm text-gray-600">
        Room: {roomId} | Tool: {canvasState.selectedTool}
      </div>
    </div>
  );
}
