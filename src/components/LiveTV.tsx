import React, { useState, useEffect } from 'react';
import { channels, Channel } from '../data/mockData';
import ChannelBanner from './ChannelBanner';
import { useKeyNavigation } from '../hooks/useKeyNavigation';

interface LiveTVProps {
  onOpenGuide: () => void;
  onOpenMenu: () => void;
}

const LiveTV: React.FC<LiveTVProps> = ({ onOpenGuide, onOpenMenu }) => {
  const [currentChannelIndex, setCurrentChannelIndex] = useState(0);
  const [showBanner, setShowBanner] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const currentChannel = channels[currentChannelIndex];

  // Auto-hide banner after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBanner(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentChannelIndex]);

  const changeChannel = (direction: 'up' | 'down') => {
    const newIndex = direction === 'up' 
      ? (currentChannelIndex + 1) % channels.length
      : currentChannelIndex === 0 ? channels.length - 1 : currentChannelIndex - 1;
    
    setCurrentChannelIndex(newIndex);
    setShowBanner(true);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    setShowBanner(true);
  };

  useKeyNavigation({
    onChannelUp: () => changeChannel('up'),
    onChannelDown: () => changeChannel('down'),
    onUp: () => changeChannel('up'),
    onDown: () => changeChannel('down'),
    onSelect: togglePlayPause,
    onGuide: onOpenGuide,
    onMenu: onOpenMenu,
    onLeft: () => {
      // Show previous channel info or controls
      setShowBanner(true);
    },
    onRight: () => {
      // Show next channel info or controls
      setShowBanner(true);
    }
  });

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Video Player Area */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-24 h-24 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
              {isPlaying ? (
                <div className="w-0 h-0 border-l-8 border-l-white border-t-6 border-t-transparent border-b-6 border-b-transparent ml-1"></div>
              ) : (
                <div className="flex gap-1">
                  <div className="w-2 h-8 bg-white rounded"></div>
                  <div className="w-2 h-8 bg-white rounded"></div>
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {currentChannel.name}
            </h2>
            <p className="text-lg opacity-75">
              {currentChannel.currentProgram?.title || 'Live Streaming'}
            </p>
            <p className="text-sm opacity-50 mt-2">
              {isPlaying ? 'Press ENTER to pause' : 'Press ENTER to play'}
            </p>
            <p className="text-xs opacity-50 mt-1">
              Use ↑↓ or +/- to change channels • Press G for Guide • Press M for Menu
            </p>
          </div>
        </div>
      </div>

      {/* Channel Banner Overlay */}
      {showBanner && (
        <div className="absolute top-0 left-0 right-0 z-10">
          <ChannelBanner channel={currentChannel} showInfo={true} />
        </div>
      )}

      {/* Quick Channel Info (always visible in corner) */}
      <div className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white">
        <div className="text-sm font-mono">CH {currentChannel.lcn}</div>
        <div className="text-xs opacity-75">{currentChannel.name}</div>
      </div>

      {/* Play/Pause Indicator */}
      {!isPlaying && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-30">
          <div className="bg-black/70 rounded-full p-8">
            <div className="flex gap-2">
              <div className="w-4 h-12 bg-white rounded"></div>
              <div className="w-4 h-12 bg-white rounded"></div>
            </div>
          </div>
        </div>
      )}

      {/* Control Hints */}
      <div className="absolute bottom-4 left-4 right-4 z-20">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white text-sm">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <span>↑↓ Channel</span>
              <span>⏎ Play/Pause</span>
              <span>G Guide</span>
              <span>M Menu</span>
            </div>
            <div className="text-xs opacity-75">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTV;