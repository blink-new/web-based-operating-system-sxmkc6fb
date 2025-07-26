import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Star, StarOff, Trash2, Edit3, Save, X, 
  Calendar, Clock, Hash, BookOpen, Filter, SortAsc, SortDesc,
  FileText, Folder, Tag, Archive, Download, Upload, Settings,
  Bold, Italic, Underline, List, ListOrdered, Quote, Code,
  Palette, Type, AlignLeft, AlignCenter, AlignRight, Link
} from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  created: Date;
  modified: Date;
  starred: boolean;
  tags: string[];
  category: string;
  color: string;
  archived: boolean;
}

interface Category {
  id: string;
  name: string;
  color: string;
  count: number;
}

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: '🎉 Welcome to Advanced Notes',
      content: `# Welcome to WebOS Advanced Notes App!

## ✨ Features:
- **Rich text formatting** with markdown support
- **Categories and tags** for organization
- **Search and filter** functionality
- **Star important notes** for quick access
- **Color coding** for visual organization
- **Export/Import** capabilities
- **Archive system** for old notes
- **Auto-save** functionality

## 📝 Getting Started:
1. Create new notes with the + button
2. Use **bold**, *italic*, and other formatting
3. Add tags like #important #work #personal
4. Star ⭐ your favorite notes
5. Use categories to organize by project

## 🎨 Formatting Examples:
- **Bold text** for emphasis
- *Italic text* for style
- \`Code snippets\` for technical notes
- > Blockquotes for important information
- Lists for organization:
  - Bullet points
  - Task lists
  - Numbered items

## 🏷️ Tags:
Use hashtags anywhere in your notes: #productivity #ideas #meeting

---

*Happy note-taking! 📚*`,
      created: new Date('2024-01-15'),
      modified: new Date(),
      starred: true,
      tags: ['welcome', 'tutorial', 'important'],
      category: 'Getting Started',
      color: 'blue',
      archived: false
    },
    {
      id: '2',
      title: 'Project Ideas 💡',
      content: `# Project Ideas

## Web Development
- [ ] Personal portfolio website
- [ ] E-commerce platform
- [ ] Social media dashboard
- [ ] Task management app

## Mobile Apps
- [ ] Fitness tracker
- [ ] Recipe organizer
- [ ] Language learning app
- [ ] Budget planner

## AI/ML Projects
- [ ] Chatbot for customer service
- [ ] Image recognition system
- [ ] Recommendation engine
- [ ] Natural language processor

#projects #ideas #development`,
      created: new Date('2024-01-10'),
      modified: new Date('2024-01-12'),
      starred: false,
      tags: ['projects', 'ideas', 'development'],
      category: 'Work',
      color: 'green',
      archived: false
    },
    {
      id: '3',
      title: 'Meeting Notes - Q1 Planning',
      content: `# Q1 Planning Meeting
**Date:** January 8, 2024
**Attendees:** Team leads, Product managers

## Key Decisions:
- Launch new feature by March 15
- Increase team size by 2 developers
- Focus on mobile optimization

## Action Items:
- [ ] Create technical specifications
- [ ] Set up development environment
- [ ] Schedule user testing sessions
- [ ] Prepare marketing materials

## Budget Allocation:
- Development: 60%
- Marketing: 25%
- Testing: 15%

#meeting #planning #q1`,
      created: new Date('2024-01-08'),
      modified: new Date('2024-01-08'),
      starred: true,
      tags: ['meeting', 'planning', 'q1'],
      category: 'Work',
      color: 'orange',
      archived: false
    }
  ]);

  const [selectedNote, setSelectedNote] = useState<Note | null>(notes[0]);
  const [editingTitle, setEditingTitle] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [sortBy, setSortBy] = useState<'modified' | 'created' | 'title'>('modified');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showSettings, setShowSettings] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);

  const categories: Category[] = [
    { id: 'all', name: 'All', color: 'gray', count: notes.length },
    { id: 'getting-started', name: 'Getting Started', color: 'blue', count: notes.filter(n => n.category === 'Getting Started').length },
    { id: 'work', name: 'Work', color: 'green', count: notes.filter(n => n.category === 'Work').length },
    { id: 'personal', name: 'Personal', color: 'purple', count: notes.filter(n => n.category === 'Personal').length },
    { id: 'ideas', name: 'Ideas', color: 'yellow', count: notes.filter(n => n.category === 'Ideas').length },
  ];

  const colors = [
    { name: 'Blue', value: 'blue', class: 'bg-blue-100 border-blue-300' },
    { name: 'Green', value: 'green', class: 'bg-green-100 border-green-300' },
    { name: 'Orange', value: 'orange', class: 'bg-orange-100 border-orange-300' },
    { name: 'Purple', value: 'purple', class: 'bg-purple-100 border-purple-300' },
    { name: 'Pink', value: 'pink', class: 'bg-pink-100 border-pink-300' },
    { name: 'Yellow', value: 'yellow', class: 'bg-yellow-100 border-yellow-300' },
    { name: 'Red', value: 'red', class: 'bg-red-100 border-red-300' },
    { name: 'Gray', value: 'gray', class: 'bg-gray-100 border-gray-300' },
  ];

  // Auto-save functionality
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (selectedNote) {
        setNotes(prev => prev.map(note => 
          note.id === selectedNote.id ? selectedNote : note
        ));
      }
    }, 1000);

    return () => clearTimeout(autoSaveTimer);
  }, [selectedNote]);

  // Filter and sort notes
  const filteredNotes = notes
    .filter(note => {
      if (showArchived && !note.archived) return false;
      if (!showArchived && note.archived) return false;
      if (showStarredOnly && !note.starred) return false;
      if (selectedCategory !== 'All' && note.category !== selectedCategory) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query) ||
          note.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'created':
          comparison = a.created.getTime() - b.created.getTime();
          break;
        case 'modified':
        default:
          comparison = a.modified.getTime() - b.modified.getTime();
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '# New Note\n\nStart writing your thoughts here...\n\n',
      created: new Date(),
      modified: new Date(),
      starred: false,
      tags: [],
      category: 'Personal',
      color: 'blue',
      archived: false
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    setEditingTitle(true);
  };

  const updateNote = (updates: Partial<Note>) => {
    if (!selectedNote) return;
    
    const updatedNote = { ...selectedNote, ...updates, modified: new Date() };
    setSelectedNote(updatedNote);
  };

  const deleteNote = (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    const filteredNotes = notes.filter(note => note.id !== noteId);
    setNotes(filteredNotes);
    if (selectedNote?.id === noteId) {
      setSelectedNote(filteredNotes[0] || null);
    }
  };

  const toggleStar = (noteId: string) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId ? { ...note, starred: !note.starred } : note
    ));
    if (selectedNote?.id === noteId) {
      setSelectedNote(prev => prev ? { ...prev, starred: !prev.starred } : null);
    }
  };

  const addTag = () => {
    if (!newTag.trim() || !selectedNote) return;
    
    const tag = newTag.trim().toLowerCase().replace(/^#/, '');
    if (!selectedNote.tags.includes(tag)) {
      updateNote({ tags: [...selectedNote.tags, tag] });
    }
    setNewTag('');
  };

  const removeTag = (tagToRemove: string) => {
    if (!selectedNote) return;
    updateNote({ tags: selectedNote.tags.filter(tag => tag !== tagToRemove) });
  };

  const insertFormatting = (before: string, after: string = '') => {
    if (!selectedNote) return;
    
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = selectedNote.content.substring(start, end);
    const newContent = selectedNote.content.substring(0, start) + before + selectedText + after + selectedNote.content.substring(end);
    
    updateNote({ content: newContent });
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const exportNotes = () => {
    const dataStr = JSON.stringify(notes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'notes-export.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const getColorClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: 'bg-blue-50 border-blue-200',
      green: 'bg-green-50 border-green-200',
      orange: 'bg-orange-50 border-orange-200',
      purple: 'bg-purple-50 border-purple-200',
      pink: 'bg-pink-50 border-pink-200',
      yellow: 'bg-yellow-50 border-yellow-200',
      red: 'bg-red-50 border-red-200',
      gray: 'bg-gray-50 border-gray-200',
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="h-full flex bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-700 flex flex-col bg-gray-800">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-semibold flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Notes
            </h1>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={createNewNote}
                className="p-1.5 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                title="New Note"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Filters</span>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setShowStarredOnly(!showStarredOnly)}
                className={`p-1 rounded transition-colors ${showStarredOnly ? 'bg-yellow-600 text-white' : 'hover:bg-gray-700'}`}
                title="Show starred only"
              >
                <Star className="w-3 h-3" />
              </button>
              <button
                onClick={() => setShowArchived(!showArchived)}
                className={`p-1 rounded transition-colors ${showArchived ? 'bg-gray-600 text-white' : 'hover:bg-gray-700'}`}
                title="Show archived"
              >
                <Archive className="w-3 h-3" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-xs">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs"
            >
              <option value="modified">Modified</option>
              <option value="created">Created</option>
              <option value="title">Title</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-1 hover:bg-gray-700 rounded"
            >
              {sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-sm font-medium mb-2">Categories</h3>
          <div className="space-y-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`w-full flex items-center justify-between px-2 py-1 rounded text-sm transition-colors ${
                  selectedCategory === category.name ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
                }`}
              >
                <span className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 bg-${category.color}-500`}></div>
                  {category.name}
                </span>
                <span className="text-xs opacity-75">{category.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className={`p-3 border-b border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors ${
                selectedNote?.id === note.id ? 'bg-gray-700 border-l-4 border-l-blue-500' : ''
              }`}
              onClick={() => setSelectedNote(note)}
            >
              <div className="flex items-start justify-between mb-1">
                <div className="font-medium text-sm truncate flex-1 mr-2">{note.title}</div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStar(note.id);
                  }}
                  className="text-yellow-500 hover:text-yellow-400"
                >
                  {note.starred ? <Star className="w-3 h-3 fill-current" /> : <StarOff className="w-3 h-3" />}
                </button>
              </div>
              
              <div className="text-xs text-gray-400 mb-2">
                {note.modified.toLocaleDateString()} • {note.modified.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              
              <div className="text-xs text-gray-500 mb-2 line-clamp-2">
                {note.content.replace(/[#*`>]/g, '').substring(0, 80)}...
              </div>
              
              {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {note.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs bg-gray-600 text-gray-300 px-1.5 py-0.5 rounded">
                      #{tag}
                    </span>
                  ))}
                  {note.tags.length > 3 && (
                    <span className="text-xs text-gray-500">+{note.tags.length - 3}</span>
                  )}
                </div>
              )}
            </div>
          ))}
          
          {filteredNotes.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No notes found</p>
              <p className="text-sm mt-1">Try adjusting your filters or create a new note</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        {selectedNote ? (
          <>
            {/* Editor Header */}
            <div className="p-4 border-b border-gray-700 bg-gray-800">
              <div className="flex items-center justify-between mb-3">
                {editingTitle ? (
                  <input
                    type="text"
                    value={selectedNote.title}
                    onChange={(e) => updateNote({ title: e.target.value })}
                    onBlur={() => setEditingTitle(false)}
                    onKeyPress={(e) => e.key === 'Enter' && setEditingTitle(false)}
                    className="text-lg font-semibold bg-transparent border-b border-gray-600 outline-none flex-1 mr-4"
                    autoFocus
                  />
                ) : (
                  <h2
                    className="text-lg font-semibold cursor-pointer flex-1 mr-4"
                    onClick={() => setEditingTitle(true)}
                  >
                    {selectedNote.title}
                  </h2>
                )}
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleStar(selectedNote.id)}
                    className={`p-2 rounded transition-colors ${
                      selectedNote.starred ? 'text-yellow-500 hover:text-yellow-400' : 'text-gray-400 hover:text-yellow-500'
                    }`}
                    title="Star note"
                  >
                    {selectedNote.starred ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
                  </button>
                  
                  <div className="relative">
                    <button
                      onClick={() => setShowColorPicker(!showColorPicker)}
                      className="p-2 rounded hover:bg-gray-700 transition-colors"
                      title="Change color"
                    >
                      <Palette className="w-4 h-4" />
                    </button>
                    
                    {showColorPicker && (
                      <div className="absolute top-full right-0 mt-1 p-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
                        <div className="grid grid-cols-4 gap-1">
                          {colors.map((color) => (
                            <button
                              key={color.value}
                              onClick={() => {
                                updateNote({ color: color.value });
                                setShowColorPicker(false);
                              }}
                              className={`w-6 h-6 rounded border-2 ${
                                selectedNote.color === color.value ? 'border-white' : 'border-gray-600'
                              } bg-${color.value}-500 hover:scale-110 transition-transform`}
                              title={color.name}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => deleteNote(selectedNote.id)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded transition-colors"
                    title="Delete note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Formatting Toolbar */}
              <div className="flex items-center space-x-1 mb-3">
                <button
                  onClick={() => insertFormatting('**', '**')}
                  className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  onClick={() => insertFormatting('*', '*')}
                  className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  onClick={() => insertFormatting('`', '`')}
                  className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                  title="Code"
                >
                  <Code className="w-4 h-4" />
                </button>
                <button
                  onClick={() => insertFormatting('- ', '')}
                  className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                  title="Bullet List"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => insertFormatting('1. ', '')}
                  className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                  title="Numbered List"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                <button
                  onClick={() => insertFormatting('> ', '')}
                  className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                  title="Quote"
                >
                  <Quote className="w-4 h-4" />
                </button>
                <button
                  onClick={() => insertFormatting('# ', '')}
                  className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                  title="Heading"
                >
                  <Hash className="w-4 h-4" />
                </button>
              </div>
              
              {/* Tags */}
              <div className="flex items-center space-x-2">
                <div className="flex flex-wrap gap-1 flex-1">
                  {selectedNote.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center text-xs bg-blue-600 text-white px-2 py-1 rounded-full"
                    >
                      #{tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center space-x-1">
                  <input
                    type="text"
                    placeholder="Add tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    className="text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1 w-20"
                  />
                  <button
                    onClick={addTag}
                    className="p-1 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Editor */}
            <textarea
              value={selectedNote.content}
              onChange={(e) => updateNote({ content: e.target.value })}
              className="flex-1 p-6 resize-none outline-none bg-gray-900 text-gray-100 font-mono leading-relaxed"
              placeholder="Start writing your note..."
              style={{ fontSize: '14px', lineHeight: '1.6' }}
            />

            {/* Status Bar */}
            <div className="p-3 border-t border-gray-700 bg-gray-800 text-xs text-gray-400">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span>Words: {selectedNote.content.trim().split(/\s+/).filter(w => w.length > 0).length}</span>
                  <span>Characters: {selectedNote.content.length}</span>
                  <span>Category: {selectedNote.category}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span>Created: {selectedNote.created.toLocaleDateString()}</span>
                  <span>Modified: {selectedNote.modified.toLocaleDateString()}</span>
                  <span className="text-green-400">Auto-saved</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Select a note to start editing</h3>
              <p className="text-sm">Choose a note from the sidebar or create a new one</p>
              <button
                onClick={createNewNote}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Create New Note
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-96">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 hover:bg-gray-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Export Notes</label>
                <button
                  onClick={exportNotes}
                  className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center justify-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export as JSON
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Statistics</label>
                <div className="text-sm text-gray-400 space-y-1">
                  <div>Total notes: {notes.length}</div>
                  <div>Starred notes: {notes.filter(n => n.starred).length}</div>
                  <div>Archived notes: {notes.filter(n => n.archived).length}</div>
                  <div>Total words: {notes.reduce((acc, note) => acc + note.content.trim().split(/\s+/).filter(w => w.length > 0).length, 0)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;