import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, 
  MapPin, Users, Bell, Edit3, Trash2, X, Save, Star, StarOff,
  Filter, Search, Settings, Download, Upload, RefreshCw, Eye,
  AlertCircle, CheckCircle, Circle, User, Tag, Repeat, Globe
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  attendees: string[];
  category: 'work' | 'personal' | 'health' | 'social' | 'other';
  priority: 'low' | 'medium' | 'high';
  color: string;
  reminder: number; // minutes before
  recurring: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  completed: boolean;
  starred: boolean;
}

interface CalendarView {
  type: 'month' | 'week' | 'day' | 'agenda';
  date: Date;
}

const Calendar: React.FC = () => {
  const [currentView, setCurrentView] = useState<CalendarView>({
    type: 'month',
    date: new Date()
  });
  
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: '🎉 Welcome to WebOS Calendar',
      description: 'This is your advanced calendar app with full event management, reminders, and scheduling capabilities.',
      date: new Date(),
      startTime: '09:00',
      endTime: '10:00',
      location: 'WebOS Desktop',
      attendees: ['You'],
      category: 'personal',
      priority: 'high',
      color: 'blue',
      reminder: 15,
      recurring: 'none',
      completed: false,
      starred: true
    },
    {
      id: '2',
      title: 'Team Meeting - Q1 Review',
      description: 'Quarterly review meeting with the development team to discuss progress and upcoming goals.',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      startTime: '14:00',
      endTime: '15:30',
      location: 'Conference Room A',
      attendees: ['John Doe', 'Jane Smith', 'Mike Johnson'],
      category: 'work',
      priority: 'high',
      color: 'red',
      reminder: 30,
      recurring: 'none',
      completed: false,
      starred: false
    },
    {
      id: '3',
      title: 'Gym Workout',
      description: 'Regular fitness session - cardio and strength training',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
      startTime: '18:00',
      endTime: '19:30',
      location: 'City Gym',
      attendees: [],
      category: 'health',
      priority: 'medium',
      color: 'green',
      reminder: 60,
      recurring: 'weekly',
      completed: false,
      starred: false
    }
  ]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showSettings, setShowSettings] = useState(false);

  const today = new Date();
  const year = currentView.date.getFullYear();
  const month = currentView.date.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  const days = [];
  const current = new Date(startDate);
  
  for (let i = 0; i < 42; i++) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const shortDayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const categories = [
    { id: 'all', name: 'All', color: 'gray' },
    { id: 'work', name: 'Work', color: 'blue' },
    { id: 'personal', name: 'Personal', color: 'green' },
    { id: 'health', name: 'Health', color: 'red' },
    { id: 'social', name: 'Social', color: 'purple' },
    { id: 'other', name: 'Other', color: 'yellow' }
  ];

  const colors = [
    { name: 'Blue', value: 'blue', class: 'bg-blue-500' },
    { name: 'Red', value: 'red', class: 'bg-red-500' },
    { name: 'Green', value: 'green', class: 'bg-green-500' },
    { name: 'Purple', value: 'purple', class: 'bg-purple-500' },
    { name: 'Orange', value: 'orange', class: 'bg-orange-500' },
    { name: 'Pink', value: 'pink', class: 'bg-pink-500' },
    { name: 'Yellow', value: 'yellow', class: 'bg-yellow-500' },
    { name: 'Indigo', value: 'indigo', class: 'bg-indigo-500' }
  ];

  const navigateMonth = (direction: number) => {
    setCurrentView(prev => ({
      ...prev,
      date: new Date(year, month + direction, 1)
    }));
  };

  const navigateToToday = () => {
    setCurrentView(prev => ({
      ...prev,
      date: new Date()
    }));
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString() &&
        (filterCategory === 'all' || event.category === filterCategory) &&
        (searchQuery === '' || 
         event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         event.description.toLowerCase().includes(searchQuery.toLowerCase()));
    });
  };

  const createNewEvent = (date?: Date) => {
    const newEvent: Event = {
      id: Date.now().toString(),
      title: '',
      description: '',
      date: date || selectedDate || new Date(),
      startTime: '09:00',
      endTime: '10:00',
      location: '',
      attendees: [],
      category: 'personal',
      priority: 'medium',
      color: 'blue',
      reminder: 15,
      recurring: 'none',
      completed: false,
      starred: false
    };
    setEditingEvent(newEvent);
    setShowEventModal(true);
  };

  const saveEvent = () => {
    if (!editingEvent || !editingEvent.title.trim()) return;
    
    if (events.find(e => e.id === editingEvent.id)) {
      setEvents(prev => prev.map(e => e.id === editingEvent.id ? editingEvent : e));
    } else {
      setEvents(prev => [...prev, editingEvent]);
    }
    
    setShowEventModal(false);
    setEditingEvent(null);
  };

  const deleteEvent = (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    setEvents(prev => prev.filter(e => e.id !== eventId));
    setShowEventModal(false);
    setEditingEvent(null);
  };

  const toggleEventStar = (eventId: string) => {
    setEvents(prev => prev.map(e => 
      e.id === eventId ? { ...e, starred: !e.starred } : e
    ));
  };

  const toggleEventComplete = (eventId: string) => {
    setEvents(prev => prev.map(e => 
      e.id === eventId ? { ...e, completed: !e.completed } : e
    ));
  };

  const getCategoryColor = (category: string) => {
    const categoryColors: { [key: string]: string } = {
      work: 'bg-blue-500',
      personal: 'bg-green-500',
      health: 'bg-red-500',
      social: 'bg-purple-500',
      other: 'bg-yellow-500'
    };
    return categoryColors[category] || 'bg-gray-500';
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-3 h-3 text-red-500" />;
      case 'medium': return <Circle className="w-3 h-3 text-yellow-500" />;
      case 'low': return <Circle className="w-3 h-3 text-green-500" />;
      default: return null;
    }
  };

  const exportCalendar = () => {
    const dataStr = JSON.stringify(events, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'calendar-export.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold flex items-center">
              <CalendarIcon className="w-6 h-6 mr-2" />
              Calendar
            </h1>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentView(prev => ({ ...prev, type: 'month' }))}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${
                  currentView.type === 'month' ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setCurrentView(prev => ({ ...prev, type: 'week' }))}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${
                  currentView.type === 'week' ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setCurrentView(prev => ({ ...prev, type: 'agenda' }))}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${
                  currentView.type === 'agenda' ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
                }`}
              >
                Agenda
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-48"
              />
            </div>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            
            <button
              onClick={() => createNewEvent()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Event
            </button>
            
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-medium min-w-[200px] text-center">
                {monthNames[month]} {year}
              </h2>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            <button
              onClick={navigateToToday}
              className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-sm rounded-lg transition-colors"
            >
              Today
            </button>
          </div>

          <div className="text-sm text-gray-400">
            {events.length} events • {events.filter(e => e.starred).length} starred
          </div>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="flex-1 flex">
        {currentView.type === 'month' && (
          <div className="flex-1 p-4">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-400 p-3">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 flex-1">
              {days.map((day, index) => {
                const isCurrentMonth = day.getMonth() === month;
                const isToday = day.toDateString() === today.toDateString();
                const dayEvents = getEventsForDate(day);
                
                return (
                  <div
                    key={index}
                    className={`
                      min-h-[120px] p-2 border border-gray-700 rounded-lg cursor-pointer transition-colors
                      ${isCurrentMonth ? 'bg-gray-800 hover:bg-gray-750' : 'bg-gray-850 text-gray-500'}
                      ${isToday ? 'ring-2 ring-blue-500' : ''}
                      ${selectedDate?.toDateString() === day.toDateString() ? 'bg-blue-900/30' : ''}
                    `}
                    onClick={() => {
                      setSelectedDate(day);
                      if (dayEvents.length === 0) {
                        createNewEvent(day);
                      }
                    }}
                  >
                    <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-400' : ''}`}>
                      {day.getDate()}
                    </div>
                    
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className={`text-xs p-1 rounded truncate cursor-pointer ${getCategoryColor(event.category)} bg-opacity-20 border-l-2 border-${event.color}-500`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingEvent(event);
                            setShowEventModal(true);
                          }}
                          title={`${event.title} (${event.startTime} - ${event.endTime})`}
                        >
                          <div className="flex items-center space-x-1">
                            {event.starred && <Star className="w-2 h-2 fill-current text-yellow-500" />}
                            {event.completed && <CheckCircle className="w-2 h-2 text-green-500" />}
                            {getPriorityIcon(event.priority)}
                            <span className="truncate">{event.title}</span>
                          </div>
                        </div>
                      ))}
                      
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-gray-400 text-center">
                          +{dayEvents.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {currentView.type === 'agenda' && (
          <div className="flex-1 p-4">
            <div className="space-y-4">
              {events
                .filter(event => 
                  (filterCategory === 'all' || event.category === filterCategory) &&
                  (searchQuery === '' || 
                   event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   event.description.toLowerCase().includes(searchQuery.toLowerCase()))
                )
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((event) => (
                  <div
                    key={event.id}
                    className={`p-4 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-750 transition-colors cursor-pointer ${
                      event.completed ? 'opacity-60' : ''
                    }`}
                    onClick={() => {
                      setEditingEvent(event);
                      setShowEventModal(true);
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getCategoryColor(event.category)}`}></div>
                        <h3 className={`font-medium ${event.completed ? 'line-through' : ''}`}>
                          {event.title}
                        </h3>
                        {event.starred && <Star className="w-4 h-4 fill-current text-yellow-500" />}
                        {getPriorityIcon(event.priority)}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleEventComplete(event.id);
                          }}
                          className={`p-1 rounded transition-colors ${
                            event.completed ? 'text-green-500' : 'text-gray-400 hover:text-green-500'
                          }`}
                        >
                          {event.completed ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleEventStar(event.id);
                          }}
                          className={`p-1 rounded transition-colors ${
                            event.starred ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                          }`}
                        >
                          {event.starred ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-400 mb-2">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {event.startTime} - {event.endTime}
                        </span>
                        {event.location && (
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {event.location}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {event.description && (
                      <p className="text-sm text-gray-300 mb-2">{event.description}</p>
                    )}
                    
                    {event.attendees.length > 0 && (
                      <div className="flex items-center text-xs text-gray-400">
                        <Users className="w-3 h-3 mr-1" />
                        {event.attendees.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              
              {events.length === 0 && (
                <div className="text-center py-12">
                  <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <h3 className="text-lg font-medium text-gray-400 mb-2">No events yet</h3>
                  <p className="text-gray-500 mb-4">Create your first event to get started</p>
                  <button
                    onClick={() => createNewEvent()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Create Event
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Event Modal */}
      {showEventModal && editingEvent && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">
                  {events.find(e => e.id === editingEvent.id) ? 'Edit Event' : 'New Event'}
                </h3>
                <button
                  onClick={() => {
                    setShowEventModal(false);
                    setEditingEvent(null);
                  }}
                  className="p-1 hover:bg-gray-700 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <input
                    type="text"
                    value={editingEvent.title}
                    onChange={(e) => setEditingEvent(prev => prev ? { ...prev, title: e.target.value } : null)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Event title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={editingEvent.description}
                    onChange={(e) => setEditingEvent(prev => prev ? { ...prev, description: e.target.value } : null)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 h-20 resize-none"
                    placeholder="Event description"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Date</label>
                    <input
                      type="date"
                      value={editingEvent.date.toISOString().split('T')[0]}
                      onChange={(e) => setEditingEvent(prev => prev ? { ...prev, date: new Date(e.target.value) } : null)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={editingEvent.category}
                      onChange={(e) => setEditingEvent(prev => prev ? { ...prev, category: e.target.value as any } : null)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      <option value="work">Work</option>
                      <option value="personal">Personal</option>
                      <option value="health">Health</option>
                      <option value="social">Social</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Time</label>
                    <input
                      type="time"
                      value={editingEvent.startTime}
                      onChange={(e) => setEditingEvent(prev => prev ? { ...prev, startTime: e.target.value } : null)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">End Time</label>
                    <input
                      type="time"
                      value={editingEvent.endTime}
                      onChange={(e) => setEditingEvent(prev => prev ? { ...prev, endTime: e.target.value } : null)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <input
                    type="text"
                    value={editingEvent.location}
                    onChange={(e) => setEditingEvent(prev => prev ? { ...prev, location: e.target.value } : null)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Event location"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Priority</label>
                    <select
                      value={editingEvent.priority}
                      onChange={(e) => setEditingEvent(prev => prev ? { ...prev, priority: e.target.value as any } : null)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Reminder (minutes)</label>
                    <select
                      value={editingEvent.reminder}
                      onChange={(e) => setEditingEvent(prev => prev ? { ...prev, reminder: Number(e.target.value) } : null)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      <option value={0}>No reminder</option>
                      <option value={5}>5 minutes</option>
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={1440}>1 day</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingEvent.starred}
                      onChange={(e) => setEditingEvent(prev => prev ? { ...prev, starred: e.target.checked } : null)}
                      className="rounded"
                    />
                    <span className="text-sm">Star this event</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingEvent.completed}
                      onChange={(e) => setEditingEvent(prev => prev ? { ...prev, completed: e.target.checked } : null)}
                      className="rounded"
                    />
                    <span className="text-sm">Mark as completed</span>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700">
                <div>
                  {events.find(e => e.id === editingEvent.id) && (
                    <button
                      onClick={() => deleteEvent(editingEvent.id)}
                      className="px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      Delete Event
                    </button>
                  )}
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      setShowEventModal(false);
                      setEditingEvent(null);
                    }}
                    className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveEvent}
                    disabled={!editingEvent.title.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    Save Event
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-96">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Calendar Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 hover:bg-gray-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Export Calendar</label>
                <button
                  onClick={exportCalendar}
                  className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center justify-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export as JSON
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Statistics</label>
                <div className="text-sm text-gray-400 space-y-1">
                  <div>Total events: {events.length}</div>
                  <div>Upcoming events: {events.filter(e => new Date(e.date) >= today).length}</div>
                  <div>Starred events: {events.filter(e => e.starred).length}</div>
                  <div>Completed events: {events.filter(e => e.completed).length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;