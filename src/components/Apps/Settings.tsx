import React, { useState } from 'react';

const Settings: React.FC = () => {
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [language, setLanguage] = useState('en');
  const [fontSize, setFontSize] = useState('medium');

  const settingSections = [
    {
      title: 'Appearance',
      icon: '🎨',
      settings: [
        {
          label: 'Theme',
          type: 'radio',
          value: theme,
          onChange: setTheme,
          options: [
            { value: 'light', label: 'Light Theme' },
            { value: 'dark', label: 'Dark Theme' },
            { value: 'auto', label: 'Auto (System)' }
          ]
        },
        {
          label: 'Font Size',
          type: 'select',
          value: fontSize,
          onChange: setFontSize,
          options: [
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' }
          ]
        },
        {
          label: 'Enable Animations',
          type: 'toggle',
          value: animationsEnabled,
          onChange: setAnimationsEnabled
        }
      ]
    },
    {
      title: 'System',
      icon: '⚙️',
      settings: [
        {
          label: 'Enable Notifications',
          type: 'toggle',
          value: notifications,
          onChange: setNotifications
        },
        {
          label: 'Auto-save Documents',
          type: 'toggle',
          value: autoSave,
          onChange: setAutoSave
        },
        {
          label: 'System Sounds',
          type: 'toggle',
          value: soundEnabled,
          onChange: setSoundEnabled
        },
        {
          label: 'Language',
          type: 'select',
          value: language,
          onChange: setLanguage,
          options: [
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Español' },
            { value: 'fr', label: 'Français' },
            { value: 'de', label: 'Deutsch' }
          ]
        }
      ]
    }
  ];

  const renderSetting = (setting: any) => {
    switch (setting.type) {
      case 'radio':
        return (
          <div className="space-y-2">
            {setting.options.map((option: any) => (
              <label key={option.value} className="flex items-center text-gray-300 hover:text-white cursor-pointer">
                <input
                  type="radio"
                  name={setting.label}
                  value={option.value}
                  checked={setting.value === option.value}
                  onChange={(e) => setting.onChange(e.target.value)}
                  className="mr-3 text-blue-500"
                />
                {option.label}
              </label>
            ))}
          </div>
        );
      
      case 'select':
        return (
          <select
            value={setting.value}
            onChange={(e) => setting.onChange(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
          >
            {setting.options.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'toggle':
        return (
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={setting.value}
                onChange={(e) => setting.onChange(e.target.checked)}
                className="sr-only"
              />
              <div className={`block w-14 h-8 rounded-full ${setting.value ? 'bg-blue-500' : 'bg-gray-600'}`}></div>
              <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${setting.value ? 'transform translate-x-6' : ''}`}></div>
            </div>
            <span className="ml-3 text-gray-300">{setting.label}</span>
          </label>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="h-full bg-gray-900 text-white overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
        <h1 className="text-3xl font-bold">⚙️ System Settings</h1>
        <p className="text-blue-100 mt-2">Customize your WebOS experience</p>
      </div>

      {/* Settings Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {settingSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center mb-6">
                <span className="text-2xl mr-3">{section.icon}</span>
                <h2 className="text-xl font-semibold">{section.title}</h2>
              </div>
              
              <div className="space-y-6">
                {section.settings.map((setting, settingIndex) => (
                  <div key={settingIndex} className="border-b border-gray-700 pb-4 last:border-b-0">
                    <div className="flex flex-col space-y-3">
                      <label className="text-lg font-medium text-gray-200">
                        {setting.label}
                      </label>
                      {renderSetting(setting)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* System Information */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center mb-6">
              <span className="text-2xl mr-3">ℹ️</span>
              <h2 className="text-xl font-semibold">System Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Version:</span>
                  <span className="text-white">WebOS 1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Build:</span>
                  <span className="text-white">2024.01.24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Platform:</span>
                  <span className="text-white">Web Browser</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">User Agent:</span>
                  <span className="text-white text-sm">{navigator.userAgent.split(' ')[0]}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Screen Resolution:</span>
                  <span className="text-white">{screen.width}×{screen.height}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Language:</span>
                  <span className="text-white">{navigator.language}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Online Status:</span>
                  <span className={`${navigator.onLine ? 'text-green-400' : 'text-red-400'}`}>
                    {navigator.onLine ? 'Connected' : 'Offline'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Local Time:</span>
                  <span className="text-white">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
              💾 Save Settings
            </button>
            <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors">
              🔄 Reset to Defaults
            </button>
            <button className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors">
              📤 Export Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;