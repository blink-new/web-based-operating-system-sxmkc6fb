import React, { useState, useEffect } from 'react';

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="h-full bg-gradient-to-br from-blue-900 to-purple-900 text-white flex flex-col items-center justify-center">
      <div className="text-center">
        <div className="text-8xl font-mono font-bold mb-4">
          {formatTime(time)}
        </div>
        <div className="text-2xl font-light">
          {formatDate(time)}
        </div>
        <div className="mt-8 text-lg opacity-75">
          Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
        </div>
      </div>
    </div>
  );
};

export default Clock;