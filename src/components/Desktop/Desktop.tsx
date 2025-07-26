import React from 'react';
import DesktopIcon from './DesktopIcon';
import { AppData } from '../../types/app';
import { apps } from '../../data/apps';

interface DesktopProps {
  onAppOpen: (app: AppData) => void;
}

const Desktop: React.FC<DesktopProps> = ({ onAppOpen }) => {
  // Show only a subset of apps on desktop (most commonly used)
  const desktopApps = apps.filter(app => 
    ['file-manager', 'text-editor', 'web-browser', 'calculator', 'terminal', 'settings'].includes(app.id)
  );

  return (
    <div className="absolute inset-0 p-4 pb-16">
      <div className="grid grid-cols-8 gap-4 h-full content-start">
        {desktopApps.map((app) => (
          <DesktopIcon
            key={app.id}
            app={app}
            onDoubleClick={() => onAppOpen(app)}
          />
        ))}
      </div>
    </div>
  );
};

export default Desktop;