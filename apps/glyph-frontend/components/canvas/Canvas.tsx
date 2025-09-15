"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { CanvasElement, CanvasState, DrawingState, Point, ToolType } from '../../lib/canvas-types';
import { 
  createRectangle, 
  createCircle, 
  createDiamond, 
  createArrow, 
  createLine, 
  createPencilStroke,
  createTextElement,
  isPointInElement,
  generateId
} from '../../lib/canvas-utils';
import CanvasRenderer from './CanvasRenderer';
import Toolbar from './Toolbar';

interface CanvasProps {
  roomId: string;
}

export default function Canvas({ roomId }: CanvasProps) {
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
  const [textInput, setTextInput] = useState<{ x: number; y: number; value: string } | null>(null);
  const pencilPointsRef = useRef<Point[]>([]);

  const MIN_ZOOM = 0.1;
  const MAX_ZOOM = 5.0;

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
    
    // Close text input if clicking elsewhere (but not if clicking on the input itself)
    if (textInput) {
      if (textInput.value.trim()) {
        // Create text element from input
        const textElement = createTextElement({ x: textInput.x, y: textInput.y }, textInput.value);
        const newElements = [...canvasState.elements, textElement];
        setCanvasState(prev => ({ ...prev, elements: newElements }));
        addToHistory(newElements);
      }
      setTextInput(null);
      
      // Don't continue with other tool actions if we were finishing text input
      if (canvasState.selectedTool === 'text') {
        return;
      }
    }
    
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
      }
    } else if (canvasState.selectedTool === 'text') {
      // Handle text creation - show input box at click position
      const canvas = e.currentTarget;
      const rect = canvas.getBoundingClientRect();
      setTextInput({
        x: worldPoint.x,
        y: worldPoint.y,
        value: ''
      });
    } else {
      // Start drawing shapes - use world coordinates for drawing
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

  const handleTextInputChange = useCallback((value: string) => {
    setTextInput(prev => prev ? { ...prev, value } : null);
  }, []);

  const handleTextInputSubmit = useCallback(() => {
    if (!textInput) return;
    
    if (textInput.value.trim()) {
      // Create text element
      const textElement = createTextElement({ x: textInput.x, y: textInput.y }, textInput.value);
      const newElements = [...canvasState.elements, textElement];
      setCanvasState(prev => ({ ...prev, elements: newElements }));
      addToHistory(newElements);
    }
    
    setTextInput(null);
  }, [textInput, canvasState.elements, addToHistory]);

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

      {/* Text input overlay */}
      {textInput && (
        <div
          className="fixed z-50"
          style={{
            left: textInput.x * canvasState.zoom + canvasState.viewportX,
            top: textInput.y * canvasState.zoom + canvasState.viewportY,
          }}
        >
          <input
            type="text"
            value={textInput.value}
            onChange={(e) => handleTextInputChange(e.target.value)}
            onBlur={handleTextInputSubmit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleTextInputSubmit();
              } else if (e.key === 'Escape') {
                setTextInput(null);
              }
            }}
            className="bg-white border border-gray-300 outline-none text-black text-base font-sans px-2 py-1 rounded shadow-lg"
            style={{
              fontSize: '16px',
              fontFamily: 'Arial, sans-serif',
              minWidth: '100px',
            }}
            autoFocus
            placeholder="Type text..."
          />
        </div>
      )}

      {/* Room info */}
      <div className="fixed bottom-4 left-4 bg-white rounded-lg shadow-lg px-4 py-2 text-sm text-gray-600">
        Room: {roomId}
      </div>
    </div>
  );
}
