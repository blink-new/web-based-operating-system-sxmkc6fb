import React, { useState } from 'react';
import { AppData } from '../../types/app';

interface DesktopIconProps {
  app: AppData;
  onDoubleClick: () => void;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ app, onDoubleClick }) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => {
    setIsSelected(true);
    setTimeout(() => setIsSelected(false), 200);
  };

  return (
    <div
      className={`
        flex flex-col items-center justify-center p-2 rounded-lg cursor-pointer
        transition-all duration-200 hover:bg-white/20 select-none
        ${isSelected ? 'bg-white/30 scale-95' : ''}
      `}
      onClick={handleClick}
      onDoubleClick={onDoubleClick}
    >
      <div className="text-4xl mb-2 drop-shadow-lg">
        {app.icon}
      </div>
      <span className="text-white text-sm font-medium text-center drop-shadow-md">
        {app.name}
      </span>
    </div>
  );
};

export default DesktopIcon;