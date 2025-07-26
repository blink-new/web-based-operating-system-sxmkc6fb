import React from 'react';
import { WindowData } from '../../types/window';

interface TaskbarButtonProps {
  window: WindowData;
  onClick: () => void;
}

const TaskbarButton: React.FC<TaskbarButtonProps> = ({ window, onClick }) => {
  return (
    <button
      className={`
        flex items-center px-3 py-1 rounded transition-colors duration-200 max-w-48
        ${window.isMinimized 
          ? 'bg-gray-600/50 text-gray-300' 
          : 'bg-blue-600/80 text-white'
        }
        hover:bg-blue-500/80
      `}
      onClick={onClick}
      title={window.app.name}
    >
      <span className="text-sm mr-2">{window.app.icon}</span>
      <span className="text-sm font-medium truncate">{window.app.name}</span>
    </button>
  );
};

export default TaskbarButton;