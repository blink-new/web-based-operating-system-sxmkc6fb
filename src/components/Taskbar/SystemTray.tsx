import React from 'react';

interface SystemTrayProps {
  currentTime: Date;
}

const SystemTray: React.FC<SystemTrayProps> = ({ currentTime }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex items-center space-x-3 text-white">
      {/* System Icons */}
      <div className="flex items-center space-x-2 text-gray-300">
        <button className="hover:text-white transition-colors duration-200" title="Network">
          📶
        </button>
        <button className="hover:text-white transition-colors duration-200" title="Volume">
          🔊
        </button>
        <button className="hover:text-white transition-colors duration-200" title="Battery">
          🔋
        </button>
      </div>

      {/* Clock */}
      <div className="text-right">
        <div className="text-sm font-medium">{formatTime(currentTime)}</div>
        <div className="text-xs text-gray-300">{formatDate(currentTime)}</div>
      </div>
    </div>
  );
};

export default SystemTray;