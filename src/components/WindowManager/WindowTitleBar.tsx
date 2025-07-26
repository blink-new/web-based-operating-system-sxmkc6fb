import React from 'react';
import { AppData } from '../../types/app';

interface WindowTitleBarProps {
  app: AppData;
  isActive: boolean;
  isMaximized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onDragStart: (e: React.MouseEvent) => void;
}

const WindowTitleBar: React.FC<WindowTitleBarProps> = ({
  app,
  isActive,
  isMaximized,
  onClose,
  onMinimize,
  onMaximize,
  onDragStart,
}) => {
  return (
    <div
      className={`
        window-titlebar flex items-center justify-between h-8 px-3 cursor-move select-none
        ${isActive 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-300 text-gray-700'
        }
        ${isMaximized ? 'cursor-default' : 'cursor-move'}
      `}
      onMouseDown={onDragStart}
    >
      {/* App Info */}
      <div className="flex items-center space-x-2">
        <span className="text-sm">{app.icon}</span>
        <span className="text-sm font-medium">{app.name}</span>
      </div>

      {/* Window Controls */}
      <div className="flex items-center space-x-1">
        <button
          className="w-6 h-6 rounded hover:bg-black/20 flex items-center justify-center text-xs"
          onClick={(e) => {
            e.stopPropagation();
            onMinimize();
          }}
          title="Minimize"
        >
          −
        </button>
        <button
          className="w-6 h-6 rounded hover:bg-black/20 flex items-center justify-center text-xs"
          onClick={(e) => {
            e.stopPropagation();
            onMaximize();
          }}
          title={isMaximized ? "Restore" : "Maximize"}
        >
          {isMaximized ? '❐' : '□'}
        </button>
        <button
          className="w-6 h-6 rounded hover:bg-red-500 flex items-center justify-center text-xs"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          title="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default WindowTitleBar;