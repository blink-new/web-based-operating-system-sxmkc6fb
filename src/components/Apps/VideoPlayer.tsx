import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward, Settings, MoreHorizontal, Film } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  duration: number;
  thumbnail: string;
  url: string;
  description: string;
  views: number;
  uploadDate: Date;
}

const VideoPlayer: React.FC = () => {
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [quality, setQuality] = useState('1080p');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Demo videos
  const [videos] = useState<Video[]>([
    {
      id: '1',
      title: 'Nature Documentary: Ocean Life',
      duration: 1800, // 30 minutes
      thumbnail: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=225&fit=crop',
      url: 'demo-video-1',
      description: 'Explore the fascinating world beneath the waves in this stunning nature documentary.',
      views: 125000,
      uploadDate: new Date('2024-01-15')
    },
    {
      id: '2',
      title: 'Tech Review: Latest Smartphones',
      duration: 900, // 15 minutes
      thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=225&fit=crop',
      url: 'demo-video-2',
      description: 'Comprehensive review of the newest smartphones hitting the market this year.',
      views: 89000,
      uploadDate: new Date('2024-01-12')
    },
    {
      id: '3',
      title: 'Cooking Tutorial: Italian Pasta',
      duration: 1200, // 20 minutes
      thumbnail: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=225&fit=crop',
      url: 'demo-video-3',
      description: 'Learn to make authentic Italian pasta from scratch with this step-by-step tutorial.',
      views: 67000,
      uploadDate: new Date('2024-01-10')
    },
    {
      id: '4',
      title: 'Travel Vlog: Tokyo Adventures',
      duration: 2100, // 35 minutes
      thumbnail: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=225&fit=crop',
      url: 'demo-video-4',
      description: 'Join us on an incredible journey through the bustling streets of Tokyo.',
      views: 156000,
      uploadDate: new Date('2024-01-08')
    },
    {
      id: '5',
      title: 'Fitness Workout: Full Body HIIT',
      duration: 1800, // 30 minutes
      thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=225&fit=crop',
      url: 'demo-video-5',
      description: 'High-intensity interval training workout that targets your entire body.',
      views: 234000,
      uploadDate: new Date('2024-01-05')
    },
    {
      id: '6',
      title: 'Music Performance: Jazz Ensemble',
      duration: 2700, // 45 minutes
      thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=225&fit=crop',
      url: 'demo-video-6',
      description: 'Live jazz performance featuring talented musicians from around the world.',
      views: 45000,
      uploadDate: new Date('2024-01-03')
    }
  ]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M views`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`;
    }
    return `${views} views`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVideoSelect = (video: Video) => {
    setCurrentVideo(video);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const skipTime = (seconds: number) => {
    if (currentVideo) {
      const newTime = Math.max(0, Math.min(currentVideo.duration, currentTime + seconds));
      setCurrentTime(newTime);
    }
  };

  // Simulate video playback
  useEffect(() => {
    if (isPlaying && currentVideo) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= currentVideo.duration) {
            setIsPlaying(false);
            return currentVideo.duration;
          }
          return prev + 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying, currentVideo]);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className="h-full flex bg-black">
      {/* Video Player */}
      <div className="flex-1 flex flex-col">
        {currentVideo ? (
          <div
            ref={playerRef}
            className="flex-1 relative bg-black cursor-pointer"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setShowControls(false)}
          >
            {/* Video Display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={currentVideo.thumbnail}
                alt={currentVideo.title}
                className="max-w-full max-h-full object-contain"
              />
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={handlePlayPause}
                    className="p-6 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all"
                  >
                    <Play className="w-12 h-12" />
                  </button>
                </div>
              )}
            </div>

            {/* Video Controls */}
            <div
              className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 transition-opacity duration-300 ${
                showControls ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {/* Progress Bar */}
              <div className="mb-4">
                <input
                  type="range"
                  min="0"
                  max={currentVideo.duration}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${
                      (currentTime / currentVideo.duration) * 100
                    }%, #4b5563 ${
                      (currentTime / currentVideo.duration) * 100
                    }%, #4b5563 100%)`
                  }}
                />
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handlePlayPause}
                    className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 text-white"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </button>
                  
                  <button
                    onClick={() => skipTime(-10)}
                    className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 text-white"
                    title="Skip back 10s"
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => skipTime(10)}
                    className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 text-white"
                    title="Skip forward 10s"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={toggleMute}
                      className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 text-white"
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(currentVideo.duration)}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <select
                    value={playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                    className="bg-transparent text-white text-sm border border-gray-600 rounded px-2 py-1"
                  >
                    <option value={0.5} className="bg-black">0.5x</option>
                    <option value={0.75} className="bg-black">0.75x</option>
                    <option value={1} className="bg-black">1x</option>
                    <option value={1.25} className="bg-black">1.25x</option>
                    <option value={1.5} className="bg-black">1.5x</option>
                    <option value={2} className="bg-black">2x</option>
                  </select>

                  <select
                    value={quality}
                    onChange={(e) => setQuality(e.target.value)}
                    className="bg-transparent text-white text-sm border border-gray-600 rounded px-2 py-1"
                  >
                    <option value="480p" className="bg-black">480p</option>
                    <option value="720p" className="bg-black">720p</option>
                    <option value="1080p" className="bg-black">1080p</option>
                    <option value="4K" className="bg-black">4K</option>
                  </select>

                  <button
                    onClick={toggleFullscreen}
                    className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 text-white"
                    title="Fullscreen"
                  >
                    <Maximize className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-white">
            <div className="text-center">
              <Film className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-xl mb-2">Select a video to play</p>
              <p className="text-gray-400">Choose from the video library on the right</p>
            </div>
          </div>
        )}

        {/* Video Info */}
        {currentVideo && (
          <div className="bg-gray-900 text-white p-4">
            <h2 className="text-xl font-bold mb-2">{currentVideo.title}</h2>
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div>
                {formatViews(currentVideo.views)} • {currentVideo.uploadDate.toLocaleDateString()}
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-full hover:bg-gray-700">
                  <Settings className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-700">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-gray-300 mt-2 text-sm">{currentVideo.description}</p>
          </div>
        )}
      </div>

      {/* Video Library */}
      <div className="w-80 bg-gray-900 text-white overflow-y-auto">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold">Video Library</h3>
        </div>
        
        <div className="divide-y divide-gray-700">
          {videos.map((video) => (
            <div
              key={video.id}
              onClick={() => handleVideoSelect(video)}
              className={`p-4 cursor-pointer hover:bg-gray-800 transition-colors ${
                currentVideo?.id === video.id ? 'bg-gray-800 border-l-4 border-l-red-500' : ''
              }`}
            >
              <div className="flex space-x-3">
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-24 h-14 object-cover rounded"
                  />
                  <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                    {formatTime(video.duration)}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-2 mb-1">{video.title}</h4>
                  <div className="text-xs text-gray-400">
                    {formatViews(video.views)}
                  </div>
                  <div className="text-xs text-gray-400">
                    {video.uploadDate.toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;