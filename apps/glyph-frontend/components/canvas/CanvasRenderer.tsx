"use client";

import { useRef, useEffect } from 'react';
import { CanvasElement, Point, ArrowElement, LineElement, PencilElement } from '../../lib/canvas-types';
import { getElementBounds } from '../../lib/canvas-utils';

interface CanvasRendererProps {
  elements: CanvasElement[];
  width: number;
  height: number;
  viewportX: number;
  viewportY: number;
  zoom: number;
  selectedTool: string;
  isPanning?: boolean;
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseLeave: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onWheel: (e: React.WheelEvent<HTMLCanvasElement>) => void;
}

export default function CanvasRenderer({
  elements,
  width,
  height,
  viewportX,
  viewportY,
  zoom,
  selectedTool,
  isPanning = false,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  onWheel
}: CanvasRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set canvas background to light gray (no white background)
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, width, height);

    // Apply zoom and viewport transformation
    ctx.save();
    ctx.scale(zoom, zoom);
    ctx.translate(viewportX / zoom, viewportY / zoom);

    // Draw infinite grid
    drawInfiniteGrid(ctx, width, height, viewportX, viewportY, zoom);

    // Draw elements
    elements.forEach(element => {
      drawElement(ctx, element);
    });

    ctx.restore();
  }, [elements, width, height, viewportX, viewportY, zoom]);

  const drawInfiniteGrid = (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, viewportX: number, viewportY: number, zoom: number) => {
    const gridSize = 20;
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1 / zoom;
    
    // Calculate the visible area in world coordinates
    const visibleLeft = -viewportX / zoom;
    const visibleTop = -viewportY / zoom;
    const visibleRight = visibleLeft + canvasWidth / zoom;
    const visibleBottom = visibleTop + canvasHeight / zoom;
    
    // Extend the grid beyond visible area for smooth panning
    const gridLeft = Math.floor(visibleLeft / gridSize) * gridSize - gridSize * 2;
    const gridTop = Math.floor(visibleTop / gridSize) * gridSize - gridSize * 2;
    const gridRight = Math.ceil(visibleRight / gridSize) * gridSize + gridSize * 2;
    const gridBottom = Math.ceil(visibleBottom / gridSize) * gridSize + gridSize * 2;
    
    ctx.beginPath();
    
    // Draw vertical lines
    for (let x = gridLeft; x <= gridRight; x += gridSize) {
      ctx.moveTo(x, gridTop);
      ctx.lineTo(x, gridBottom);
    }
    
    // Draw horizontal lines
    for (let y = gridTop; y <= gridBottom; y += gridSize) {
      ctx.moveTo(gridLeft, y);
      ctx.lineTo(gridRight, y);
    }
    
    ctx.stroke();
  };

  const drawElement = (ctx: CanvasRenderingContext2D, element: CanvasElement) => {
    ctx.save();
    
    ctx.strokeStyle = element.strokeColor;
    ctx.fillStyle = element.fillColor;
    ctx.lineWidth = element.strokeWidth;
    ctx.globalAlpha = element.opacity;

    switch (element.type) {
      case 'rectangle':
        drawRectangle(ctx, element);
        break;
      case 'circle':
        drawCircle(ctx, element);
        break;
      case 'diamond':
        drawDiamond(ctx, element);
        break;
      case 'line':
        drawLine(ctx, element as LineElement);
        break;
      case 'arrow':
        drawArrow(ctx, element as ArrowElement);
        break;
      case 'pencil':
        drawPencil(ctx, element as PencilElement);
        break;
      case 'text':
        drawText(ctx, element as any);
        break;
    }

    // Draw selection handles if selected
    if (element.isSelected) {
      drawSelectionHandles(ctx, element);
    }

    ctx.restore();
  };

  const drawRectangle = (ctx: CanvasRenderingContext2D, element: CanvasElement) => {
    ctx.beginPath();
    ctx.rect(element.x, element.y, element.width, element.height);
    
    if (element.fillColor !== 'transparent') {
      ctx.fill();
    }
    ctx.stroke();
  };

  const drawCircle = (ctx: CanvasRenderingContext2D, element: CanvasElement) => {
    const centerX = element.x + element.width / 2;
    const centerY = element.y + element.height / 2;
    const radiusX = element.width / 2;
    const radiusY = element.height / 2;

    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
    
    if (element.fillColor !== 'transparent') {
      ctx.fill();
    }
    ctx.stroke();
  };

  const drawDiamond = (ctx: CanvasRenderingContext2D, element: CanvasElement) => {
    const centerX = element.x + element.width / 2;
    const centerY = element.y + element.height / 2;
    const halfWidth = element.width / 2;
    const halfHeight = element.height / 2;

    ctx.beginPath();
    ctx.moveTo(centerX, element.y);
    ctx.lineTo(element.x + element.width, centerY);
    ctx.lineTo(centerX, element.y + element.height);
    ctx.lineTo(element.x, centerY);
    ctx.closePath();
    
    if (element.fillColor !== 'transparent') {
      ctx.fill();
    }
    ctx.stroke();
  };

  const drawLine = (ctx: CanvasRenderingContext2D, element: LineElement) => {
    if (element.points.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(element.points[0].x, element.points[0].y);
    
    for (let i = 1; i < element.points.length; i++) {
      ctx.lineTo(element.points[i].x, element.points[i].y);
    }
    
    ctx.stroke();
  };

  const drawArrow = (ctx: CanvasRenderingContext2D, element: ArrowElement) => {
    const { startPoint, endPoint } = element;
    
    // Draw main line
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.stroke();

    // Draw arrowhead
    const angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
    const arrowLength = 15;
    const arrowAngle = Math.PI / 6;

    ctx.beginPath();
    ctx.moveTo(endPoint.x, endPoint.y);
    ctx.lineTo(
      endPoint.x - arrowLength * Math.cos(angle - arrowAngle),
      endPoint.y - arrowLength * Math.sin(angle - arrowAngle)
    );
    ctx.moveTo(endPoint.x, endPoint.y);
    ctx.lineTo(
      endPoint.x - arrowLength * Math.cos(angle + arrowAngle),
      endPoint.y - arrowLength * Math.sin(angle + arrowAngle)
    );
    ctx.stroke();
  };

  const drawPencil = (ctx: CanvasRenderingContext2D, element: PencilElement) => {
    if (element.points.length < 2) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.moveTo(element.points[0].x, element.points[0].y);
    
    for (let i = 1; i < element.points.length; i++) {
      const point = element.points[i];
      const prevPoint = element.points[i - 1];
      
      // Use quadratic curves for smoother lines
      if (i === element.points.length - 1) {
        ctx.lineTo(point.x, point.y);
      } else {
        const nextPoint = element.points[i + 1];
        const cpx = (point.x + nextPoint.x) / 2;
        const cpy = (point.y + nextPoint.y) / 2;
        ctx.quadraticCurveTo(point.x, point.y, cpx, cpy);
      }
    }
    
    ctx.stroke();
  };

  const drawText = (ctx: CanvasRenderingContext2D, element: any) => {
    if (!element.text) return;
    
    ctx.fillStyle = element.strokeColor;
    ctx.font = `${element.fontSize || 16}px ${element.fontFamily || 'Arial, sans-serif'}`;
    ctx.textBaseline = 'top';
    
    const lines = element.text.split('\n');
    const lineHeight = (element.fontSize || 16) * 1.2;
    
    lines.forEach((line: string, index: number) => {
      ctx.fillText(line, element.x, element.y + (index * lineHeight));
    });
  };

  const drawSelectionHandles = (ctx: CanvasRenderingContext2D, element: CanvasElement) => {
    const bounds = getElementBounds(element);
    const handleSize = 8;
    
    ctx.fillStyle = '#4285f4';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;

    const handles = [
      { x: bounds.x, y: bounds.y },
      { x: bounds.x + bounds.width, y: bounds.y },
      { x: bounds.x + bounds.width, y: bounds.y + bounds.height },
      { x: bounds.x, y: bounds.y + bounds.height },
    ];

    handles.forEach(handle => {
      ctx.fillRect(
        handle.x - handleSize / 2,
        handle.y - handleSize / 2,
        handleSize,
        handleSize
      );
      ctx.strokeRect(
        handle.x - handleSize / 2,
        handle.y - handleSize / 2,
        handleSize,
        handleSize
      );
    });
  };

  const getCursorStyle = () => {
    if (isPanning) {
      return 'cursor-grabbing';
    }
    
    switch (selectedTool) {
      case 'select':
        return 'cursor-grab';
      case 'pencil':
        return 'cursor-crosshair';
      case 'eraser':
        return 'cursor-pointer';
      case 'text':
        return 'cursor-text';
      default:
        return 'cursor-crosshair';
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={getCursorStyle()}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onWheel={onWheel}
      style={{ 
        width: '100%', 
        height: '100%',
        maxWidth: `${width}px`,
        maxHeight: `${height}px`
      }}
    />
  );
}
