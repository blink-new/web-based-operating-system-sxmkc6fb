import React, { useState } from 'react';
import { Mail, Send, Reply, Forward, Trash2, Star, Archive, Search, Paperclip, Bold, Italic, Underline } from 'lucide-react';

interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  date: Date;
  read: boolean;
  starred: boolean;
  folder: 'inbox' | 'sent' | 'drafts' | 'trash';
  attachments?: string[];
}

const Email: React.FC = () => {
  const [selectedFolder, setSelectedFolder] = useState<'inbox' | 'sent' | 'drafts' | 'trash'>('inbox');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [composing, setComposing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [composeData, setComposeData] = useState({
    to: '',
    subject: '',
    body: ''
  });

  const [emails, setEmails] = useState<Email[]>([
    {
      id: '1',
      from: 'john.doe@example.com',
      to: 'me@webos.com',
      subject: 'Welcome to WebOS Email!',
      body: `Dear User,

Welcome to the WebOS Email application! This is a fully functional email client with the following features:

• Compose and send emails
• Reply and forward messages
• Organize emails in folders
• Search functionality
• Star important messages
• Rich text formatting
• Attachment support

We hope you enjoy using WebOS Email. If you have any questions, please don't hesitate to reach out.

Best regards,
The WebOS Team`,
      date: new Date('2024-01-20T10:30:00'),
      read: false,
      starred: false,
      folder: 'inbox'
    },
    {
      id: '2',
      from: 'newsletter@techblog.com',
      to: 'me@webos.com',
      subject: 'Latest Tech News - January 2024',
      body: `Hi there!

Here are the top tech stories this week:

1. AI Breakthrough in Natural Language Processing
2. New Web Technologies Revolutionizing Development
3. Cybersecurity Trends to Watch in 2024
4. The Future of Cloud Computing

Click here to read the full articles on our website.

Unsubscribe | Update Preferences`,
      date: new Date('2024-01-19T14:15:00'),
      read: true,
      starred: true,
      folder: 'inbox'
    },
    {
      id: '3',
      from: 'support@webos.com',
      to: 'me@webos.com',
      subject: 'Your WebOS Account Setup',
      body: `Hello,

Your WebOS account has been successfully set up! Here are your account details:

Username: webos-user
Email: me@webos.com
Account Type: Premium

You now have access to all WebOS applications and features. Enjoy exploring your new web-based operating system!

If you need any assistance, our support team is here to help.

Best regards,
WebOS Support Team`,
      date: new Date('2024-01-18T09:45:00'),
      read: true,
      starred: false,
      folder: 'inbox'
    }
  ]);

  const folders = [
    { id: 'inbox', name: 'Inbox', icon: Mail, count: emails.filter(e => e.folder === 'inbox').length },
    { id: 'sent', name: 'Sent', icon: Send, count: emails.filter(e => e.folder === 'sent').length },
    { id: 'drafts', name: 'Drafts', icon: Mail, count: emails.filter(e => e.folder === 'drafts').length },
    { id: 'trash', name: 'Trash', icon: Trash2, count: emails.filter(e => e.folder === 'trash').length }
  ];

  const filteredEmails = emails
    .filter(email => email.folder === selectedFolder)
    .filter(email => 
      searchQuery === '' || 
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.body.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
    if (!email.read) {
      setEmails(prev => prev.map(e => 
        e.id === email.id ? { ...e, read: true } : e
      ));
    }
    setComposing(false);
  };

  const handleCompose = () => {
    setComposing(true);
    setSelectedEmail(null);
    setComposeData({ to: '', subject: '', body: '' });
  };

  const handleReply = (email: Email) => {
    setComposing(true);
    setSelectedEmail(null);
    setComposeData({
      to: email.from,
      subject: `Re: ${email.subject}`,
      body: `\n\n--- Original Message ---\nFrom: ${email.from}\nDate: ${email.date.toLocaleString()}\nSubject: ${email.subject}\n\n${email.body}`
    });
  };

  const handleForward = (email: Email) => {
    setComposing(true);
    setSelectedEmail(null);
    setComposeData({
      to: '',
      subject: `Fwd: ${email.subject}`,
      body: `\n\n--- Forwarded Message ---\nFrom: ${email.from}\nTo: ${email.to}\nDate: ${email.date.toLocaleString()}\nSubject: ${email.subject}\n\n${email.body}`
    });
  };

  const handleSend = () => {
    if (composeData.to && composeData.subject) {
      const newEmail: Email = {
        id: Date.now().toString(),
        from: 'me@webos.com',
        to: composeData.to,
        subject: composeData.subject,
        body: composeData.body,
        date: new Date(),
        read: true,
        starred: false,
        folder: 'sent'
      };
      
      setEmails(prev => [...prev, newEmail]);
      setComposing(false);
      setComposeData({ to: '', subject: '', body: '' });
      alert('Email sent successfully!');
    }
  };

  const handleDelete = (email: Email) => {
    setEmails(prev => prev.map(e => 
      e.id === email.id ? { ...e, folder: 'trash' } : e
    ));
    setSelectedEmail(null);
  };

  const handleStar = (email: Email) => {
    setEmails(prev => prev.map(e => 
      e.id === email.id ? { ...e, starred: !e.starred } : e
    ));
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="h-full flex bg-white">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-200 flex flex-col">
        {/* Compose Button */}
        <div className="p-4">
          <button
            onClick={handleCompose}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center space-x-2"
          >
            <Mail className="w-4 h-4" />
            <span>Compose</span>
          </button>
        </div>

        {/* Folders */}
        <div className="flex-1 overflow-y-auto">
          {folders.map((folder) => {
            const Icon = folder.icon;
            return (
              <button
                key={folder.id}
                onClick={() => setSelectedFolder(folder.id as any)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center justify-between ${
                  selectedFolder === folder.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 text-gray-600" />
                  <span className="font-medium">{folder.name}</span>
                </div>
                {folder.count > 0 && (
                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                    {folder.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Email List */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-y-auto">
          {filteredEmails.map((email) => (
            <div
              key={email.id}
              onClick={() => handleEmailClick(email)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedEmail?.id === email.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              } ${!email.read ? 'bg-blue-25' : ''}`}
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  <span className={`text-sm truncate ${!email.read ? 'font-semibold' : ''}`}>
                    {email.from}
                  </span>
                  {email.starred && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                </div>
                <span className="text-xs text-gray-500 ml-2">{formatDate(email.date)}</span>
              </div>
              <div className={`text-sm mb-1 truncate ${!email.read ? 'font-semibold' : ''}`}>
                {email.subject}
              </div>
              <div className="text-xs text-gray-600 truncate">
                {email.body.substring(0, 100)}...
              </div>
            </div>
          ))}
          
          {filteredEmails.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              {searchQuery ? 'No emails match your search' : `No emails in ${selectedFolder}`}
            </div>
          )}
        </div>
      </div>

      {/* Email Content */}
      <div className="flex-1 flex flex-col">
        {composing ? (
          /* Compose View */
          <div className="flex-1 flex flex-col">
            {/* Compose Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">New Message</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={handleSend}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </button>
                  <button
                    onClick={() => setComposing(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <label className="w-12 text-sm text-gray-600">To:</label>
                  <input
                    type="email"
                    value={composeData.to}
                    onChange={(e) => setComposeData(prev => ({ ...prev, to: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded"
                    placeholder="recipient@example.com"
                  />
                </div>
                <div className="flex items-center">
                  <label className="w-12 text-sm text-gray-600">Subject:</label>
                  <input
                    type="text"
                    value={composeData.subject}
                    onChange={(e) => setComposeData(prev => ({ ...prev, subject: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded"
                    placeholder="Email subject"
                  />
                </div>
              </div>
            </div>

            {/* Formatting Toolbar */}
            <div className="p-2 border-b border-gray-200 flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded" title="Bold">
                <Bold className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded" title="Italic">
                <Italic className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded" title="Underline">
                <Underline className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
              <button className="p-2 hover:bg-gray-100 rounded" title="Attach File">
                <Paperclip className="w-4 h-4" />
              </button>
            </div>

            {/* Compose Body */}
            <textarea
              value={composeData.body}
              onChange={(e) => setComposeData(prev => ({ ...prev, body: e.target.value }))}
              className="flex-1 p-4 resize-none outline-none"
              placeholder="Write your message here..."
            />
          </div>
        ) : selectedEmail ? (
          /* Email View */
          <div className="flex-1 flex flex-col">
            {/* Email Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold truncate">{selectedEmail.subject}</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleStar(selectedEmail)}
                    className={`p-2 rounded hover:bg-gray-100 ${
                      selectedEmail.starred ? 'text-yellow-500' : 'text-gray-400'
                    }`}
                    title="Star"
                  >
                    <Star className={`w-4 h-4 ${selectedEmail.starred ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => handleReply(selectedEmail)}
                    className="p-2 rounded hover:bg-gray-100 text-gray-600"
                    title="Reply"
                  >
                    <Reply className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleForward(selectedEmail)}
                    className="p-2 rounded hover:bg-gray-100 text-gray-600"
                    title="Forward"
                  >
                    <Forward className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(selectedEmail)}
                    className="p-2 rounded hover:bg-gray-100 text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 space-y-1">
                <div><strong>From:</strong> {selectedEmail.from}</div>
                <div><strong>To:</strong> {selectedEmail.to}</div>
                <div><strong>Date:</strong> {selectedEmail.date.toLocaleString()}</div>
              </div>
            </div>

            {/* Email Body */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {selectedEmail.body}
              </div>
            </div>
          </div>
        ) : (
          /* No Selection */
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Mail className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Select an email to read</p>
              <p className="text-sm">Choose an email from the list to view its contents</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Email;