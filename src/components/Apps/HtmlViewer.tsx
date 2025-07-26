import React, { useState } from 'react';

const HtmlViewer: React.FC = () => {
  const [htmlContent, setHtmlContent] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sample HTML Document</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.1);
            padding: 30px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
        }
        h1 { color: #fff; text-align: center; }
        h2 { color: #f0f0f0; border-bottom: 2px solid #fff; padding-bottom: 5px; }
        .highlight { background: rgba(255, 255, 0, 0.3); padding: 2px 4px; border-radius: 3px; }
        .card { background: rgba(255, 255, 255, 0.2); padding: 15px; margin: 10px 0; border-radius: 8px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌐 Welcome to HTML Viewer</h1>
        <h2>Features</h2>
        <div class="card">
            <p>This HTML viewer supports:</p>
            <ul>
                <li><span class="highlight">Live HTML editing</span></li>
                <li>Real-time preview</li>
                <li>Syntax highlighting</li>
                <li>Responsive design</li>
            </ul>
        </div>
        <h2>Sample Content</h2>
        <div class="card">
            <p>You can edit the HTML code in the editor and see the changes instantly in the preview pane.</p>
            <p>Try modifying the code to see how it affects the rendered output!</p>
        </div>
    </div>
</body>
</html>`);

  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('preview');

  const sampleTemplates = [
    {
      name: 'Landing Page',
      content: `<!DOCTYPE html>
<html>
<head>
    <title>Landing Page</title>
    <style>
        body { margin: 0; font-family: Arial, sans-serif; }
        .hero { background: linear-gradient(45deg, #3498db, #2c3e50); color: white; padding: 100px 20px; text-align: center; }
        .hero h1 { font-size: 3em; margin-bottom: 20px; }
        .btn { background: #e74c3c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="hero">
        <h1>Welcome to Our Product</h1>
        <p>The best solution for your needs</p>
        <a href="#" class="btn">Get Started</a>
    </div>
</body>
</html>`
    },
    {
      name: 'Portfolio',
      content: `<!DOCTYPE html>
<html>
<head>
    <title>Portfolio</title>
    <style>
        body { margin: 0; font-family: 'Georgia', serif; background: #f8f9fa; }
        .header { background: #2c3e50; color: white; padding: 50px 20px; text-align: center; }
        .projects { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; padding: 40px 20px; }
        .project { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    </style>
</head>
<body>
    <div class="header">
        <h1>John Doe</h1>
        <p>Web Developer & Designer</p>
    </div>
    <div class="projects">
        <div class="project">
            <h3>Project 1</h3>
            <p>Description of the first project</p>
        </div>
        <div class="project">
            <h3>Project 2</h3>
            <p>Description of the second project</p>
        </div>
    </div>
</body>
</html>`
    }
  ];

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold">HTML Viewer</h2>
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1 rounded text-sm ${
                activeTab === 'editor' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              Editor
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded text-sm ${
                activeTab === 'preview' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              Preview
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            onChange={(e) => {
              const template = sampleTemplates.find(t => t.name === e.target.value);
              if (template) setHtmlContent(template.content);
            }}
            className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-sm"
          >
            <option value="">Load Template</option>
            {sampleTemplates.map(template => (
              <option key={template.name} value={template.name}>
                {template.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => setHtmlContent('')}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex">
        {activeTab === 'editor' ? (
          /* HTML Editor */
          <div className="flex-1 flex flex-col">
            <div className="p-2 bg-gray-800 border-b border-gray-700">
              <span className="text-sm text-gray-400">HTML Code Editor</span>
            </div>
            <textarea
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
              className="flex-1 p-4 bg-gray-900 text-green-400 font-mono text-sm resize-none outline-none"
              placeholder="Enter your HTML code here..."
              spellCheck={false}
            />
          </div>
        ) : (
          /* HTML Preview */
          <div className="flex-1 flex flex-col">
            <div className="p-2 bg-gray-800 border-b border-gray-700">
              <span className="text-sm text-gray-400">Live Preview</span>
            </div>
            <div className="flex-1 bg-white">
              <iframe
                srcDoc={htmlContent}
                className="w-full h-full border-0"
                title="HTML Preview"
                sandbox="allow-scripts"
              />
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="p-2 bg-gray-800 border-t border-gray-700 text-xs text-gray-400">
        <div className="flex justify-between">
          <span>Lines: {htmlContent.split('\n').length}</span>
          <span>Characters: {htmlContent.length}</span>
          <span>Mode: {activeTab === 'editor' ? 'Edit' : 'Preview'}</span>
        </div>
      </div>
    </div>
  );
};

export default HtmlViewer;