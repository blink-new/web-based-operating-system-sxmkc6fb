import React, { useState, useRef, useEffect } from 'react';

interface CommandHistory {
  command: string;
  output: string;
}

const Terminal: React.FC = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([
    { command: '', output: 'WebOS Terminal v1.0\nType "help" for available commands.\n' }
  ]);
  const [currentPath, setCurrentPath] = useState('~');
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = (cmd: string) => {
    const command = cmd.trim().toLowerCase();
    let output = '';

    switch (command) {
      case 'help':
        output = `Available commands:
  help     - Show this help message
  clear    - Clear the terminal
  ls       - List directory contents
  pwd      - Print working directory
  whoami   - Display current user
  date     - Show current date and time
  echo     - Echo text back
  cat      - Display file contents (demo)
  mkdir    - Create directory (demo)
  cd       - Change directory (demo)
  uname    - System information`;
        break;
      case 'clear':
        setHistory([]);
        return;
      case 'ls':
        output = 'Documents/  Pictures/  Downloads/  Music/  Videos/  readme.txt  project.zip';
        break;
      case 'pwd':
        output = `/home/user/${currentPath}`;
        break;
      case 'whoami':
        output = 'webos-user';
        break;
      case 'date':
        output = new Date().toString();
        break;
      case 'uname':
        output = 'WebOS 1.0 (Web-based Operating System)';
        break;
      default:
        if (command.startsWith('echo ')) {
          output = command.substring(5);
        } else if (command.startsWith('cat ')) {
          const filename = command.substring(4);
          output = `Contents of ${filename}:\nThis is a demo file in the WebOS terminal.`;
        } else if (command.startsWith('mkdir ')) {
          const dirname = command.substring(6);
          output = `Directory '${dirname}' created (demo)`;
        } else if (command.startsWith('cd ')) {
          const dirname = command.substring(3);
          setCurrentPath(dirname === '..' ? '~' : dirname);
          output = '';
        } else if (command === '') {
          output = '';
        } else {
          output = `Command not found: ${command}\nType "help" for available commands.`;
        }
    }

    setHistory(prev => [...prev, { command: cmd, output }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      executeCommand(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      // Basic tab completion could be implemented here
    }
  };

  return (
    <div className="h-full bg-black text-green-400 font-mono text-sm flex flex-col">
      {/* Terminal Output */}
      <div
        ref={terminalRef}
        className="flex-1 p-4 overflow-y-auto"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((entry, index) => (
          <div key={index} className="mb-2">
            {entry.command && (
              <div className="flex">
                <span className="text-blue-400">webos-user@webos</span>
                <span className="text-white">:</span>
                <span className="text-blue-400">{currentPath}</span>
                <span className="text-white">$ </span>
                <span className="text-green-400">{entry.command}</span>
              </div>
            )}
            {entry.output && (
              <pre className="whitespace-pre-wrap text-gray-300 mt-1">
                {entry.output}
              </pre>
            )}
          </div>
        ))}
        
        {/* Current Input Line */}
        <form onSubmit={handleSubmit} className="flex">
          <span className="text-blue-400">webos-user@webos</span>
          <span className="text-white">:</span>
          <span className="text-blue-400">{currentPath}</span>
          <span className="text-white">$ </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-green-400 outline-none"
            autoFocus
          />
        </form>
      </div>
    </div>
  );
};

export default Terminal;