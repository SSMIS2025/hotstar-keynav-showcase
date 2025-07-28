import React, { useState } from 'react';
import { useKeyNavigation } from '../hooks/useKeyNavigation';
import Navbar from './Navbar';

interface MainMenuProps {
  onClose: () => void;
  onNavigate: (section: string) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onClose, onNavigate }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const menuItems = [
    { id: 'live-tv', label: 'Live TV', icon: '📺', description: 'Watch live channels' },
    { id: 'tv-guide', label: 'TV Guide', icon: '📋', description: '15-day program guide' },
    { id: 'service-list', label: 'Service List', icon: '📃', description: 'Browse all channels' },
    { id: 'search', label: 'Search', icon: '🔍', description: 'Find content & channels' },
    { id: 'games', label: 'Games', icon: '🎮', description: 'Play interactive games' },
    { id: 'settings', label: 'Settings', icon: '⚙️', description: 'Preferences & options' },
  ];

  useKeyNavigation({
    onUp: () => {
      setSelectedIndex(selectedIndex > 0 ? selectedIndex - 1 : menuItems.length - 1);
    },
    onDown: () => {
      setSelectedIndex((selectedIndex + 1) % menuItems.length);
    },
    onSelect: () => {
      onNavigate(menuItems[selectedIndex].id);
    },
    onBack: onClose
  });

  return (
    <div className="fixed inset-0 bg-background z-50">
      <Navbar title="Main Menu" onBack={onClose} />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="bg-card border border-border rounded-lg p-8 max-w-md w-full mx-4">

        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <div
              key={item.id}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                selectedIndex === index
                  ? 'bg-primary text-primary-foreground scale-105'
                  : 'bg-muted text-muted-foreground hover:bg-secondary'
              }`}
              onClick={() => onNavigate(item.id)}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.label}</h3>
                  <p className={`text-sm ${
                    selectedIndex === index ? 'text-primary-foreground/80' : 'text-muted-foreground'
                  }`}>
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            <p>Hotstar Clone • Key Navigation Interface</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;