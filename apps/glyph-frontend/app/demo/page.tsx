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
import CanvasRenderer from '../../components/canvas/CanvasRenderer';
import Toolbar from '../../components/canvas/Toolbar';

export default function DemoCanvas() {
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
  const pencilPointsRef = useRef<Point[]>([]);

  const MIN_ZOOM = 0.1;
  const MAX_ZOOM = 5.0;

  // Handle back navigation
  const handleBack = useCallback(() => {
    router.push('/');
  }, [router]);

  // Prevent browser zoom on the entire page when in canvas
  useEffect(() => {
    const preventBrowserZoom = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    };

    document.addEventListener('wheel', preventBrowserZoom, { passive: false });
    
    return () => {
      document.removeEventListener('wheel', preventBrowserZoom);
    };
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

  const getMousePosition = useCallback((e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  }, []);

  const getWorldPosition = useCallback((screenPoint: Point): Point => {
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
      if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
        setIsPanning(true);
        setLastPanPoint(screenPoint);
        return;
      }

      const clickedElement = canvasState.elements
        .slice()
        .reverse()
        .find(el => isPointInElement(worldPoint, el));

      if (clickedElement) {
        setCanvasState(prev => ({
          ...prev,
          selectedElements: [clickedElement.id],
          elements: prev.elements.map(el => ({
            ...el,
            isSelected: el.id === clickedElement.id
          }))
        }));
      } else {
        setCanvasState(prev => ({
          ...prev,
          selectedElements: [],
          elements: prev.elements.map(el => ({ ...el, isSelected: false }))
        }));
      }

      setDrawingState({
        isDrawing: false,
        startPoint: worldPoint,
        currentElement: null,
        dragOffset: null,
      });
    } else if (canvasState.selectedTool === 'eraser') {
      const elementToErase = canvasState.elements
        .slice()
        .reverse()
        .find(el => isPointInElement(worldPoint, el));

      if (elementToErase) {
        const newElements = canvasState.elements.filter(el => el.id !== elementToErase.id);
        setCanvasState(prev => ({ ...prev, elements: newElements }));
        addToHistory(newElements);
      }
    } else {
      setDrawingState({
        isDrawing: true,
        startPoint: worldPoint,
        currentElement: null,
        dragOffset: null,
      });
    }
  }, [canvasState, getMousePosition, getWorldPosition, addToHistory]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const screenPoint = getMousePosition(e);

    if (isPanning && lastPanPoint && canvasState.selectedTool === 'select') {
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
      pencilPointsRef.current.push(worldPoint);
      
      if (pencilPointsRef.current.length > 1) {
        const tempPencilElement = createPencilStroke(pencilPointsRef.current);
        tempPencilElement.id = 'temp-pencil';
        
        setCanvasState(prev => ({
          ...prev,
          elements: [
            ...prev.elements.filter(el => el.id !== 'temp-pencil'),
            tempPencilElement
          ]
        }));
      }
    } else {
      const startPoint = drawingState.startPoint;
      const width = worldPoint.x - startPoint.x;
      const height = worldPoint.y - startPoint.y;

      let tempElement: CanvasElement;

      switch (canvasState.selectedTool) {
        case 'rectangle':
          tempElement = createRectangle(startPoint, worldPoint);
          break;
        case 'circle':
          tempElement = createCircle(startPoint, worldPoint);
          break;
        case 'diamond':
          tempElement = createDiamond(startPoint, worldPoint);
          break;
        case 'arrow':
          tempElement = createArrow(startPoint, worldPoint);
          break;
        case 'line':
          tempElement = createLine([startPoint, worldPoint]);
          break;
        default:
          return;
      }

      tempElement.id = 'temp-preview';

      setCanvasState(prev => ({
        ...prev,
        elements: [
          ...prev.elements.filter(el => el.id !== 'temp-preview'),
          tempElement
        ]
      }));
    }
  }, [drawingState, canvasState, getMousePosition, getWorldPosition]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    setLastPanPoint(null);

    if (!drawingState.isDrawing || !drawingState.startPoint) return;

    if (canvasState.selectedTool === 'pencil') {
      if (pencilPointsRef.current.length > 1) {
        const pencilElement = createPencilStroke(pencilPointsRef.current);
        const newElements = [
          ...canvasState.elements.filter(el => el.id !== 'temp-pencil'),
          pencilElement
        ];
        setCanvasState(prev => ({ ...prev, elements: newElements }));
        addToHistory(newElements);
      }
      pencilPointsRef.current = [];
    } else {
      const tempElement = canvasState.elements.find(el => el.id === 'temp-preview');
      if (tempElement) {
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
        } else {
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
    
    setCanvasState(prev => ({
      ...prev,
      elements: prev.elements.filter(el => !el.id.startsWith('temp-'))
    }));
  }, []);

  const handleToolChange = useCallback((tool: ToolType) => {
    setCanvasState(prev => ({ ...prev, selectedTool: tool }));
    
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
    const newElements: CanvasElement[] = [];
    setCanvasState(prev => ({ ...prev, elements: newElements, selectedElements: [] }));
    addToHistory(newElements);
  }, [addToHistory]);

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
    e.preventDefault();
    
    if (e.ctrlKey || e.metaKey) {
      const canvas = e.currentTarget;
      const rect = canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
      const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);
      
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, canvasState.zoom * zoomFactor));
      
      if (newZoom !== canvasState.zoom) {
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
      
      {/* Demo Banner */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 text-blue-100 px-6 py-3 rounded-2xl shadow-xl">
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Demo Mode - Try the tools!</span>
            <a 
              href="/signup" 
              className="ml-4 px-3 py-1 bg-blue-500/30 hover:bg-blue-500/40 rounded-lg text-sm font-medium transition-colors"
            >
              Sign up for full features
            </a>
          </div>
        </div>
      </div>

      {/* Tool Status Display */}
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-600/50 text-slate-200 px-4 py-2 rounded-xl shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">
              Current Tool: <span className="text-blue-300 capitalize">{canvasState.selectedTool}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="fixed top-4 left-24 z-50">
        <button
          onClick={handleBack}
          title="Back to Home (Esc)"
          className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 text-slate-200 hover:bg-slate-700/50 hover:border-slate-500/50 hover:text-white rounded-xl transition-all duration-300 hover:scale-105 group"
        >
          <svg className="w-5 h-5 group-hover:transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Back to Home</span>
          <span className="text-xs text-gray-400 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">Esc</span>
        </button>
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

    </div>
  );
}
