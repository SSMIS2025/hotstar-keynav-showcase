import React, { useState, useEffect, useRef } from 'react';
import { channels, tvGuideData, TVGuideData, Program } from '../data/mockData';
import { useKeyNavigation } from '../hooks/useKeyNavigation';
import { useFavorites } from '../hooks/useFavorites';
import Navbar from './Navbar';

interface TVGuideProps {
  onClose: () => void;
  onSelectProgram: (program: Program) => void;
}

const TVGuide: React.FC<TVGuideProps> = ({ onClose, onSelectProgram }) => {
  const [selectedDay, setSelectedDay] = useState(0); // -7 to +7 from today
  const [selectedChannel, setSelectedChannel] = useState(0);
  const [selectedProgram, setSelectedProgram] = useState(0);
  const [viewMode, setViewMode] = useState<'vertical' | 'horizontal'>('vertical');
  const containerRef = useRef<HTMLDivElement>(null);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const today = new Date();
  const currentDate = new Date(today);
  currentDate.setDate(today.getDate() + selectedDay);
  
  const dateString = currentDate.toISOString().split('T')[0];
  const guideForDay = tvGuideData.filter(guide => guide.date === dateString);
  const currentChannelGuide = guideForDay[selectedChannel];
  const programs = currentChannelGuide?.programs || [];

  useKeyNavigation({
    onUp: () => {
      if (selectedChannel > 0) {
        setSelectedChannel(selectedChannel - 1);
        setSelectedProgram(0);
      }
    },
    onDown: () => {
      if (selectedChannel < channels.length - 1) {
        setSelectedChannel(selectedChannel + 1);
        setSelectedProgram(0);
      }
    },
    onLeft: () => {
      if (selectedProgram > 0) {
        setSelectedProgram(selectedProgram - 1);
      } else if (selectedDay > -7) {
        setSelectedDay(selectedDay - 1);
        setSelectedProgram(0);
      }
    },
    onRight: () => {
      if (selectedProgram < programs.length - 1) {
        setSelectedProgram(selectedProgram + 1);
      } else if (selectedDay < 7) {
        setSelectedDay(selectedDay + 1);
        setSelectedProgram(0);
      }
    },
    onSelect: () => {
      if (programs[selectedProgram]) {
        onSelectProgram(programs[selectedProgram]);
      }
    },
    onBack: onClose,
    onChannelUp: () => {
      setViewMode(viewMode === 'vertical' ? 'horizontal' : 'vertical');
    },
    onChannelDown: () => {
      if (selectedDay > -7) {
        setSelectedDay(selectedDay - 1);
        setSelectedProgram(0);
      }
    }
  });

  const formatDate = (offset: number) => {
    const date = new Date(today);
    date.setDate(today.getDate() + offset);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString: string) => {
    const time = new Date(timeString);
    return time.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const isCurrentTime = (program: Program) => {
    const now = new Date();
    const start = new Date(program.startTime);
    const end = new Date(program.endTime);
    return selectedDay === 0 && now >= start && now <= end;
  };

  const handleFavoriteToggle = (program: Program) => {
    toggleFavorite({
      id: program.id,
      type: 'program',
      title: program.title
    });
  };

  return (
    <div className="fixed inset-0 bg-background z-50" ref={containerRef}>
      <Navbar 
        title={`TV Guide - ${viewMode === 'vertical' ? 'Channel View' : 'Timeline View'}`} 
        onBack={onClose} 
      />
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setViewMode(viewMode === 'vertical' ? 'horizontal' : 'vertical')}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/80 transition-colors"
            >
              {viewMode === 'vertical' ? '📋 Switch to Timeline' : '📺 Switch to Channels'}
            </button>
            <div className="text-sm text-muted-foreground">
              {favorites.length} favorites saved
            </div>
          </div>
        </div>
        
        {/* Date navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {Array.from({ length: 15 }, (_, i) => i - 7).map((dayOffset) => (
            <button
              key={dayOffset}
              className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                selectedDay === dayOffset
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-secondary'
              }`}
              onClick={() => {
                setSelectedDay(dayOffset);
                setSelectedProgram(0);
              }}
            >
              {dayOffset === 0 ? 'Today' : formatDate(dayOffset)}
            </button>
          ))}
        </div>
      </div>

      {/* TV Guide Content */}
      {viewMode === 'vertical' ? (
        <div className="tv-guide-grid">
        {/* Channel List */}
        <div className="bg-card border-r border-border overflow-y-auto">
          <div className="sticky top-0 bg-card border-b border-border p-3">
            <h3 className="font-semibold text-sm">Channels</h3>
          </div>
          {channels.map((channel, index) => (
            <div
              key={channel.id}
              className={`p-3 border-b border-border cursor-pointer transition-colors flex items-center gap-3 ${
                selectedChannel === index
                  ? 'bg-primary/10 border-l-4 border-l-primary'
                  : 'hover:bg-secondary/50'
              }`}
              onClick={() => {
                setSelectedChannel(index);
                setSelectedProgram(0);
              }}
            >
              <img 
                src={channel.logo} 
                alt={channel.name}
                className="w-8 h-8 rounded object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-mono text-muted-foreground">
                    {channel.lcn}
                  </span>
                  {channel.isHD && (
                    <span className="text-xs text-primary">HD</span>
                  )}
                </div>
                <div className="text-sm font-medium truncate">
                  {channel.name}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Programs Timeline */}
        <div className="overflow-auto">
          <div className="sticky top-0 bg-card border-b border-border p-3">
            <h3 className="font-semibold text-sm">
              {formatDate(selectedDay)} - {channels[selectedChannel]?.name}
            </h3>
          </div>
          
          <div className="p-4">
            {programs.length > 0 ? (
              <div className="space-y-2">
                {programs.map((program, index) => (
                  <div
                    key={program.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all relative ${
                      selectedProgram === index
                        ? 'border-primary bg-primary/10 scale-[1.02]'
                        : isCurrentTime(program)
                        ? 'border-red-500 bg-red-500/10'
                        : 'border-border bg-card hover:bg-secondary/50'
                    }`}
                    onClick={() => {
                      setSelectedProgram(index);
                      onSelectProgram(program);
                    }}
                  >
                    {isFavorite(program.id, 'program') && (
                      <div className="favorite-indicator">
                        ❤️
                      </div>
                    )}
                    
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-foreground">
                        {program.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFavoriteToggle(program);
                          }}
                          className={`p-1 rounded transition-colors ${
                            isFavorite(program.id, 'program') 
                              ? 'text-red-500 hover:text-red-400' 
                              : 'text-muted-foreground hover:text-red-500'
                          }`}
                        >
                          {isFavorite(program.id, 'program') ? '❤️' : '🤍'}
                        </button>
                        {isCurrentTime(program) && (
                          <span className="px-2 py-1 bg-red-500 text-white text-xs rounded font-bold">
                            LIVE
                          </span>
                        )}
                        {program.rating && (
                          <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                            {program.rating}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {program.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>
                        {formatTime(program.startTime)} - {formatTime(program.endTime)}
                      </span>
                      <span>•</span>
                      <span>{program.genre}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No programs available for this date
              </div>
            )}
          </div>
        </div>
        </div>
      ) : (
        /* Horizontal Timeline View */
        <div className="overflow-auto">
          <div className="min-w-max">
            <div className="grid grid-cols-24 gap-1 mb-4">
              {Array.from({ length: 24 }, (_, hour) => (
                <div key={hour} className="text-center text-xs text-muted-foreground p-2">
                  {hour.toString().padStart(2, '0')}:00
                </div>
              ))}
            </div>
            
            {channels.map((channel, channelIndex) => (
              <div key={channel.id} className="mb-2">
                <div className="flex items-center gap-4 mb-1">
                  <div className="w-24 flex-shrink-0 text-sm font-medium">
                    {channel.name}
                  </div>
                  
                  <div className="flex-1 relative h-12 bg-muted rounded">
                    {/* Programs for this channel would be positioned here */}
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                      Timeline view for {channel.name}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TVGuide;