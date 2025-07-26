import React, { useState, useRef, useEffect } from 'react';
import Desktop from './Desktop/Desktop';
import Taskbar from './Taskbar/Taskbar';
import WindowManager from './WindowManager/WindowManager';
import { WindowData } from '../types/window';
import { AppData } from '../types/app';

const WebOS: React.FC = () => {
  const [windows, setWindows] = useState<WindowData[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const windowIdCounter = useRef(0);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const focusWindow = (windowId: string) => {
    const maxZ = Math.max(...windows.map(w => w.zIndex), 0);
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, zIndex: maxZ + 1 } : w
    ));
    setActiveWindowId(windowId);
  };

  const restoreWindow = (windowId: string) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, isMinimized: false } : w
    ));
    setActiveWindowId(windowId);
  };

  const openApp = (app: AppData) => {
    // Check if app is already open
    const existingWindow = windows.find(w => w.app.id === app.id);
    if (existingWindow) {
      focusWindow(existingWindow.id);
      if (existingWindow.isMinimized) {
        restoreWindow(existingWindow.id);
      }
      return;
    }

    const windowId = `window-${windowIdCounter.current++}`;
    const newWindow: WindowData = {
      id: windowId,
      app,
      position: { x: 100 + (windows.length * 30), y: 100 + (windows.length * 30) },
      size: { width: 800, height: 600 },
      isMinimized: false,
      isMaximized: false,
      zIndex: windows.length + 1,
    };
    
    setWindows(prev => [...prev, newWindow]);
    setActiveWindowId(windowId);
  };

  const closeWindow = (windowId: string) => {
    setWindows(prev => prev.filter(w => w.id !== windowId));
    if (activeWindowId === windowId) {
      const remainingWindows = windows.filter(w => w.id !== windowId);
      setActiveWindowId(remainingWindows.length > 0 ? remainingWindows[remainingWindows.length - 1].id : null);
    }
  };

  const minimizeWindow = (windowId: string) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, isMinimized: true } : w
    ));
    if (activeWindowId === windowId) {
      const visibleWindows = windows.filter(w => w.id !== windowId && !w.isMinimized);
      setActiveWindowId(visibleWindows.length > 0 ? visibleWindows[visibleWindows.length - 1].id : null);
    }
  };

  const maximizeWindow = (windowId: string) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, isMaximized: !w.isMaximized } : w
    ));
  };



  const updateWindowPosition = (windowId: string, position: { x: number; y: number }) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, position } : w
    ));
  };

  const updateWindowSize = (windowId: string, size: { width: number; height: number }) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, size } : w
    ));
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 relative">
      {/* Desktop */}
      <Desktop onAppOpen={openApp} />
      
      {/* Window Manager */}
      <WindowManager
        windows={windows}
        activeWindowId={activeWindowId}
        onClose={closeWindow}
        onMinimize={minimizeWindow}
        onMaximize={maximizeWindow}
        onFocus={focusWindow}
        onPositionChange={updateWindowPosition}
        onSizeChange={updateWindowSize}
      />
      
      {/* Taskbar */}
      <Taskbar
        windows={windows}
        currentTime={currentTime}
        onAppOpen={openApp}
        onWindowRestore={restoreWindow}
        onWindowFocus={focusWindow}
      />
    </div>
  );
};

export default WebOS;