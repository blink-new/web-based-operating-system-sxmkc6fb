import React, { useState } from 'react';

interface PdfDocument {
  id: string;
  name: string;
  size: string;
  pages: number;
  uploadDate: string;
}

const PdfReader: React.FC = () => {
  const [documents] = useState<PdfDocument[]>([
    {
      id: '1',
      name: 'WebOS User Manual.pdf',
      size: '2.4 MB',
      pages: 45,
      uploadDate: '2024-01-20'
    },
    {
      id: '2',
      name: 'System Architecture.pdf',
      size: '1.8 MB',
      pages: 32,
      uploadDate: '2024-01-18'
    },
    {
      id: '3',
      name: 'API Documentation.pdf',
      size: '3.1 MB',
      pages: 67,
      uploadDate: '2024-01-15'
    }
  ]);
  
  const [selectedDoc, setSelectedDoc] = useState<PdfDocument | null>(documents[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));

  return (
    <div className="h-full flex bg-gray-900 text-white">
      {/* Document List Sidebar */}
      <div className="w-1/4 bg-gray-800 border-r border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">PDF Documents</h2>
          <button className="mt-2 w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm">
            📁 Open PDF
          </button>
        </div>
        
        <div className="overflow-y-auto">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className={`p-3 border-b border-gray-700 cursor-pointer hover:bg-gray-700 ${
                selectedDoc?.id === doc.id ? 'bg-gray-700 border-l-4 border-l-blue-500' : ''
              }`}
              onClick={() => {
                setSelectedDoc(doc);
                setCurrentPage(1);
              }}
            >
              <div className="font-medium text-sm">{doc.name}</div>
              <div className="text-xs text-gray-400 mt-1">
                {doc.pages} pages • {doc.size}
              </div>
              <div className="text-xs text-gray-500">
                {doc.uploadDate}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 flex flex-col">
        {selectedDoc ? (
          <>
            {/* Toolbar */}
            <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">{selectedDoc.name}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Page Navigation */}
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage <= 1}
                  className="px-2 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm"
                >
                  ←
                </button>
                <span className="text-sm">
                  {currentPage} / {selectedDoc.pages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(selectedDoc.pages, prev + 1))}
                  disabled={currentPage >= selectedDoc.pages}
                  className="px-2 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm"
                >
                  →
                </button>
                
                {/* Zoom Controls */}
                <div className="border-l border-gray-600 pl-2 ml-2">
                  <button
                    onClick={handleZoomOut}
                    className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                  >
                    -
                  </button>
                  <span className="mx-2 text-sm">{zoom}%</span>
                  <button
                    onClick={handleZoomIn}
                    className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* PDF Content Area */}
            <div className="flex-1 overflow-auto bg-gray-600 p-4">
              <div className="max-w-4xl mx-auto">
                <div 
                  className="bg-white shadow-lg mx-auto"
                  style={{ 
                    width: `${(8.5 * zoom) / 100 * 96}px`,
                    minHeight: `${(11 * zoom) / 100 * 96}px`
                  }}
                >
                  {/* Simulated PDF Content */}
                  <div className="p-8 text-black">
                    <div className="text-center mb-8">
                      <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        {selectedDoc.name.replace('.pdf', '')}
                      </h1>
                      <div className="w-16 h-1 bg-blue-500 mx-auto mb-4"></div>
                      <p className="text-gray-600">Page {currentPage}</p>
                    </div>
                    
                    <div className="space-y-4 text-gray-700">
                      <p className="text-lg leading-relaxed">
                        This is a simulated PDF document viewer. In a real implementation, 
                        this would render actual PDF content using libraries like PDF.js 
                        or similar PDF rendering engines.
                      </p>
                      
                      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                        Document Features
                      </h2>
                      
                      <ul className="list-disc list-inside space-y-2">
                        <li>Multi-document management</li>
                        <li>Page navigation controls</li>
                        <li>Zoom in/out functionality</li>
                        <li>Document metadata display</li>
                        <li>Professional PDF viewer interface</li>
                      </ul>
                      
                      <div className="mt-8 p-4 bg-gray-100 rounded">
                        <h3 className="font-semibold mb-2">Technical Specifications</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <strong>File Size:</strong> {selectedDoc.size}
                          </div>
                          <div>
                            <strong>Pages:</strong> {selectedDoc.pages}
                          </div>
                          <div>
                            <strong>Upload Date:</strong> {selectedDoc.uploadDate}
                          </div>
                          <div>
                            <strong>Current Zoom:</strong> {zoom}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">📄</div>
              <h2 className="text-xl font-semibold mb-2">PDF Reader</h2>
              <p className="text-gray-400">Select a document to start reading</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfReader;