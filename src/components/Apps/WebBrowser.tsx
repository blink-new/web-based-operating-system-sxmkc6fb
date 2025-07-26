import React, { useState } from 'react';

const WebBrowser: React.FC = () => {
  const [url, setUrl] = useState('https://www.google.com');
  const [currentUrl, setCurrentUrl] = useState('https://www.google.com');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<string[]>(['https://www.google.com']);
  const [historyIndex, setHistoryIndex] = useState(0);

  const handleNavigate = () => {
    if (url.trim()) {
      let fullUrl = url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        fullUrl = 'https://' + url;
      }
      
      setIsLoading(true);
      setCurrentUrl(fullUrl);
      
      // Add to history
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(fullUrl);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      
      // Simulate loading
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const newUrl = history[newIndex];
      setUrl(newUrl);
      setCurrentUrl(newUrl);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const newUrl = history[newIndex];
      setUrl(newUrl);
      setCurrentUrl(newUrl);
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNavigate();
    }
  };

  const quickLinks = [
    { name: 'Google', url: 'https://www.google.com' },
    { name: 'GitHub', url: 'https://github.com' },
    { name: 'Stack Overflow', url: 'https://stackoverflow.com' },
    { name: 'MDN', url: 'https://developer.mozilla.org' },
    { name: 'YouTube', url: 'https://www.youtube.com' },
    { name: 'Wikipedia', url: 'https://www.wikipedia.org' },
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Navigation Bar */}
      <div className="flex items-center p-2 border-b border-gray-200 bg-gray-50">
        <button
          onClick={handleBack}
          disabled={historyIndex <= 0}
          className="p-2 text-gray-600 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed"
          title="Back"
        >
          ←
        </button>
        <button
          onClick={handleForward}
          disabled={historyIndex >= history.length - 1}
          className="p-2 text-gray-600 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed mr-2"
          title="Forward"
        >
          →
        </button>
        <button
          onClick={handleRefresh}
          className="p-2 text-gray-600 hover:text-gray-800 mr-2"
          title="Refresh"
        >
          ↻
        </button>
        
        <div className="flex-1 flex items-center">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-3 py-1 border border-gray-300 rounded-l text-sm"
            placeholder="Enter URL or search..."
          />
          <button
            onClick={handleNavigate}
            className="px-4 py-1 bg-blue-500 text-white hover:bg-blue-600 rounded-r text-sm"
          >
            Go
          </button>
        </div>
      </div>

      {/* Quick Links */}
      <div className="flex items-center p-2 border-b border-gray-200 bg-gray-50">
        <span className="text-xs text-gray-500 mr-3">Quick Links:</span>
        {quickLinks.map((link) => (
          <button
            key={link.name}
            onClick={() => {
              setUrl(link.url);
              setCurrentUrl(link.url);
            }}
            className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded mr-2"
          >
            {link.name}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 relative bg-gray-100">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
            <div className="text-center p-8">
              <div className="text-6xl mb-4">🚫</div>
              <h2 className="text-2xl font-bold mb-2 text-red-400">ERR_BLOCKED_BY_RESPONSE</h2>
              <h3 className="text-xl mb-4">{currentUrl.toUpperCase()} IS BLOCKED</h3>
              <p className="text-gray-300 mb-6">
                This website cannot be displayed in an embedded frame for security reasons.
              </p>
              <div className="space-y-2 text-sm text-gray-400">
                <p>• Most modern websites block iframe embedding</p>
                <p>• This is a security feature to prevent clickjacking</p>
                <p>• Try opening the URL in a new browser tab instead</p>
              </div>
              <button
                onClick={() => window.open(currentUrl, '_blank')}
                className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Open in New Tab
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="p-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-600">
        {isLoading ? 'Loading...' : `Loaded: ${currentUrl}`}
      </div>
    </div>
  );
};

export default WebBrowser;