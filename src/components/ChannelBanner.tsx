import React from 'react';
import { Channel } from '../data/mockData';

interface ChannelBannerProps {
  channel: Channel;
  showInfo?: boolean;
}

const ChannelBanner: React.FC<ChannelBannerProps> = ({ channel, showInfo = true }) => {
  return (
    <div className="channel-banner p-4 flex items-center gap-4">
      <div className="flex items-center gap-3">
        <img 
          src={channel.logo} 
          alt={channel.name}
          className="w-12 h-12 rounded-lg object-cover"
        />
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-muted-foreground">
              {channel.lcn}
            </span>
            <h3 className="text-lg font-semibold text-foreground">
              {channel.name}
            </h3>
            {channel.isHD && (
              <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded font-bold">
                HD
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {channel.category} • {channel.language}
          </p>
        </div>
      </div>
      
      {showInfo && channel.currentProgram && (
        <div className="flex-1 ml-8">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-red-500 rounded-full live-pulse"></div>
            <span className="text-xs text-red-500 font-semibold">LIVE</span>
          </div>
          <h4 className="font-semibold text-foreground">
            {channel.currentProgram.title}
          </h4>
          <p className="text-sm text-muted-foreground">
            {channel.currentProgram.startTime} - {channel.currentProgram.endTime}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {channel.currentProgram.description}
          </p>
        </div>
      )}
      
      <div className="text-right text-sm text-muted-foreground">
        <div>Channel {channel.lcn}</div>
        <div>Use ↑↓ or +/- to change</div>
      </div>
    </div>
  );
};

export default ChannelBanner;