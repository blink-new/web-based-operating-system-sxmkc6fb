import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat, Heart, MoreHorizontal, Search, Music } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  url: string;
  cover?: string;
  liked: boolean;
}

interface Playlist {
  id: string;
  name: string;
  tracks: string[];
  cover?: string;
}

const MusicPlayer: React.FC = () => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'library' | 'playlists' | 'liked'>('library');
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // Demo tracks (in a real app, these would be actual audio files)
  const [tracks] = useState<Track[]>([
    {
      id: '1',
      title: 'Ambient Waves',
      artist: 'Nature Sounds',
      album: 'Relaxation Collection',
      duration: 240,
      url: 'demo-track-1',
      liked: true
    },
    {
      id: '2',
      title: 'Digital Dreams',
      artist: 'Synthwave Artist',
      album: 'Neon Nights',
      duration: 195,
      url: 'demo-track-2',
      liked: false
    },
    {
      id: '3',
      title: 'Coffee Shop Jazz',
      artist: 'Jazz Ensemble',
      album: 'Urban Vibes',
      duration: 312,
      url: 'demo-track-3',
      liked: true
    },
    {
      id: '4',
      title: 'Mountain Echo',
      artist: 'Acoustic Duo',
      album: 'Wilderness',
      duration: 278,
      url: 'demo-track-4',
      liked: false
    },
    {
      id: '5',
      title: 'Electric Pulse',
      artist: 'Electronic Artist',
      album: 'Future Bass',
      duration: 203,
      url: 'demo-track-5',
      liked: true
    },
    {
      id: '6',
      title: 'Sunset Boulevard',
      artist: 'Indie Rock Band',
      album: 'City Lights',
      duration: 256,
      url: 'demo-track-6',
      liked: false
    }
  ]);

  const [playlists] = useState<Playlist[]>([
    {
      id: '1',
      name: 'Chill Vibes',
      tracks: ['1', '3', '4']
    },
    {
      id: '2',
      name: 'Electronic Mix',
      tracks: ['2', '5']
    },
    {
      id: '3',
      name: 'Favorites',
      tracks: ['1', '3', '5']
    }
  ]);

  const filteredTracks = tracks.filter(track =>
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.album.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const likedTracks = tracks.filter(track => track.liked);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (!currentTrack) {
      // Start playing first track if none selected
      setCurrentTrack(tracks[0]);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleTrackSelect = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  const handlePrevious = () => {
    if (!currentTrack) return;
    
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : tracks.length - 1;
    setCurrentTrack(tracks[previousIndex]);
    setCurrentTime(0);
  };

  const handleNext = useCallback(() => {
    if (!currentTrack) return;
    
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = currentIndex < tracks.length - 1 ? currentIndex + 1 : 0;
    setCurrentTrack(tracks[nextIndex]);
    setCurrentTime(0);
  }, [currentTrack, tracks]);

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

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    const modes: ('none' | 'one' | 'all')[] = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };

  const toggleLike = (trackId: string) => {
    // In a real app, this would update the backend
    console.log(`Toggle like for track ${trackId}`);
  };

  // Simulate audio playback
  useEffect(() => {
    if (isPlaying && currentTrack) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= currentTrack.duration) {
            // Track ended
            if (repeatMode === 'one') {
              return 0;
            } else if (repeatMode === 'all' || tracks.length > 1) {
              handleNext();
              return 0;
            } else {
              setIsPlaying(false);
              return currentTrack.duration;
            }
          }
          return prev + 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying, currentTrack, repeatMode, handleNext, tracks.length]);

  const TrackList: React.FC<{ tracks: Track[]; title: string }> = ({ tracks, title }) => (
    <div className="flex-1 overflow-y-auto">
      <h2 className="text-xl font-bold p-4 border-b border-gray-200">{title}</h2>
      <div className="divide-y divide-gray-100">
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer ${
              currentTrack?.id === track.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
            }`}
            onClick={() => handleTrackSelect(track)}
          >
            <div className="w-8 text-center text-sm text-gray-500">
              {currentTrack?.id === track.id && isPlaying ? (
                <div className="flex justify-center">
                  <div className="flex space-x-1">
                    <div className="w-1 h-4 bg-blue-500 animate-pulse"></div>
                    <div className="w-1 h-4 bg-blue-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1 h-4 bg-blue-500 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              ) : (
                index + 1
              )}
            </div>
            <div className="flex-1 min-w-0 ml-3">
              <div className="font-medium text-sm truncate">{track.title}</div>
              <div className="text-xs text-gray-500 truncate">{track.artist} • {track.album}</div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(track.id);
                }}
                className={`p-1 rounded hover:bg-gray-200 ${
                  track.liked ? 'text-red-500' : 'text-gray-400'
                }`}
              >
                <Heart className={`w-4 h-4 ${track.liked ? 'fill-current' : ''}`} />
              </button>
              <span className="text-xs text-gray-500 w-12 text-right">
                {formatTime(track.duration)}
              </span>
              <button className="p-1 rounded hover:bg-gray-200 text-gray-400">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <Music className="w-6 h-6 text-blue-500" />
          <h1 className="text-xl font-bold">Music Player</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search music..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-64"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-200 flex flex-col">
          <div className="p-4">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveView('library')}
                className={`w-full text-left px-3 py-2 rounded-lg ${
                  activeView === 'library' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                }`}
              >
                Library
              </button>
              <button
                onClick={() => setActiveView('liked')}
                className={`w-full text-left px-3 py-2 rounded-lg ${
                  activeView === 'liked' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                }`}
              >
                Liked Songs
              </button>
              <button
                onClick={() => setActiveView('playlists')}
                className={`w-full text-left px-3 py-2 rounded-lg ${
                  activeView === 'playlists' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                }`}
              >
                Playlists
              </button>
            </nav>
          </div>

          {/* Playlists */}
          {activeView === 'playlists' && (
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 pt-0">
                <h3 className="font-semibold text-sm text-gray-700 mb-2">Your Playlists</h3>
                <div className="space-y-1">
                  {playlists.map((playlist) => (
                    <button
                      key={playlist.id}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                    >
                      {playlist.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {activeView === 'library' && (
            <TrackList tracks={filteredTracks} title="Your Library" />
          )}
          {activeView === 'liked' && (
            <TrackList tracks={likedTracks} title="Liked Songs" />
          )}
          {activeView === 'playlists' && (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Music className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Select a playlist</p>
                <p className="text-sm">Choose a playlist from the sidebar to view its tracks</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Player Controls */}
      <div className="border-t border-gray-200 bg-gray-50 p-4">
        {/* Now Playing Info */}
        {currentTrack && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-medium text-sm">{currentTrack.title}</div>
                <div className="text-xs text-gray-500">{currentTrack.artist}</div>
              </div>
            </div>
            
            <button
              onClick={() => toggleLike(currentTrack.id)}
              className={`p-2 rounded-full hover:bg-gray-200 ${
                currentTrack.liked ? 'text-red-500' : 'text-gray-400'
              }`}
            >
              <Heart className={`w-5 h-5 ${currentTrack.liked ? 'fill-current' : ''}`} />
            </button>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          <button
            onClick={toggleShuffle}
            className={`p-2 rounded-full hover:bg-gray-200 ${
              isShuffled ? 'text-blue-500' : 'text-gray-400'
            }`}
            title="Shuffle"
          >
            <Shuffle className="w-4 h-4" />
          </button>
          
          <button
            onClick={handlePrevious}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-700"
            title="Previous"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          
          <button
            onClick={handlePlayPause}
            className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>
          
          <button
            onClick={handleNext}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-700"
            title="Next"
          >
            <SkipForward className="w-5 h-5" />
          </button>
          
          <button
            onClick={toggleRepeat}
            className={`p-2 rounded-full hover:bg-gray-200 ${
              repeatMode !== 'none' ? 'text-blue-500' : 'text-gray-400'
            }`}
            title={`Repeat: ${repeatMode}`}
          >
            <Repeat className="w-4 h-4" />
            {repeatMode === 'one' && (
              <span className="absolute -mt-1 -ml-1 text-xs font-bold">1</span>
            )}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center space-x-3 mb-2">
          <span className="text-xs text-gray-500 w-10 text-right">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max={currentTrack?.duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                currentTrack ? (currentTime / currentTrack.duration) * 100 : 0
              }%, #e5e7eb ${
                currentTrack ? (currentTime / currentTrack.duration) * 100 : 0
              }%, #e5e7eb 100%)`
            }}
          />
          <span className="text-xs text-gray-500 w-10">
            {currentTrack ? formatTime(currentTrack.duration) : '0:00'}
          </span>
        </div>

        {/* Volume Control */}
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={toggleMute}
            className="p-1 rounded hover:bg-gray-200 text-gray-600"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-24 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;