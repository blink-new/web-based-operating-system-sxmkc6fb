import { AppData } from '../types/app';

export const apps: AppData[] = [
  // System Apps
  {
    id: 'file-manager',
    name: 'File Manager',
    icon: '📁',
    category: 'system',
    description: 'Browse and manage files and folders'
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: '⚙️',
    category: 'system',
    description: 'System settings and preferences'
  },
  {
    id: 'terminal',
    name: 'Terminal',
    icon: '💻',
    category: 'system',
    description: 'Command line interface'
  },
  {
    id: 'system-monitor',
    name: 'System Monitor',
    icon: '📊',
    category: 'system',
    description: 'Monitor system performance and resources'
  },

  // Productivity Apps
  {
    id: 'text-editor',
    name: 'Text Editor',
    icon: '📝',
    category: 'productivity',
    description: 'Simple text editor for documents'
  },
  {
    id: 'code-editor',
    name: 'Code Editor',
    icon: '👨‍💻',
    category: 'development',
    description: 'Advanced code editor with syntax highlighting'
  },
  {
    id: 'notes',
    name: 'Notes',
    icon: '📋',
    category: 'productivity',
    description: 'Quick notes and reminders'
  },
  {
    id: 'calendar',
    name: 'Calendar',
    icon: '📅',
    category: 'productivity',
    description: 'Calendar and scheduling'
  },
  {
    id: 'email',
    name: 'Email',
    icon: '📧',
    category: 'productivity',
    description: 'Email client'
  },

  // Utilities
  {
    id: 'calculator',
    name: 'Calculator',
    icon: '🔢',
    category: 'utilities',
    description: 'Basic calculator for math operations'
  },
  {
    id: 'clock',
    name: 'Clock',
    icon: '🕐',
    category: 'utilities',
    description: 'World clock and timer'
  },
  {
    id: 'web-browser',
    name: 'Web Browser',
    icon: '🌐',
    category: 'utilities',
    description: 'Browse the internet'
  },
  {
    id: 'html-viewer',
    name: 'HTML Viewer',
    icon: '🌍',
    category: 'development',
    description: 'View and preview HTML files'
  },
  {
    id: 'pdf-reader',
    name: 'PDF Reader',
    icon: '📄',
    category: 'utilities',
    description: 'Read PDF documents'
  },

  // Media Apps
  {
    id: 'music-player',
    name: 'Music Player',
    icon: '🎵',
    category: 'media',
    description: 'Play music and audio files'
  },
  {
    id: 'video-player',
    name: 'Video Player',
    icon: '🎬',
    category: 'media',
    description: 'Play video files'
  }
];