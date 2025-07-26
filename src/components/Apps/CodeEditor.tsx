import React, { useState, useRef, useEffect } from 'react';
import { Save, Play, FileText, Folder, Search, Settings, Download, Upload, Terminal, Bug, GitBranch } from 'lucide-react';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
  parent?: string;
  language?: string;
}

interface Tab {
  id: string;
  name: string;
  content: string;
  language: string;
  modified: boolean;
}

const CodeEditor: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalHeight, setTerminalHeight] = useState(200);
  const [fontSize, setFontSize] = useState(14);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Demo file structure
  const [fileTree] = useState<FileNode[]>([
    {
      id: '1',
      name: 'src',
      type: 'folder',
      children: [
        {
          id: '2',
          name: 'components',
          type: 'folder',
          children: [
            {
              id: '3',
              name: 'App.tsx',
              type: 'file',
              language: 'typescript',
              content: `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to WebOS Code Editor</h1>
        <p>
          A powerful code editor with syntax highlighting,
          file management, and integrated terminal.
        </p>
        <button onClick={() => console.log('Hello WebOS!')}>
          Click me!
        </button>
      </header>
    </div>
  );
}

export default App;`
            },
            {
              id: '4',
              name: 'Button.tsx',
              type: 'file',
              language: 'typescript',
              content: `import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false
}) => {
  const baseClasses = 'px-4 py-2 rounded font-medium transition-colors';
  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300'
  };

  return (
    <button
      className={\`\${baseClasses} \${variantClasses[variant]}\`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;`
            }
          ]
        },
        {
          id: '5',
          name: 'utils',
          type: 'folder',
          children: [
            {
              id: '6',
              name: 'helpers.ts',
              type: 'file',
              language: 'typescript',
              content: `// Utility functions for the application

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};`
            }
          ]
        },
        {
          id: '7',
          name: 'styles',
          type: 'folder',
          children: [
            {
              id: '8',
              name: 'globals.css',
              type: 'file',
              language: 'css',
              content: `/* Global styles for the application */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
    'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
    'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f5f5f5;
  color: #333;
}

.App {
  text-align: center;
}

.App-header {
  background-color: #282c34;
  padding: 20px;
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

button {
  background-color: #61dafb;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin: 10px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #21a9c7;
}`
            }
          ]
        }
      ]
    },
    {
      id: '9',
      name: 'package.json',
      type: 'file',
      language: 'json',
      content: `{
  "name": "webos-app",
  "version": "1.0.0",
  "description": "A WebOS application",
  "main": "index.js",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "typescript": "^4.9.5"
  },
  "devDependencies": {
    "@types/react": "^18.0.28",
    "@types/react-dom": "^18.0.11"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}`
    },
    {
      id: '10',
      name: 'README.md',
      type: 'file',
      language: 'markdown',
      content: `# WebOS Application

Welcome to the WebOS Code Editor demo application!

## Features

- 🚀 Fast and responsive code editing
- 🎨 Syntax highlighting for multiple languages
- 📁 File explorer with folder navigation
- 🔍 Search and replace functionality
- 💾 Auto-save and manual save options
- 🖥️ Integrated terminal
- 🎯 Multiple tabs support
- 🌙 Dark and light themes

## Getting Started

1. Open files from the file explorer
2. Edit code with syntax highlighting
3. Use Ctrl+S to save changes
4. Run code with the play button
5. Use the integrated terminal for commands

## Keyboard Shortcuts

- \`Ctrl+S\` - Save file
- \`Ctrl+F\` - Find in file
- \`Ctrl+N\` - New file
- \`Ctrl+O\` - Open file
- \`Ctrl+\`\` - Toggle terminal

## Supported Languages

- TypeScript/JavaScript
- HTML/CSS
- JSON
- Markdown
- Python
- And many more!

Happy coding! 🎉`
    }
  ]);

  const getLanguageFromExtension = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const languageMap: { [key: string]: string } = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'json': 'json',
      'md': 'markdown',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'php': 'php',
      'rb': 'ruby',
      'go': 'go',
      'rs': 'rust',
      'xml': 'xml',
      'yaml': 'yaml',
      'yml': 'yaml'
    };
    return languageMap[ext || ''] || 'text';
  };

  const openFile = (file: FileNode) => {
    if (file.type === 'file' && file.content !== undefined) {
      const existingTab = tabs.find(tab => tab.id === file.id);
      if (existingTab) {
        setActiveTab(file.id);
      } else {
        const newTab: Tab = {
          id: file.id,
          name: file.name,
          content: file.content,
          language: file.language || getLanguageFromExtension(file.name),
          modified: false
        };
        setTabs(prev => [...prev, newTab]);
        setActiveTab(file.id);
      }
    }
  };

  const closeTab = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab?.modified) {
      if (!confirm(`${tab.name} has unsaved changes. Close anyway?`)) {
        return;
      }
    }
    
    setTabs(prev => prev.filter(t => t.id !== tabId));
    if (activeTab === tabId) {
      const remainingTabs = tabs.filter(t => t.id !== tabId);
      setActiveTab(remainingTabs.length > 0 ? remainingTabs[remainingTabs.length - 1].id : null);
    }
  };

  const updateTabContent = (content: string) => {
    if (activeTab) {
      setTabs(prev => prev.map(tab => 
        tab.id === activeTab 
          ? { ...tab, content, modified: true }
          : tab
      ));
    }
  };

  const saveCurrentTab = () => {
    if (activeTab) {
      setTabs(prev => prev.map(tab => 
        tab.id === activeTab 
          ? { ...tab, modified: false }
          : tab
      ));
      
      // In a real app, this would save to the file system
      const tab = tabs.find(t => t.id === activeTab);
      if (tab) {
        const blob = new Blob([tab.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = tab.name;
        a.click();
        URL.revokeObjectURL(url);
      }
    }
  };

  const runCode = () => {
    const tab = tabs.find(t => t.id === activeTab);
    if (tab) {
      if (tab.language === 'javascript' || tab.language === 'typescript') {
        try {
          // In a real app, this would execute in a sandboxed environment
          console.log('Running code:', tab.name);
          eval(tab.content);
        } catch (error) {
          console.error('Code execution error:', error);
        }
      } else {
        console.log(`Code execution not supported for ${tab.language}`);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 's':
          e.preventDefault();
          saveCurrentTab();
          break;
        case 'f':
          e.preventDefault();
          setShowSearch(!showSearch);
          break;
        case '`':
          e.preventDefault();
          setShowTerminal(!showTerminal);
          break;
      }
    }
  };

  const renderFileTree = (nodes: FileNode[], level = 0): React.ReactNode => {
    return nodes.map(node => (
      <div key={node.id} style={{ marginLeft: `${level * 16}px` }}>
        <div
          className="flex items-center py-1 px-2 hover:bg-gray-700 cursor-pointer text-sm"
          onClick={() => node.type === 'file' && openFile(node)}
        >
          {node.type === 'folder' ? (
            <Folder className="w-4 h-4 mr-2 text-blue-400" />
          ) : (
            <FileText className="w-4 h-4 mr-2 text-gray-400" />
          )}
          <span className="truncate">{node.name}</span>
        </div>
        {node.children && renderFileTree(node.children, level + 1)}
      </div>
    ));
  };

  const currentTab = tabs.find(tab => tab.id === activeTab);

  return (
    <div className={`h-full flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".js,.jsx,.ts,.tsx,.html,.css,.json,.md,.py,.java,.cpp,.c,.php,.rb,.go,.rs,.xml,.yaml,.yml"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const content = e.target?.result as string;
              const newTab: Tab = {
                id: Date.now().toString(),
                name: file.name,
                content,
                language: getLanguageFromExtension(file.name),
                modified: false
              };
              setTabs(prev => [...prev, newTab]);
              setActiveTab(newTab.id);
            };
            reader.readAsText(file);
          }
        }}
        className="hidden"
      />

      {/* Menu Bar */}
      <div className={`flex items-center justify-between p-2 border-b ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded hover:bg-gray-700 flex items-center space-x-1"
            title="Open File (Ctrl+O)"
          >
            <Upload className="w-4 h-4" />
            <span className="text-sm">Open</span>
          </button>
          <button
            onClick={saveCurrentTab}
            disabled={!currentTab?.modified}
            className="p-2 rounded hover:bg-gray-700 flex items-center space-x-1 disabled:opacity-50"
            title="Save (Ctrl+S)"
          >
            <Save className="w-4 h-4" />
            <span className="text-sm">Save</span>
          </button>
          <button
            onClick={runCode}
            disabled={!currentTab}
            className="p-2 rounded hover:bg-gray-700 flex items-center space-x-1 disabled:opacity-50"
            title="Run Code"
          >
            <Play className="w-4 h-4" />
            <span className="text-sm">Run</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 rounded hover:bg-gray-700"
            title="Search (Ctrl+F)"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowTerminal(!showTerminal)}
            className="p-2 rounded hover:bg-gray-700"
            title="Terminal (Ctrl+`)"
          >
            <Terminal className="w-4 h-4" />
          </button>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as 'dark' | 'light')}
            className={`px-2 py-1 rounded text-sm ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className={`p-2 border-b ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
          <input
            type="text"
            placeholder="Search in file..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full px-3 py-1 rounded text-sm ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
            autoFocus
          />
        </div>
      )}

      <div className="flex flex-1 min-h-0">
        {/* File Explorer */}
        <div 
          className={`border-r ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}
          style={{ width: sidebarWidth }}
        >
          <div className="p-3 border-b border-gray-700">
            <h3 className="font-semibold text-sm flex items-center">
              <Folder className="w-4 h-4 mr-2" />
              Explorer
            </h3>
          </div>
          <div className="overflow-y-auto">
            {renderFileTree(fileTree)}
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          {tabs.length > 0 && (
            <div className={`flex border-b ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
              {tabs.map(tab => (
                <div
                  key={tab.id}
                  className={`flex items-center px-3 py-2 border-r cursor-pointer text-sm ${
                    activeTab === tab.id 
                      ? theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
                      : theme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  } ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="truncate max-w-32">
                    {tab.name}
                    {tab.modified && <span className="text-orange-500 ml-1">•</span>}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTab(tab.id);
                    }}
                    className="ml-2 hover:bg-gray-600 rounded p-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Editor */}
          <div className="flex-1 relative">
            {currentTab ? (
              <div className="h-full flex">
                {/* Line Numbers */}
                <div className={`w-12 p-2 text-right text-xs font-mono ${theme === 'dark' ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-400'} border-r ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                  {currentTab.content.split('\n').map((_, index) => (
                    <div key={index} className="leading-6">
                      {index + 1}
                    </div>
                  ))}
                </div>

                {/* Code Editor */}
                <textarea
                  ref={editorRef}
                  value={currentTab.content}
                  onChange={(e) => updateTabContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={`flex-1 p-4 font-mono resize-none outline-none leading-6 ${
                    theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
                  }`}
                  style={{ fontSize: `${fontSize}px` }}
                  spellCheck={false}
                />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">No file open</p>
                  <p className="text-sm">Select a file from the explorer or open a new file</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Terminal */}
      {showTerminal && (
        <div 
          className={`border-t ${theme === 'dark' ? 'border-gray-700 bg-black' : 'border-gray-200 bg-gray-900'} text-green-400 font-mono text-sm`}
          style={{ height: terminalHeight }}
        >
          <div className="p-2 border-b border-gray-700 flex items-center justify-between">
            <span className="text-white">Terminal</span>
            <button
              onClick={() => setShowTerminal(false)}
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>
          <div className="p-2 h-full overflow-y-auto">
            <div>WebOS Terminal v1.0</div>
            <div>Type 'help' for available commands.</div>
            <div className="flex">
              <span className="text-blue-400">webos@editor</span>
              <span className="text-white">:</span>
              <span className="text-blue-400">~</span>
              <span className="text-white">$ </span>
              <input
                type="text"
                className="flex-1 bg-transparent outline-none text-green-400"
                placeholder="Enter command..."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;