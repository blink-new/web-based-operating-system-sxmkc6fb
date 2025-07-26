import React, { useState } from 'react';
import StartMenu from './StartMenu';
import TaskbarButton from './TaskbarButton';
import SystemTray from './SystemTray';
import { WindowData } from '../../types/window';
import { AppData } from '../../types/app';

interface TaskbarProps {
  windows: WindowData[];
  currentTime: Date;
  onAppOpen: (app: AppData) => void;
  onWindowRestore: (windowId: string) => void;
  onWindowFocus: (windowId: string) => void;
}

const Taskbar: React.FC<TaskbarProps> = ({
  windows,
  currentTime,
  onAppOpen,
  onWindowRestore,
  onWindowFocus,
}) => {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

  const handleTaskbarButtonClick = (window: WindowData) => {
    if (window.isMinimized) {
      onWindowRestore(window.id);
    } else {
      onWindowFocus(window.id);
    }
  };

  return (
    <>
      {/* Start Menu */}
      {isStartMenuOpen && (
        <StartMenu
          onAppOpen={onAppOpen}
          onClose={() => setIsStartMenuOpen(false)}
        />
      )}
      
      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gray-900/90 backdrop-blur-sm border-t border-gray-700/50 flex items-center px-2 z-50">
        {/* Start Button */}
        <button
          className={`
            flex items-center justify-center w-10 h-8 rounded mr-2
            transition-colors duration-200
            ${isStartMenuOpen 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-200'
            }
          `}
          onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
        >
          <span className="text-lg">⊞</span>
        </button>

        {/* Running Applications */}
        <div className="flex-1 flex items-center space-x-1">
          {windows.map((window) => (
            <TaskbarButton
              key={window.id}
              window={window}
              onClick={() => handleTaskbarButtonClick(window)}
            />
          ))}
        </div>

        {/* System Tray */}
        <SystemTray currentTime={currentTime} />
      </div>
    </>
  );
};

export default Taskbar;