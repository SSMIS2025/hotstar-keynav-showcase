import React, { useState, useRef, useEffect } from 'react';
import { Content, Program } from '../data/mockData';
import { useKeyNavigation } from '../hooks/useKeyNavigation';

interface VideoPlayerProps {
  content?: Content;
  program?: Program;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ content, program, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(100); // Mock duration
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-hide controls after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showControls]);

  // Mock time progression
  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(() => {
        setCurrentTime(prev => prev < duration ? prev + 1 : prev);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isPlaying, duration]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    setShowControls(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useKeyNavigation({
    onSelect: togglePlayPause,
    onBack: onClose,
    onLeft: () => {
      setCurrentTime(Math.max(0, currentTime - 10));
      setShowControls(true);
    },
    onRight: () => {
      setCurrentTime(Math.min(duration, currentTime + 10));
      setShowControls(true);
    },
    onUp: () => setShowControls(true),
    onDown: () => setShowControls(true),
  });

  const title = content?.title || program?.title || 'Video Content';
  const description = content?.description || program?.description || '';

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Video Area */}
      <div className="relative w-full h-full">
        {/* Mock Video Display */}
        <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-32 h-32 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
              {isPlaying ? (
                <div className="w-0 h-0 border-l-12 border-l-white border-t-8 border-t-transparent border-b-8 border-b-transparent ml-2"></div>
              ) : (
                <div className="flex gap-2">
                  <div className="w-3 h-12 bg-white rounded"></div>
                  <div className="w-3 h-12 bg-white rounded"></div>
                </div>
              )}
            </div>
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            {description && (
              <p className="text-lg opacity-75 max-w-2xl mx-auto">{description}</p>
            )}
          </div>
        </div>

        {/* Controls Overlay */}
        {showControls && (
          <>
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-6">
              <div className="flex items-center justify-between text-white">
                <div>
                  <h1 className="text-xl font-bold">{title}</h1>
                  {content && (
                    <div className="flex items-center gap-3 text-sm opacity-75 mt-1">
                      <span>{content.year}</span>
                      <span>•</span>
                      <span>{content.rating}</span>
                      <span>•</span>
                      <span>{content.genre}</span>
                      <span>•</span>
                      <span>{content.duration}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <div className="text-white">
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm">{formatTime(currentTime)}</span>
                    <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm">{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-center gap-6">
                  <button className="p-3 rounded-full bg-black/50 hover:bg-black/70 transition-colors">
                    ⏮
                  </button>
                  <button className="p-3 rounded-full bg-black/50 hover:bg-black/70 transition-colors">
                    ⏪
                  </button>
                  <button 
                    onClick={togglePlayPause}
                    className="p-4 rounded-full bg-primary hover:bg-primary/80 transition-colors"
                  >
                    {isPlaying ? '⏸' : '▶'}
                  </button>
                  <button className="p-3 rounded-full bg-black/50 hover:bg-black/70 transition-colors">
                    ⏩
                  </button>
                  <button className="p-3 rounded-full bg-black/50 hover:bg-black/70 transition-colors">
                    ⏭
                  </button>
                </div>

                {/* Key Hints */}
                <div className="mt-4 text-center text-xs opacity-75">
                  <p>⏎ Play/Pause • ← → Seek • ↑↓ Show/Hide Controls • ESC Exit</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Pause Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="bg-black/70 rounded-full p-8">
              <div className="flex gap-3">
                <div className="w-6 h-16 bg-white rounded"></div>
                <div className="w-6 h-16 bg-white rounded"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;