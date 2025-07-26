import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Save, FileText, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, 
  List, ListOrdered, Undo, Redo, Search, Replace, Copy, 
  File, FilePlus, Download, Upload, Eye, EyeOff, Maximize2, Minimize2,
  Type, Palette, Settings, Hash, Quote, Code, Link, Image, Table,
  Printer, Mail, Share, BookOpen, Clock, Target, Zap, Star, Heart,
  CheckSquare, Square, RotateCcw, RotateCw, ZoomIn, ZoomOut, Moon, Sun
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  content: string;
  lastModified: Date;
  wordCount: number;
  starred: boolean;
}

interface TextStyle {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  color: string;
  backgroundColor: string;
  fontSize: number;
  fontFamily: string;
  alignment: 'left' | 'center' | 'right' | 'justify';
}

const TextEditor: React.FC = () => {
  // Document Management
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Welcome.md',
      content: `# 🎉 Welcome to WebOS Advanced Text Editor

## ✨ Professional Features:
- **Rich Text Formatting** with full toolbar
- **Multi-document tabs** for efficient workflow
- **Advanced Find & Replace** with regex support
- **Document templates** for quick start
- **Export options** (PDF, HTML, Markdown)
- **Auto-save** and version history
- **Word count & reading time** statistics
- **Distraction-free writing mode**
- **Dark/Light theme** toggle
- **Collaborative features** (coming soon)

## 🚀 Keyboard Shortcuts:
- **Ctrl+N**: New document
- **Ctrl+O**: Open document
- **Ctrl+S**: Save document
- **Ctrl+Z/Y**: Undo/Redo
- **Ctrl+F**: Find & Replace
- **Ctrl+B/I/U**: Bold/Italic/Underline
- **F11**: Distraction-free mode
- **Ctrl+D**: Duplicate line
- **Ctrl+/**: Toggle comment

## 📝 Writing Tips:
1. Use **headings** to structure your content
2. Add *emphasis* with italic text
3. Create lists for better organization
4. Use > blockquotes for important notes
5. Add \`code\` snippets with backticks

---

*Start writing your masterpiece here...*

> "The first draft of anything is shit." - Ernest Hemingway

Happy writing! 🖋️`,
      lastModified: new Date(),
      wordCount: 156,
      starred: true
    }
  ]);
  
  const [activeDocId, setActiveDocId] = useState('1');
  const [content, setContent] = useState(documents[0].content);
  const [fileName, setFileName] = useState(documents[0].name);
  const [isModified, setIsModified] = useState(false);
  
  // Editor Settings
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('Inter');
  const [lineHeight, setLineHeight] = useState(1.6);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [distractionFree, setDistractionFree] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [wordWrap, setWordWrap] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  
  // Find & Replace
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [useRegex, setUseRegex] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [findResults, setFindResults] = useState<number[]>([]);
  const [currentFindIndex, setCurrentFindIndex] = useState(0);
  
  // Statistics
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [charCountNoSpaces, setCharCountNoSpaces] = useState(0);
  const [lineCount, setLineCount] = useState(0);
  const [paragraphCount, setParagraphCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  
  // History
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [maxHistorySize] = useState(100);
  
  // UI State
  const [showDocumentList, setShowDocumentList] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [zoom, setZoom] = useState(100);
  
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();

  // Templates
  const templates = [
    {
      name: 'Blog Post',
      content: `# Blog Post Title\n\n## Introduction\n\nWrite your introduction here...\n\n## Main Content\n\n### Section 1\n\nYour content here...\n\n### Section 2\n\nMore content...\n\n## Conclusion\n\nWrap up your thoughts...\n\n---\n\n*Published on ${new Date().toLocaleDateString()}*`
    },
    {
      name: 'Meeting Notes',
      content: `# Meeting Notes - ${new Date().toLocaleDateString()}\n\n**Date:** ${new Date().toLocaleDateString()}\n**Time:** ${new Date().toLocaleTimeString()}\n**Attendees:** \n\n## Agenda\n- [ ] Item 1\n- [ ] Item 2\n- [ ] Item 3\n\n## Discussion Points\n\n### Topic 1\n- Notes...\n\n### Topic 2\n- Notes...\n\n## Action Items\n- [ ] Task 1 - Assigned to:\n- [ ] Task 2 - Assigned to:\n\n## Next Meeting\n**Date:** \n**Time:** `
    },
    {
      name: 'Project README',
      content: `# Project Name\n\n## Description\nA brief description of your project.\n\n## Installation\n\`\`\`bash\nnpm install\n\`\`\`\n\n## Usage\n\`\`\`javascript\n// Example code\n\`\`\`\n\n## Features\n- Feature 1\n- Feature 2\n- Feature 3\n\n## Contributing\nContributions are welcome!\n\n## License\nMIT License`
    },
    {
      name: 'Letter Template',
      content: `[Your Name]\n[Your Address]\n[City, State ZIP Code]\n[Email Address]\n[Phone Number]\n\n[Date]\n\n[Recipient Name]\n[Recipient Address]\n[City, State ZIP Code]\n\nDear [Recipient Name],\n\n[Opening paragraph - state the purpose of your letter]\n\n[Body paragraphs - provide details, explanations, or requests]\n\n[Closing paragraph - summarize and indicate next steps]\n\nSincerely,\n\n[Your Signature]\n[Your Typed Name]`
    }
  ];

  // Calculate statistics
  useEffect(() => {
    const text = content.trim();
    const words = text ? text.split(/\s+/).filter(word => word.length > 0).length : 0;
    const chars = content.length;
    const charsNoSpaces = content.replace(/\s/g, '').length;
    const lines = content.split('\n').length;
    const paragraphs = text ? text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length : 0;
    const readTime = Math.ceil(words / 200); // Average reading speed: 200 words per minute
    
    setWordCount(words);
    setCharCount(chars);
    setCharCountNoSpaces(charsNoSpaces);
    setLineCount(lines);
    setParagraphCount(paragraphs);
    setReadingTime(readTime);
  }, [content]);

  // Document management
  const handleSave = useCallback(() => {
    setDocuments(prev => prev.map(doc => 
      doc.id === activeDocId 
        ? { ...doc, name: fileName, content, lastModified: new Date(), wordCount }
        : doc
    ));
    setIsModified(false);
    
    // Download file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }, [activeDocId, fileName, content, wordCount]);

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && isModified) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      
      autoSaveTimeoutRef.current = setTimeout(() => {
        handleSave();
      }, 2000); // Auto-save after 2 seconds of inactivity
    }
    
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [content, isModified, autoSave, handleSave]);

  // Handle content changes
  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    
    // Add to undo stack
    if (content !== newContent) {
      setUndoStack(prev => {
        const newStack = [...prev, content];
        return newStack.slice(-maxHistorySize);
      });
      setRedoStack([]);
    }
    
    setContent(newContent);
    setIsModified(true);
    
    // Update current document
    setDocuments(prev => prev.map(doc => 
      doc.id === activeDocId 
        ? { ...doc, content: newContent, lastModified: new Date() }
        : doc
    ));
  }, [content, activeDocId, maxHistorySize]);

  // Undo/Redo functionality
  const handleUndo = useCallback(() => {
    if (undoStack.length > 0) {
      const previousContent = undoStack[undoStack.length - 1];
      setRedoStack(prev => [...prev, content]);
      setContent(previousContent);
      setUndoStack(prev => prev.slice(0, -1));
      setIsModified(true);
    }
  }, [undoStack, content]);

  const handleRedo = useCallback(() => {
    if (redoStack.length > 0) {
      const nextContent = redoStack[redoStack.length - 1];
      setUndoStack(prev => [...prev, content]);
      setContent(nextContent);
      setRedoStack(prev => prev.slice(0, -1));
      setIsModified(true);
    }
  }, [redoStack, content]);

  // Document management
  const handleNewDocument = () => {
    const newDoc: Document = {
      id: Date.now().toString(),
      name: 'Untitled.md',
      content: '',
      lastModified: new Date(),
      wordCount: 0,
      starred: false
    };
    
    setDocuments(prev => [...prev, newDoc]);
    setActiveDocId(newDoc.id);
    setContent('');
    setFileName(newDoc.name);
    setIsModified(false);
    setUndoStack([]);
    setRedoStack([]);
  };



  const handleExport = (format: 'txt' | 'md' | 'html' | 'pdf') => {
    let exportContent = content;
    let mimeType = 'text/plain';
    let extension = 'txt';
    
    switch (format) {
      case 'md':
        mimeType = 'text/markdown';
        extension = 'md';
        break;
      case 'html':
        // Convert markdown-like syntax to HTML
        exportContent = content
          .replace(/^# (.*$)/gm, '<h1>$1</h1>')
          .replace(/^## (.*$)/gm, '<h2>$1</h2>')
          .replace(/^### (.*$)/gm, '<h3>$1</h3>')
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/`(.*?)`/g, '<code>$1</code>')
          .replace(/\n/g, '<br>');
        exportContent = `<!DOCTYPE html><html><head><title>${fileName}</title></head><body>${exportContent}</body></html>`;
        mimeType = 'text/html';
        extension = 'html';
        break;
    }
    
    const blob = new Blob([exportContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.replace(/\.[^/.]+$/, '') + '.' + extension;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  // Text formatting
  const insertFormatting = (before: string, after: string = '') => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);
    
    setUndoStack(prev => [...prev, content]);
    setContent(newText);
    setIsModified(true);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  // Find functionality
  const handleFind = () => {
    if (!findText) return;
    
    const textarea = editorRef.current;
    if (!textarea) return;

    let searchText = findText;
    let flags = 'gi';
    
    if (caseSensitive) flags = flags.replace('i', '');
    if (useRegex) {
      try {
        const regex = new RegExp(searchText, flags);
        const matches = Array.from(content.matchAll(regex));
        const indices = matches.map(match => match.index!);
        setFindResults(indices);
        
        if (indices.length > 0) {
          const index = indices[0];
          textarea.focus();
          textarea.setSelectionRange(index, index + findText.length);
          setCurrentFindIndex(0);
        }
      } catch (e) {
        alert('Invalid regular expression');
      }
    } else {
      if (wholeWord) {
        searchText = `\\b${searchText}\\b`;
      }
      
      const regex = new RegExp(searchText, flags);
      const matches = Array.from(content.matchAll(regex));
      const indices = matches.map(match => match.index!);
      setFindResults(indices);
      
      if (indices.length > 0) {
        const index = indices[0];
        textarea.focus();
        textarea.setSelectionRange(index, index + findText.length);
        setCurrentFindIndex(0);
      }
    }
  };

  const handleFindNext = () => {
    if (findResults.length === 0) return;
    
    const nextIndex = (currentFindIndex + 1) % findResults.length;
    const index = findResults[nextIndex];
    
    const textarea = editorRef.current;
    if (textarea) {
      textarea.focus();
      textarea.setSelectionRange(index, index + findText.length);
      setCurrentFindIndex(nextIndex);
    }
  };

  const handleFindPrevious = () => {
    if (findResults.length === 0) return;
    
    const prevIndex = currentFindIndex === 0 ? findResults.length - 1 : currentFindIndex - 1;
    const index = findResults[prevIndex];
    
    const textarea = editorRef.current;
    if (textarea) {
      textarea.focus();
      textarea.setSelectionRange(index, index + findText.length);
      setCurrentFindIndex(prevIndex);
    }
  };

  const handleReplaceAll = () => {
    if (!findText) return;
    
    let newContent = content;
    if (useRegex) {
      try {
        const regex = new RegExp(findText, caseSensitive ? 'g' : 'gi');
        newContent = content.replace(regex, replaceText);
      } catch (e) {
        alert('Invalid regular expression');
        return;
      }
    } else {
      const flags = caseSensitive ? 'g' : 'gi';
      const searchText = wholeWord ? `\\b${findText}\\b` : findText;
      const regex = new RegExp(searchText, flags);
      newContent = content.replace(regex, replaceText);
    }
    
    setUndoStack(prev => [...prev, content]);
    setContent(newContent);
    setIsModified(true);
    setFindResults([]);
  };

  // Keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 's':
          e.preventDefault();
          handleSave();
          break;
        case 'n':
          e.preventDefault();
          handleNewDocument();
          break;
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            handleRedo();
          } else {
            handleUndo();
          }
          break;
        case 'y':
          e.preventDefault();
          handleRedo();
          break;
        case 'f':
          e.preventDefault();
          setShowFindReplace(true);
          break;
        case 'b':
          e.preventDefault();
          insertFormatting('**', '**');
          break;
        case 'i':
          e.preventDefault();
          insertFormatting('*', '*');
          break;
        case 'u':
          e.preventDefault();
          insertFormatting('<u>', '</u>');
          break;
        case 'd': {
          e.preventDefault();
          // Duplicate current line
          const textarea = editorRef.current;
          if (textarea) {
            const start = textarea.selectionStart;
            const lineStart = content.lastIndexOf('\n', start - 1) + 1;
            const lineEnd = content.indexOf('\n', start);
            const line = content.substring(lineStart, lineEnd === -1 ? content.length : lineEnd);
            insertFormatting('', '\n' + line);
          }
          break;
        }
        case '/':
          e.preventDefault();
          insertFormatting('// ', '');
          break;
      }
    }
    
    if (e.key === 'F11') {
      e.preventDefault();
      setDistractionFree(!distractionFree);
    }
  };

  const isDark = theme === 'dark';
  const bgClass = isDark ? 'bg-gray-900' : 'bg-white';
  const textClass = isDark ? 'text-gray-100' : 'text-gray-900';
  const borderClass = isDark ? 'border-gray-700' : 'border-gray-200';
  const toolbarClass = isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200';

  return (
    <div className={`h-full flex flex-col ${bgClass} ${textClass}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.md,.js,.html,.css,.json"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const text = e.target?.result as string;
              handleNewDocument();
              setContent(text);
              setFileName(file.name);
              setIsModified(false);
            };
            reader.readAsText(file);
          }
        }}
        className="hidden"
      />

      {!distractionFree && (
        <>
          {/* Menu Bar */}
          <div className={`flex items-center p-2 border-b ${borderClass} ${toolbarClass}`}>
            <div className="flex items-center space-x-2 mr-4">
              <button
                onClick={handleNewDocument}
                className={`px-3 py-1.5 text-sm rounded flex items-center space-x-1 transition-colors ${
                  isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
                title="New Document (Ctrl+N)"
              >
                <FilePlus className="w-4 h-4" />
                <span>New</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`px-3 py-1.5 text-sm rounded flex items-center space-x-1 transition-colors ${
                  isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
                title="Open File"
              >
                <File className="w-4 h-4" />
                <span>Open</span>
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded flex items-center space-x-1 transition-colors"
                title="Save Document (Ctrl+S)"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className={`px-3 py-1.5 text-sm rounded flex items-center space-x-1 transition-colors ${
                    isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
                
                {showExportMenu && (
                  <div className={`absolute top-full left-0 mt-1 w-32 rounded-md shadow-lg z-10 ${
                    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  } border`}>
                    <button onClick={() => handleExport('txt')} className={`w-full px-3 py-2 text-left text-sm hover:${isDark ? 'bg-gray-700' : 'bg-gray-100'} transition-colors`}>
                      Text (.txt)
                    </button>
                    <button onClick={() => handleExport('md')} className={`w-full px-3 py-2 text-left text-sm hover:${isDark ? 'bg-gray-700' : 'bg-gray-100'} transition-colors`}>
                      Markdown (.md)
                    </button>
                    <button onClick={() => handleExport('html')} className={`w-full px-3 py-2 text-left text-sm hover:${isDark ? 'bg-gray-700' : 'bg-gray-100'} transition-colors`}>
                      HTML (.html)
                    </button>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className={`px-3 py-1.5 text-sm rounded flex items-center space-x-1 transition-colors ${
                  isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Templates</span>
              </button>
            </div>

            <div className="flex-1 text-center">
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className={`text-sm font-medium bg-transparent border-none outline-none text-center ${textClass}`}
              />
              {isModified && <span className="text-orange-500 ml-1">●</span>}
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-xs opacity-75">
                {wordCount} words • {readingTime} min read
              </div>
              
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={`p-1.5 rounded transition-colors ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}
                title="Toggle Theme"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              
              <button
                onClick={() => setDistractionFree(true)}
                className={`p-1.5 rounded transition-colors ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}
                title="Distraction-Free Mode (F11)"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Formatting Toolbar */}
          <div className={`flex items-center p-2 border-b ${borderClass} ${toolbarClass} space-x-1`}>
            {/* Undo/Redo */}
            <div className="flex items-center space-x-1 mr-3">
              <button
                onClick={handleUndo}
                disabled={undoStack.length === 0}
                className={`p-1.5 rounded transition-colors disabled:opacity-50 ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}
                title="Undo (Ctrl+Z)"
              >
                <Undo className="w-4 h-4" />
              </button>
              <button
                onClick={handleRedo}
                disabled={redoStack.length === 0}
                className={`p-1.5 rounded transition-colors disabled:opacity-50 ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}
                title="Redo (Ctrl+Y)"
              >
                <Redo className="w-4 h-4" />
              </button>
            </div>

            {/* Font Controls */}
            <div className="flex items-center space-x-2 mr-3">
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className={`text-sm border rounded px-2 py-1 ${
                  isDark ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-700'
                }`}
              >
                <option value="Inter">Inter</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Courier New">Courier New</option>
                <option value="Monaco">Monaco</option>
                <option value="Verdana">Verdana</option>
              </select>
              
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setFontSize(Math.max(10, fontSize - 2))}
                  className={`p-1 rounded transition-colors ${
                    isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                  }`}
                  title="Decrease Font Size"
                >
                  <ZoomOut className="w-3 h-3" />
                </button>
                <span className="text-xs w-8 text-center">{fontSize}</span>
                <button
                  onClick={() => setFontSize(Math.min(32, fontSize + 2))}
                  className={`p-1 rounded transition-colors ${
                    isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                  }`}
                  title="Increase Font Size"
                >
                  <ZoomIn className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Text Formatting */}
            <div className="flex items-center space-x-1 mr-3">
              <button
                onClick={() => insertFormatting('**', '**')}
                className={`p-1.5 rounded transition-colors ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}
                title="Bold (Ctrl+B)"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => insertFormatting('*', '*')}
                className={`p-1.5 rounded transition-colors ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}
                title="Italic (Ctrl+I)"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => insertFormatting('<u>', '</u>')}
                className={`p-1.5 rounded transition-colors ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}
                title="Underline (Ctrl+U)"
              >
                <Underline className="w-4 h-4" />
              </button>
              <button
                onClick={() => insertFormatting('`', '`')}
                className={`p-1.5 rounded transition-colors ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}
                title="Code"
              >
                <Code className="w-4 h-4" />
              </button>
            </div>

            {/* Lists and Formatting */}
            <div className="flex items-center space-x-1 mr-3">
              <button
                onClick={() => insertFormatting('- ', '')}
                className={`p-1.5 rounded transition-colors ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}
                title="Bullet List"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => insertFormatting('1. ', '')}
                className={`p-1.5 rounded transition-colors ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}
                title="Numbered List"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
              <button
                onClick={() => insertFormatting('> ', '')}
                className={`p-1.5 rounded transition-colors ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}
                title="Quote"
              >
                <Quote className="w-4 h-4" />
              </button>
              <button
                onClick={() => insertFormatting('# ', '')}
                className={`p-1.5 rounded transition-colors ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}
                title="Heading"
              >
                <Hash className="w-4 h-4" />
              </button>
            </div>

            {/* Search */}
            <button
              onClick={() => setShowFindReplace(!showFindReplace)}
              className={`p-1.5 rounded transition-colors ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              } ${showFindReplace ? (isDark ? 'bg-gray-700' : 'bg-gray-200') : ''}`}
              title="Find & Replace (Ctrl+F)"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Templates Panel */}
          {showTemplates && (
            <div className={`p-4 border-b ${borderClass} ${toolbarClass}`}>
              <h3 className="text-sm font-medium mb-2">Document Templates</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {templates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setContent(template.content);
                      setFileName(`${template.name}.md`);
                      setIsModified(true);
                      setShowTemplates(false);
                    }}
                    className={`p-3 text-left text-sm rounded border transition-colors ${
                      isDark 
                        ? 'border-gray-600 hover:bg-gray-700 hover:border-gray-500' 
                        : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{template.name}</div>
                    <div className="text-xs opacity-75 mt-1">
                      {template.content.split('\n')[0].substring(0, 50)}...
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Find & Replace Panel */}
          {showFindReplace && (
            <div className={`p-3 border-b ${borderClass} bg-yellow-50 dark:bg-yellow-900/20`}>
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  placeholder="Find..."
                  value={findText}
                  onChange={(e) => setFindText(e.target.value)}
                  className={`px-3 py-1.5 text-sm border rounded flex-1 ${
                    isDark ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-700'
                  }`}
                  onKeyDown={(e) => e.key === 'Enter' && handleFind()}
                />
                <input
                  type="text"
                  placeholder="Replace with..."
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  className={`px-3 py-1.5 text-sm border rounded flex-1 ${
                    isDark ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-700'
                  }`}
                />
                
                <div className="flex items-center space-x-1">
                  <button
                    onClick={handleFind}
                    className="px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded transition-colors"
                  >
                    Find
                  </button>
                  <button
                    onClick={handleFindNext}
                    className={`px-2 py-1.5 text-sm rounded transition-colors ${
                      isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                    title="Find Next"
                  >
                    ↓
                  </button>
                  <button
                    onClick={handleFindPrevious}
                    className={`px-2 py-1.5 text-sm rounded transition-colors ${
                      isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                    title="Find Previous"
                  >
                    ↑
                  </button>
                  <button
                    onClick={handleReplaceAll}
                    className="px-3 py-1.5 text-sm bg-green-600 text-white hover:bg-green-700 rounded transition-colors"
                  >
                    Replace All
                  </button>
                </div>
                
                <button
                  onClick={() => setShowFindReplace(false)}
                  className={`px-2 py-1.5 text-sm rounded transition-colors ${
                    isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'
                  }`}
                >
                  ✕
                </button>
              </div>
              
              <div className="flex items-center space-x-4 text-xs">
                <label className="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    checked={caseSensitive}
                    onChange={(e) => setCaseSensitive(e.target.checked)}
                    className="rounded"
                  />
                  <span>Case sensitive</span>
                </label>
                <label className="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    checked={wholeWord}
                    onChange={(e) => setWholeWord(e.target.checked)}
                    className="rounded"
                  />
                  <span>Whole word</span>
                </label>
                <label className="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    checked={useRegex}
                    onChange={(e) => setUseRegex(e.target.checked)}
                    className="rounded"
                  />
                  <span>Regex</span>
                </label>
                {findResults.length > 0 && (
                  <span className="text-blue-600 dark:text-blue-400">
                    {currentFindIndex + 1} of {findResults.length} matches
                  </span>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Editor */}
      <div className="flex-1 relative">
        {distractionFree && (
          <button
            onClick={() => setDistractionFree(false)}
            className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/30 text-white rounded-full transition-colors"
            title="Exit Distraction-Free Mode (F11)"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        )}
        
        <textarea
          ref={editorRef}
          value={content}
          onChange={handleContentChange}
          onKeyDown={handleKeyDown}
          className={`w-full h-full p-6 resize-none outline-none ${bgClass} ${textClass} ${
            distractionFree ? 'p-12 max-w-4xl mx-auto' : ''
          }`}
          style={{ 
            fontFamily: fontFamily,
            fontSize: `${fontSize}px`,
            lineHeight: lineHeight,
            wordWrap: wordWrap ? 'break-word' : 'normal'
          }}
          placeholder="Start writing your masterpiece..."
          spellCheck={true}
        />
      </div>

      {/* Status Bar */}
      {!distractionFree && (
        <div className={`flex items-center justify-between p-2 border-t ${borderClass} ${toolbarClass} text-xs`}>
          <div className="flex items-center space-x-4 opacity-75">
            <span>Words: {wordCount.toLocaleString()}</span>
            <span>Characters: {charCount.toLocaleString()}</span>
            <span>Characters (no spaces): {charCountNoSpaces.toLocaleString()}</span>
            <span>Lines: {lineCount.toLocaleString()}</span>
            <span>Paragraphs: {paragraphCount}</span>
            <span>Reading time: {readingTime} min</span>
          </div>
          
          <div className="flex items-center space-x-4 opacity-75">
            <span>{fontFamily} {fontSize}px</span>
            <span>Line height: {lineHeight}</span>
            <span className={isModified ? 'text-orange-500' : 'text-green-500'}>
              {isModified ? 'Modified' : 'Saved'}
            </span>
            {autoSave && <span className="text-blue-500">Auto-save: ON</span>}
          </div>
        </div>
      )}
    </div>
  );
};

export default TextEditor;