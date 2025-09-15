export interface Point {
  x: number;
  y: number;
}

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type ToolType = 
  | 'select'
  | 'rectangle' 
  | 'diamond'
  | 'circle'
  | 'arrow'
  | 'line'
  | 'pencil'
  | 'text'
  | 'eraser';

export interface BaseElement {
  id: string;
  type: ToolType;
  x: number;
  y: number;
  width: number;
  height: number;
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  opacity: number;
  isSelected: boolean;
  angle: number;
}

export interface RectangleElement extends BaseElement {
  type: 'rectangle';
}

export interface CircleElement extends BaseElement {
  type: 'circle';
}

export interface DiamondElement extends BaseElement {
  type: 'diamond';
}

export interface LineElement extends BaseElement {
  type: 'line';
  points: Point[];
}

export interface ArrowElement extends BaseElement {
  type: 'arrow';
  startPoint: Point;
  endPoint: Point;
}

export interface PencilElement extends BaseElement {
  type: 'pencil';
  points: Point[];
  pressure?: number[];
}

export interface TextElement extends BaseElement {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
}

export type CanvasElement = 
  | RectangleElement 
  | CircleElement 
  | DiamondElement 
  | LineElement 
  | ArrowElement 
  | PencilElement 
  | TextElement;

export interface CanvasState {
  elements: CanvasElement[];
  selectedTool: ToolType;
  selectedElements: string[];
  viewportX: number;
  viewportY: number;
  zoom: number;
  gridSize: number;
  snapToGrid: boolean;
}

export interface DrawingState {
  isDrawing: boolean;
  startPoint: Point | null;
  currentElement: CanvasElement | null;
  dragOffset: Point | null;
}

export interface CanvasConfig {
  width: number;
  height: number;
  backgroundColor: string;
  gridColor: string;
  selectionColor: string;
  handleSize: number;
}
