import React from 'react';
import { AppData } from '../../types/app';
import FileManager from './FileManager';
import TextEditor from './TextEditor';
import Calculator from './Calculator';
import WebBrowser from './WebBrowser';
import Terminal from './Terminal';
import Settings from './Settings';
import SystemMonitor from './SystemMonitor';
import Clock from './Clock';
import CodeEditor from './CodeEditor';
import Notes from './Notes';
import Calendar from './Calendar';
import Email from './Email';
import HtmlViewer from './HtmlViewer';
import PdfReader from './PdfReader';
import MusicPlayer from './MusicPlayer';
import VideoPlayer from './VideoPlayer';

interface AppContentProps {
  app: AppData;
}

const AppContent: React.FC<AppContentProps> = ({ app }) => {
  const renderApp = () => {
    switch (app.id) {
      case 'file-manager':
        return <FileManager />;
      case 'text-editor':
        return <TextEditor />;
      case 'calculator':
        return <Calculator />;
      case 'web-browser':
        return <WebBrowser />;
      case 'terminal':
        return <Terminal />;
      case 'settings':
        return <Settings />;
      case 'system-monitor':
        return <SystemMonitor />;
      case 'clock':
        return <Clock />;
      case 'code-editor':
        return <CodeEditor />;
      case 'notes':
        return <Notes />;
      case 'calendar':
        return <Calendar />;
      case 'email':
        return <Email />;
      case 'html-viewer':
        return <HtmlViewer />;
      case 'pdf-reader':
        return <PdfReader />;
      case 'music-player':
        return <MusicPlayer />;
      case 'video-player':
        return <VideoPlayer />;
      default:
        return (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <div className="text-center">
              <div className="text-6xl mb-4">{app.icon}</div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">{app.name}</h2>
              <p className="text-gray-500">{app.description}</p>
              <p className="text-sm text-gray-400 mt-4">App coming soon...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full w-full">
      {renderApp()}
    </div>
  );
};

export default AppContent;