import React, { useState } from 'react';
import { channels, Channel } from '../data/mockData';
import { useKeyNavigation } from '../hooks/useKeyNavigation';

interface ServiceListProps {
  onClose: () => void;
  onSelectChannel: (channel: Channel) => void;
}

const ServiceList: React.FC<ServiceListProps> = ({ onClose, onSelectChannel }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedChannel, setSelectedChannel] = useState(0);

  const categories = ['All', 'Entertainment', 'Sports', 'Documentary', 'Kids'];
  const filteredChannels = selectedCategory === 'All' 
    ? channels 
    : channels.filter(ch => ch.category === selectedCategory);

  useKeyNavigation({
    onUp: () => {
      if (selectedChannel > 0) {
        setSelectedChannel(selectedChannel - 1);
      }
    },
    onDown: () => {
      if (selectedChannel < filteredChannels.length - 1) {
        setSelectedChannel(selectedChannel + 1);
      }
    },
    onLeft: () => {
      const currentCategoryIndex = categories.indexOf(selectedCategory);
      if (currentCategoryIndex > 0) {
        setSelectedCategory(categories[currentCategoryIndex - 1]);
        setSelectedChannel(0);
      }
    },
    onRight: () => {
      const currentCategoryIndex = categories.indexOf(selectedCategory);
      if (currentCategoryIndex < categories.length - 1) {
        setSelectedCategory(categories[currentCategoryIndex + 1]);
        setSelectedChannel(0);
      }
    },
    onSelect: () => {
      if (filteredChannels[selectedChannel]) {
        onSelectChannel(filteredChannels[selectedChannel]);
      }
    },
    onBack: onClose
  });

  return (
    <div className="fixed inset-0 bg-background z-50">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-primary">Service List</h1>
          <div className="text-sm text-muted-foreground">
            Press ESC to close • Use arrow keys to navigate • Enter to select
          </div>
        </div>
        
        {/* Category tabs */}
        <div className="flex gap-2">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-secondary'
              }`}
              onClick={() => {
                setSelectedCategory(category);
                setSelectedChannel(0);
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Channel Grid */}
      <div className="p-6 overflow-y-auto h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredChannels.map((channel, index) => (
            <div
              key={channel.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all content-card ${
                selectedChannel === index
                  ? 'border-primary bg-primary/10 scale-105 ring-2 ring-primary'
                  : 'border-border bg-card hover:bg-secondary/50'
              }`}
              onClick={() => onSelectChannel(channel)}
            >
              <div className="flex items-center gap-3 mb-3">
                <img 
                  src={channel.logo} 
                  alt={channel.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-mono text-primary">
                      {channel.lcn}
                    </span>
                    {channel.isHD && (
                      <span className="px-1 py-0.5 bg-primary text-primary-foreground text-xs rounded font-bold">
                        HD
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">
                    {channel.name}
                  </h3>
                </div>
              </div>
              
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span>{channel.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Language:</span>
                  <span>{channel.language}</span>
                </div>
              </div>
              
              {channel.currentProgram && (
                <div className="mt-3 pt-3 border-t border-border/50">
                  <div className="flex items-center gap-1 mb-1">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full live-pulse"></div>
                    <span className="text-xs text-red-500 font-semibold">LIVE</span>
                  </div>
                  <p className="text-xs font-medium text-foreground">
                    {channel.currentProgram.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {channel.currentProgram.startTime} - {channel.currentProgram.endTime}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {filteredChannels.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            <p>No channels found in {selectedCategory} category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceList;