import React, { useState } from 'react';
import { Folder, File, Upload, Download, Trash2, Plus, Search, Grid, List, ArrowLeft, Home, Settings } from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  size?: number;
  modified: Date;
  icon?: string;
  parent?: string;
}

const FileManager: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('/');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [showContextMenu, setShowContextMenu] = useState<{ x: number; y: number; item?: FileItem } | null>(null);

  const [files, setFiles] = useState<FileItem[]>([
    { id: '1', name: 'Documents', type: 'folder', modified: new Date('2024-01-15'), parent: '/' },
    { id: '2', name: 'Pictures', type: 'folder', modified: new Date('2024-01-14'), parent: '/' },
    { id: '3', name: 'Downloads', type: 'folder', modified: new Date('2024-01-13'), parent: '/' },
    { id: '4', name: 'Music', type: 'folder', modified: new Date('2024-01-12'), parent: '/' },
    { id: '5', name: 'Videos', type: 'folder', modified: new Date('2024-01-11'), parent: '/' },
    { id: '6', name: 'Desktop', type: 'folder', modified: new Date('2024-01-10'), parent: '/' },
    { id: '7', name: 'readme.txt', type: 'file', size: 2048, modified: new Date('2024-01-10'), parent: '/' },
    { id: '8', name: 'project.zip', type: 'file', size: 15728640, modified: new Date('2024-01-09'), parent: '/' },
    { id: '9', name: 'photo.jpg', type: 'file', size: 3355443, modified: new Date('2024-01-08'), parent: '/' },
    { id: '10', name: 'presentation.pdf', type: 'file', size: 5242880, modified: new Date('2024-01-07'), parent: '/' },
    { id: '11', name: 'Report.docx', type: 'file', size: 1048576, modified: new Date('2024-01-06'), parent: '/Documents' },
    { id: '12', name: 'Budget.xlsx', type: 'file', size: 524288, modified: new Date('2024-01-05'), parent: '/Documents' },
    { id: '13', name: 'Vacation', type: 'folder', modified: new Date('2024-01-04'), parent: '/Pictures' },
    { id: '14', name: 'sunset.jpg', type: 'file', size: 2097152, modified: new Date('2024-01-03'), parent: '/Pictures' },
  ]);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const getFileIcon = (item: FileItem) => {
    if (item.type === 'folder') return <Folder className="w-5 h-5 text-blue-500" />;
    
    const ext = item.name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <File className="w-5 h-5 text-green-500" />;
      case 'pdf':
        return <File className="w-5 h-5 text-red-500" />;
      case 'doc':
      case 'docx':
        return <File className="w-5 h-5 text-blue-600" />;
      case 'xls':
      case 'xlsx':
        return <File className="w-5 h-5 text-green-600" />;
      case 'zip':
      case 'rar':
        return <File className="w-5 h-5 text-yellow-600" />;
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const getCurrentFiles = () => {
    return files.filter(file => file.parent === currentPath);
  };

  const filteredFiles = getCurrentFiles().filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleItemClick = (item: FileItem, event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      setSelectedItems(prev => 
        prev.includes(item.id) 
          ? prev.filter(id => id !== item.id)
          : [...prev, item.id]
      );
    } else {
      setSelectedItems([item.id]);
      if (item.type === 'folder') {
        setCurrentPath(currentPath === '/' ? `/${item.name}` : `${currentPath}/${item.name}`);
      }
    }
  };

  const handleDoubleClick = (item: FileItem) => {
    if (item.type === 'folder') {
      setCurrentPath(currentPath === '/' ? `/${item.name}` : `${currentPath}/${item.name}`);
    } else {
      // Open file (in a real implementation, this would open the appropriate app)
      console.log(`Opening file: ${item.name}`);
    }
  };

  const handleBack = () => {
    if (currentPath !== '/') {
      const pathParts = currentPath.split('/').filter(Boolean);
      pathParts.pop();
      setCurrentPath(pathParts.length === 0 ? '/' : '/' + pathParts.join('/'));
    }
  };

  const handleHome = () => {
    setCurrentPath('/');
  };

  const handleContextMenu = (event: React.MouseEvent, item?: FileItem) => {
    event.preventDefault();
    setShowContextMenu({ x: event.clientX, y: event.clientY, item });
  };

  const handleNewFolder = () => {
    const name = prompt('Enter folder name:');
    if (name) {
      const newFolder: FileItem = {
        id: Date.now().toString(),
        name,
        type: 'folder',
        modified: new Date(),
        parent: currentPath
      };
      setFiles([...files, newFolder]);
    }
    setShowContextMenu(null);
  };

  const handleDelete = (item?: FileItem) => {
    const itemsToDelete = item ? [item.id] : selectedItems;
    if (confirm(`Delete ${itemsToDelete.length} item(s)?`)) {
      setFiles(files.filter(file => !itemsToDelete.includes(file.id)));
      setSelectedItems([]);
    }
    setShowContextMenu(null);
  };

  const handleRename = (item: FileItem) => {
    const newName = prompt('Enter new name:', item.name);
    if (newName && newName !== item.name) {
      setFiles(files.map(file => 
        file.id === item.id ? { ...file, name: newName } : file
      ));
    }
    setShowContextMenu(null);
  };

  const pathParts = currentPath.split('/').filter(Boolean);

  return (
    <div className="h-full flex flex-col bg-white" onClick={() => setShowContextMenu(null)}>
      {/* Toolbar */}
      <div className="flex items-center p-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2 mr-4">
          <button
            onClick={handleBack}
            disabled={currentPath === '/'}
            className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleHome}
            className="p-2 rounded hover:bg-gray-200"
            title="Home"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center flex-1 min-w-0">
          <button
            onClick={handleHome}
            className="px-2 py-1 text-sm hover:bg-gray-200 rounded"
          >
            Home
          </button>
          {pathParts.map((part, index) => (
            <React.Fragment key={index}>
              <span className="mx-1 text-gray-400">/</span>
              <button
                onClick={() => {
                  const newPath = '/' + pathParts.slice(0, index + 1).join('/');
                  setCurrentPath(newPath);
                }}
                className="px-2 py-1 text-sm hover:bg-gray-200 rounded truncate"
              >
                {part}
              </button>
            </React.Fragment>
          ))}
        </div>

        <div className="flex items-center space-x-2 ml-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 text-sm border border-gray-300 rounded w-48"
            />
          </div>

          {/* View Mode */}
          <div className="flex border border-gray-300 rounded">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleNewFolder}
            className="px-3 py-1 text-sm bg-blue-500 text-white hover:bg-blue-600 rounded flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>New Folder</span>
          </button>
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-auto p-4" onContextMenu={(e) => handleContextMenu(e)}>
        {viewMode === 'list' ? (
          <div className="space-y-1">
            {filteredFiles.map((item) => (
              <div
                key={item.id}
                className={`flex items-center p-2 rounded cursor-pointer hover:bg-blue-50 ${
                  selectedItems.includes(item.id) ? 'bg-blue-100 border border-blue-300' : ''
                }`}
                onClick={(e) => handleItemClick(item, e)}
                onDoubleClick={() => handleDoubleClick(item)}
                onContextMenu={(e) => handleContextMenu(e, item)}
              >
                {getFileIcon(item)}
                <div className="flex-1 ml-3 min-w-0">
                  <div className="font-medium text-sm truncate">{item.name}</div>
                </div>
                <div className="text-xs text-gray-500 w-20 text-right">
                  {formatFileSize(item.size)}
                </div>
                <div className="text-xs text-gray-500 w-32 text-right">
                  {item.modified.toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-6 gap-4">
            {filteredFiles.map((item) => (
              <div
                key={item.id}
                className={`flex flex-col items-center p-3 rounded cursor-pointer hover:bg-blue-50 ${
                  selectedItems.includes(item.id) ? 'bg-blue-100 border border-blue-300' : ''
                }`}
                onClick={(e) => handleItemClick(item, e)}
                onDoubleClick={() => handleDoubleClick(item)}
                onContextMenu={(e) => handleContextMenu(e, item)}
              >
                <div className="text-3xl mb-2">
                  {item.type === 'folder' ? '📁' : '📄'}
                </div>
                <div className="text-xs text-center truncate w-full">{item.name}</div>
                {item.size && (
                  <div className="text-xs text-gray-500 mt-1">{formatFileSize(item.size)}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {filteredFiles.length === 0 && (
          <div className="flex items-center justify-center h-64 text-gray-500">
            {searchQuery ? 'No files match your search' : 'This folder is empty'}
          </div>
        )}
      </div>

      {/* Context Menu */}
      {showContextMenu && (
        <div
          className="fixed bg-white border border-gray-300 rounded shadow-lg py-1 z-50"
          style={{ left: showContextMenu.x, top: showContextMenu.y }}
        >
          {showContextMenu.item ? (
            <>
              <button
                onClick={() => handleRename(showContextMenu.item!)}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
              >
                Rename
              </button>
              <button
                onClick={() => handleDelete(showContextMenu.item)}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600"
              >
                Delete
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleNewFolder}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
              >
                New Folder
              </button>
              {selectedItems.length > 0 && (
                <button
                  onClick={() => handleDelete()}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600"
                >
                  Delete Selected
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Status Bar */}
      <div className="p-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-600 flex justify-between">
        <div>
          {filteredFiles.length} items
          {selectedItems.length > 0 && ` (${selectedItems.length} selected)`}
        </div>
        <div>
          {selectedItems.length === 1 && (() => {
            const selectedFile = files.find(f => f.id === selectedItems[0]);
            return selectedFile?.size ? formatFileSize(selectedFile.size) : '';
          })()}
        </div>
      </div>
    </div>
  );
};

export default FileManager;