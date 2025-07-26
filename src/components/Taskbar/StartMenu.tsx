import React from 'react';
import { AppData } from '../../types/app';
import { apps } from '../../data/apps';

interface StartMenuProps {
  onAppOpen: (app: AppData) => void;
  onClose: () => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ onAppOpen, onClose }) => {
  const categories = {
    system: 'System',
    productivity: 'Productivity',
    media: 'Media',
    development: 'Development',
    utilities: 'Utilities'
  };

  const handleAppClick = (app: AppData) => {
    onAppOpen(app);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Start Menu */}
      <div className="absolute bottom-12 left-2 w-80 bg-gray-800/95 backdrop-blur-md rounded-lg shadow-2xl border border-gray-600/50 z-50">
        <div className="p-4">
          <h2 className="text-white text-lg font-semibold mb-4">WebOS</h2>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {Object.entries(categories).map(([categoryId, categoryName]) => {
              const categoryApps = apps.filter(app => app.category === categoryId);
              if (categoryApps.length === 0) return null;
              
              return (
                <div key={categoryId}>
                  <h3 className="text-gray-300 text-sm font-medium mb-2">{categoryName}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {categoryApps.map((app) => (
                      <button
                        key={app.id}
                        className="flex items-center p-2 rounded-lg hover:bg-gray-700/50 transition-colors duration-200 text-left"
                        onClick={() => handleAppClick(app)}
                      >
                        <span className="text-2xl mr-3">{app.icon}</span>
                        <div>
                          <div className="text-white text-sm font-medium">{app.name}</div>
                          <div className="text-gray-400 text-xs">{app.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default StartMenu;