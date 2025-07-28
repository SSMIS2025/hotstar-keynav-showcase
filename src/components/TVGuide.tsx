import React, { useState, useEffect, useRef } from 'react';
import { channels, tvGuideData, TVGuideData, Program } from '../data/mockData';
import { useKeyNavigation } from '../hooks/useKeyNavigation';

interface TVGuideProps {
  onClose: () => void;
  onSelectProgram: (program: Program) => void;
}

const TVGuide: React.FC<TVGuideProps> = ({ onClose, onSelectProgram }) => {
  const [selectedDay, setSelectedDay] = useState(0); // -7 to +7 from today
  const [selectedChannel, setSelectedChannel] = useState(0);
  const [selectedProgram, setSelectedProgram] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

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
      if (selectedDay < 7) {
        setSelectedDay(selectedDay + 1);
        setSelectedProgram(0);
      }
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

  return (
    <div className="fixed inset-0 bg-background z-50" ref={containerRef}>
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-primary">TV Guide</h1>
          <div className="text-sm text-muted-foreground">
            Press ESC to close • Use arrow keys to navigate • Enter to select
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

      {/* TV Guide Grid */}
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
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
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
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-foreground">
                        {program.title}
                      </h4>
                      <div className="flex items-center gap-2">
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
    </div>
  );
};

export default TVGuide;