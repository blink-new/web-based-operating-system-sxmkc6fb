import React from 'react';
import Window from './Window';
import { WindowData } from '../../types/window';

interface WindowManagerProps {
  windows: WindowData[];
  activeWindowId: string | null;
  onClose: (windowId: string) => void;
  onMinimize: (windowId: string) => void;
  onMaximize: (windowId: string) => void;
  onFocus: (windowId: string) => void;
  onPositionChange: (windowId: string, position: { x: number; y: number }) => void;
  onSizeChange: (windowId: string, size: { width: number; height: number }) => void;
}

const WindowManager: React.FC<WindowManagerProps> = ({
  windows,
  activeWindowId,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onPositionChange,
  onSizeChange,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {windows
        .filter(window => !window.isMinimized)
        .sort((a, b) => a.zIndex - b.zIndex)
        .map((window) => (
          <Window
            key={window.id}
            window={window}
            isActive={window.id === activeWindowId}
            onClose={() => onClose(window.id)}
            onMinimize={() => onMinimize(window.id)}
            onMaximize={() => onMaximize(window.id)}
            onFocus={() => onFocus(window.id)}
            onPositionChange={(position) => onPositionChange(window.id, position)}
            onSizeChange={(size) => onSizeChange(window.id, size)}
          />
        ))}
    </div>
  );
};

export default WindowManager;