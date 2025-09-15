import { Point, Bounds, CanvasElement, RectangleElement, CircleElement, DiamondElement, LineElement, ArrowElement, PencilElement } from './canvas-types';

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function getDistance(point1: Point, point2: Point): number {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}

export function getElementBounds(element: CanvasElement): Bounds {
  switch (element.type) {
    case 'rectangle':
    case 'diamond':
    case 'circle':
    case 'text':
      return {
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
      };
    case 'line':
      const lineEl = element as LineElement;
      if (lineEl.points.length === 0) return { x: 0, y: 0, width: 0, height: 0 };
      const xs = lineEl.points.map(p => p.x);
      const ys = lineEl.points.map(p => p.y);
      return {
        x: Math.min(...xs),
        y: Math.min(...ys),
        width: Math.max(...xs) - Math.min(...xs),
        height: Math.max(...ys) - Math.min(...ys),
      };
    case 'arrow':
      const arrowEl = element as ArrowElement;
      return {
        x: Math.min(arrowEl.startPoint.x, arrowEl.endPoint.x),
        y: Math.min(arrowEl.startPoint.y, arrowEl.endPoint.y),
        width: Math.abs(arrowEl.endPoint.x - arrowEl.startPoint.x),
        height: Math.abs(arrowEl.endPoint.y - arrowEl.startPoint.y),
      };
    case 'pencil':
      const pencilEl = element as PencilElement;
      if (pencilEl.points.length === 0) return { x: 0, y: 0, width: 0, height: 0 };
      const pxs = pencilEl.points.map(p => p.x);
      const pys = pencilEl.points.map(p => p.y);
      return {
        x: Math.min(...pxs),
        y: Math.min(...pys),
        width: Math.max(...pxs) - Math.min(...pxs),
        height: Math.max(...pys) - Math.min(...pys),
      };
    default:
      return { x: 0, y: 0, width: 0, height: 0 };
  }
}

export function isPointInBounds(point: Point, bounds: Bounds): boolean {
  return point.x >= bounds.x && 
         point.x <= bounds.x + bounds.width && 
         point.y >= bounds.y && 
         point.y <= bounds.y + bounds.height;
}

export function isPointInElement(point: Point, element: CanvasElement): boolean {
  const bounds = getElementBounds(element);
  
  switch (element.type) {
    case 'rectangle':
    case 'diamond':
    case 'text':
      return isPointInBounds(point, bounds);
    
    case 'circle':
      const centerX = bounds.x + bounds.width / 2;
      const centerY = bounds.y + bounds.height / 2;
      const radiusX = bounds.width / 2;
      const radiusY = bounds.height / 2;
      const normalizedX = (point.x - centerX) / radiusX;
      const normalizedY = (point.y - centerY) / radiusY;
      return normalizedX * normalizedX + normalizedY * normalizedY <= 1;
    
    case 'line':
    case 'pencil':
      const lineEl = element as LineElement | PencilElement;
      for (let i = 0; i < lineEl.points.length - 1; i++) {
        const distance = distanceToLineSegment(point, lineEl.points[i], lineEl.points[i + 1]);
        if (distance <= element.strokeWidth + 5) return true;
      }
      return false;
    
    case 'arrow':
      const arrowEl = element as ArrowElement;
      const arrowDistance = distanceToLineSegment(point, arrowEl.startPoint, arrowEl.endPoint);
      return arrowDistance <= element.strokeWidth + 5;
    
    default:
      return false;
  }
}

function distanceToLineSegment(point: Point, lineStart: Point, lineEnd: Point): number {
  const A = point.x - lineStart.x;
  const B = point.y - lineStart.y;
  const C = lineEnd.x - lineStart.x;
  const D = lineEnd.y - lineStart.y;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  
  if (lenSq === 0) return getDistance(point, lineStart);
  
  let param = dot / lenSq;
  
  let xx, yy;
  
  if (param < 0) {
    xx = lineStart.x;
    yy = lineStart.y;
  } else if (param > 1) {
    xx = lineEnd.x;
    yy = lineEnd.y;
  } else {
    xx = lineStart.x + param * C;
    yy = lineStart.y + param * D;
  }

  return getDistance(point, { x: xx, y: yy });
}

export function normalizeRect(startPoint: Point, endPoint: Point): Bounds {
  return {
    x: Math.min(startPoint.x, endPoint.x),
    y: Math.min(startPoint.y, endPoint.y),
    width: Math.abs(endPoint.x - startPoint.x),
    height: Math.abs(endPoint.y - startPoint.y),
  };
}

export function createRectangle(startPoint: Point, endPoint: Point): RectangleElement {
  const bounds = normalizeRect(startPoint, endPoint);
  return {
    id: generateId(),
    type: 'rectangle',
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    strokeColor: '#000000',
    fillColor: 'transparent',
    strokeWidth: 2,
    opacity: 1,
    isSelected: false,
    angle: 0,
  };
}

export function createCircle(startPoint: Point, endPoint: Point): CircleElement {
  const bounds = normalizeRect(startPoint, endPoint);
  return {
    id: generateId(),
    type: 'circle',
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    strokeColor: '#000000',
    fillColor: 'transparent',
    strokeWidth: 2,
    opacity: 1,
    isSelected: false,
    angle: 0,
  };
}

export function createDiamond(startPoint: Point, endPoint: Point): DiamondElement {
  const bounds = normalizeRect(startPoint, endPoint);
  return {
    id: generateId(),
    type: 'diamond',
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    strokeColor: '#000000',
    fillColor: 'transparent',
    strokeWidth: 2,
    opacity: 1,
    isSelected: false,
    angle: 0,
  };
}

export function createArrow(startPoint: Point, endPoint: Point): ArrowElement {
  return {
    id: generateId(),
    type: 'arrow',
    x: Math.min(startPoint.x, endPoint.x),
    y: Math.min(startPoint.y, endPoint.y),
    width: Math.abs(endPoint.x - startPoint.x),
    height: Math.abs(endPoint.y - startPoint.y),
    startPoint,
    endPoint,
    strokeColor: '#000000',
    fillColor: 'transparent',
    strokeWidth: 2,
    opacity: 1,
    isSelected: false,
    angle: 0,
  };
}

export function createLine(points: Point[]): LineElement {
  if (points.length < 2) {
    return {
      id: generateId(),
      type: 'line',
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      points,
      strokeColor: '#000000',
      fillColor: 'transparent',
      strokeWidth: 2,
      opacity: 1,
      isSelected: false,
      angle: 0,
    };
  }
  
  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);
  
  return {
    id: generateId(),
    type: 'line',
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
    points,
    strokeColor: '#000000',
    fillColor: 'transparent',
    strokeWidth: 2,
    opacity: 1,
    isSelected: false,
    angle: 0,
  };
}

export function createPencilStroke(points: Point[]): PencilElement {
  const bounds = getElementBounds({ points } as any);
  return {
    id: generateId(),
    type: 'pencil',
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    points,
    strokeColor: '#000000',
    fillColor: 'transparent',
    strokeWidth: 2,
    opacity: 1,
    isSelected: false,
    angle: 0,
  };
}

export function createTextElement(point: Point, text: string = ''): any {
  return {
    id: generateId(),
    type: 'text',
    x: point.x,
    y: point.y,
    width: Math.max(text.length * 10, 50), // Minimum width for visibility
    height: 20,
    text,
    fontSize: 16,
    fontFamily: 'Arial, sans-serif',
    strokeColor: '#000000',
    fillColor: 'transparent',
    strokeWidth: 1,
    opacity: 1,
    isSelected: false,
    angle: 0,
  };
}
