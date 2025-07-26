import React, { useState, useEffect } from 'react';

const SystemMonitor: React.FC = () => {
  const [cpuUsage, setCpuUsage] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [diskUsage, setDiskUsage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate system metrics
      setCpuUsage(Math.random() * 100);
      setMemoryUsage(60 + Math.random() * 30);
      setDiskUsage(45 + Math.random() * 10);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const ProgressBar: React.FC<{ value: number; label: string; color: string }> = ({ value, label, color }) => (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm">{value.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="h-full bg-white p-6 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6">System Monitor</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Resource Usage */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Resource Usage</h2>
          <ProgressBar value={cpuUsage} label="CPU Usage" color="bg-blue-500" />
          <ProgressBar value={memoryUsage} label="Memory Usage" color="bg-green-500" />
          <ProgressBar value={diskUsage} label="Disk Usage" color="bg-yellow-500" />
        </div>

        {/* System Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">System Information</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>OS:</span>
              <span>WebOS 1.0</span>
            </div>
            <div className="flex justify-between">
              <span>Browser:</span>
              <span>{navigator.userAgent.split(' ')[0]}</span>
            </div>
            <div className="flex justify-between">
              <span>Screen:</span>
              <span>{screen.width}x{screen.height}</span>
            </div>
            <div className="flex justify-between">
              <span>Language:</span>
              <span>{navigator.language}</span>
            </div>
            <div className="flex justify-between">
              <span>Online:</span>
              <span>{navigator.onLine ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>

        {/* Running Processes */}
        <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Running Applications</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Application</th>
                  <th className="text-left py-2">CPU</th>
                  <th className="text-left py-2">Memory</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">System Monitor</td>
                  <td className="py-2">2.1%</td>
                  <td className="py-2">15.2 MB</td>
                  <td className="py-2 text-green-600">Running</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">File Manager</td>
                  <td className="py-2">0.8%</td>
                  <td className="py-2">8.7 MB</td>
                  <td className="py-2 text-green-600">Running</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Web Browser</td>
                  <td className="py-2">5.3%</td>
                  <td className="py-2">45.1 MB</td>
                  <td className="py-2 text-green-600">Running</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemMonitor;