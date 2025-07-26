import React, { useRef, useEffect } from 'react';
import WindowTitleBar from './WindowTitleBar';
import AppContent from '../Apps/AppContent';
import { WindowData } from '../../types/window';

interface WindowProps {
  window: WindowData;
  isActive: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  onSizeChange: (size: { width: number; height: number }) => void;
}

const Window: React.FC<WindowProps> = ({
  window,
  isActive,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onPositionChange,
  onSizeChange,
}) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const isResizing = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.window-titlebar')) {
      onFocus();
    }
  };

  const handleDragStart = (e: React.MouseEvent) => {
    if (window.isMaximized) return;
    
    isDragging.current = true;
    dragStart.current = {
      x: e.clientX - window.position.x,
      y: e.clientY - window.position.y,
    };
    
    e.preventDefault();
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    if (window.isMaximized) return;
    
    isResizing.current = true;
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      width: window.size.width,
      height: window.size.height,
    };
    
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        const newX = Math.max(0, Math.min(globalThis.innerWidth - window.size.width, e.clientX - dragStart.current.x));
        const newY = Math.max(0, Math.min(globalThis.innerHeight - 100, e.clientY - dragStart.current.y));
        
        onPositionChange({ x: newX, y: newY });
      } else if (isResizing.current) {
        const deltaX = e.clientX - resizeStart.current.x;
        const deltaY = e.clientY - resizeStart.current.y;
        
        const newWidth = Math.max(300, resizeStart.current.width + deltaX);
        const newHeight = Math.max(200, resizeStart.current.height + deltaY);
        
        onSizeChange({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      isResizing.current = false;
    };

    if (isDragging.current || isResizing.current) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [window.position, window.size, onPositionChange, onSizeChange]);

  const windowStyle = window.isMaximized
    ? {
        left: 0,
        top: 0,
        width: '100vw',
        height: 'calc(100vh - 48px)', // Account for taskbar
        zIndex: window.zIndex,
      }
    : {
        left: window.position.x,
        top: window.position.y,
        width: window.size.width,
        height: window.size.height,
        zIndex: window.zIndex,
      };

  return (
    <div
      ref={windowRef}
      className={`
        absolute bg-white rounded-lg shadow-2xl overflow-hidden pointer-events-auto
        ${isActive ? 'ring-2 ring-blue-500/50' : ''}
        ${window.isMaximized ? 'rounded-none' : ''}
      `}
      style={windowStyle}
      onMouseDown={handleMouseDown}
    >
      {/* Title Bar */}
      <WindowTitleBar
        app={window.app}
        isActive={isActive}
        isMaximized={window.isMaximized}
        onClose={onClose}
        onMinimize={onMinimize}
        onMaximize={onMaximize}
        onDragStart={handleDragStart}
      />

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <AppContent app={window.app} />
      </div>

      {/* Resize Handle */}
      {!window.isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={handleResizeStart}
        >
          <div className="absolute bottom-1 right-1 w-2 h-2 bg-gray-400 transform rotate-45" />
        </div>
      )}
    </div>
  );
};

export default Window;