"use client";

import React from 'react';
import { ToolType } from '../../lib/canvas-types';

interface ToolbarProps {
  selectedTool: ToolType;
  onToolChange: (tool: ToolType) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
}

const tools: { type: ToolType; icon: React.ReactElement; label: string }[] = [
  { 
    type: 'select', 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="5,9 2,12 5,15"/>
        <polyline points="9,5 12,2 15,5"/>
        <polyline points="15,19 12,22 9,19"/>
        <polyline points="19,9 22,12 19,15"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <line x1="12" y1="2" x2="12" y2="22"/>
      </svg>
    ), 
    label: 'Hand (Pan Canvas)' 
  },
  { 
    type: 'rectangle', 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      </svg>
    ), 
    label: 'Rectangle' 
  },
  { 
    type: 'diamond', 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12,2 22,12 12,22 2,12"/>
      </svg>
    ), 
    label: 'Diamond' 
  },
  { 
    type: 'circle', 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
      </svg>
    ), 
    label: 'Circle' 
  },
  { 
    type: 'arrow', 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="7" y1="17" x2="17" y2="7"/>
        <polyline points="7,7 17,7 17,17"/>
      </svg>
    ), 
    label: 'Arrow' 
  },
  { 
    type: 'line', 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="4" y1="12" x2="20" y2="12"/>
      </svg>
    ), 
    label: 'Line' 
  },
  { 
    type: 'pencil', 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 19l7-7 3 3-7 7-3-3z"/>
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
        <path d="M2 2l7.586 7.586"/>
        <circle cx="11" cy="11" r="2"/>
      </svg>
    ), 
    label: 'Pencil' 
  },
  { 
    type: 'eraser', 
    icon: (
      <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" stroke="none">
        <path d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828zm2.121.707a1 1 0 0 0-1.414 0L4.16 7.547l5.293 5.293 4.633-4.633a1 1 0 0 0 0-1.414zM8.746 13.547 3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293z"/>
      </svg>
    ), 
    label: 'Eraser' 
  },
];

interface ToolbarProps {
  selectedTool: ToolType;
  onToolChange: (tool: ToolType) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  zoom: number;
}

export default function Toolbar({ selectedTool, onToolChange, onUndo, onRedo, onClear, onZoomIn, onZoomOut, zoom }: ToolbarProps) {
  return (
    <div className="fixed top-1/2 left-4 transform -translate-y-1/2 z-50">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-2 flex flex-col items-center space-y-1">
        {/* Main tools */}
        <div className="flex flex-col items-center space-y-1">
          {tools.map((tool) => (
            <button
              key={tool.type}
              onClick={() => onToolChange(tool.type)}
              className={`
                w-12 h-12 rounded-xl flex items-center justify-center text-lg font-medium
                transition-all duration-200 hover:bg-gray-100
                ${selectedTool === tool.type 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-gray-700 hover:text-gray-900'
                }
              `}
              title={tool.label}
            >
              {tool.icon}
            </button>
          ))}
        </div>

        {/* Separator */}
        <div className="h-px w-8 bg-gray-200 my-2" />

        {/* Action buttons */}
        <div className="flex flex-col items-center space-y-1">
          <button
            onClick={onUndo}
            className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
            title="Undo"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 7v6h6"/>
              <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"/>
            </svg>
          </button>
          <button
            onClick={onRedo}
            className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
            title="Redo"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 7v6h-6"/>
              <path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7"/>
            </svg>
          </button>
          <button
            onClick={onClear}
            className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-all duration-200"
            title="Clear All"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3,6 5,6 21,6"/>
              <path d="M19,6v14a2,2 0 01-2,2H7a2,2 0 01-2-2V6m3,0V4a2,2 0 012-2h4a2,2 0 012,2v2"/>
              <line x1="10" y1="11" x2="10" y2="17"/>
              <line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
          </button>
        </div>

        {/* Separator */}
        <div className="h-px w-8 bg-gray-200 my-2" />

        {/* Zoom controls */}
        <div className="flex flex-col items-center space-y-1">
          <button
            onClick={onZoomIn}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
            title="Zoom In"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
              <line x1="11" y1="8" x2="11" y2="14"/>
              <line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          </button>
          <span className="text-xs text-gray-500 py-1 min-w-[2.5rem] text-center font-medium">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={onZoomOut}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
            title="Zoom Out"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
              <line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
