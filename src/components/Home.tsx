import React, { useState } from 'react';
import { contentLibrary, channels } from '../data/mockData';
import { useKeyNavigation } from '../hooks/useKeyNavigation';

interface HomeProps {
  onNavigate: (section: string) => void;
  onOpenMenu: () => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate, onOpenMenu }) => {
  const [selectedSection, setSelectedSection] = useState(0);
  const [selectedItem, setSelectedItem] = useState(0);

  const sections = [
    { id: 'live-tv', title: 'Live TV', items: channels },
    { id: 'trending', title: 'Trending Now', items: contentLibrary },
    { id: 'recent', title: 'Recently Added', items: contentLibrary.slice().reverse() },
  ];

  const currentSection = sections[selectedSection];
  const maxItemsVisible = 6;

  useKeyNavigation({
    onUp: () => {
      if (selectedSection > 0) {
        setSelectedSection(selectedSection - 1);
        setSelectedItem(0);
      }
    },
    onDown: () => {
      if (selectedSection < sections.length - 1) {
        setSelectedSection(selectedSection + 1);
        setSelectedItem(0);
      }
    },
    onLeft: () => {
      if (selectedItem > 0) {
        setSelectedItem(selectedItem - 1);
      }
    },
    onRight: () => {
      if (selectedItem < Math.min(currentSection.items.length - 1, maxItemsVisible - 1)) {
        setSelectedItem(selectedItem + 1);
      }
    },
    onSelect: () => {
      if (currentSection.id === 'live-tv') {
        onNavigate('live-tv');
      } else {
        // Handle content selection
        onNavigate('video-player');
      }
    },
    onMenu: onOpenMenu,
    onGuide: () => onNavigate('tv-guide'),
    onSearch: () => onNavigate('search')
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-card/50 backdrop-blur-md border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">H</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">Hotstar</h1>
              <p className="text-sm text-muted-foreground">Your entertainment destination</p>
            </div>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <div>{new Date().toLocaleDateString()}</div>
            <div>{new Date().toLocaleTimeString()}</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {sections.map((section, sectionIndex) => (
          <div key={section.id} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-bold transition-colors ${
                selectedSection === sectionIndex ? 'text-primary' : 'text-foreground'
              }`}>
                {section.title}
              </h2>
              <button 
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                onClick={() => onNavigate(section.id)}
              >
                View All →
              </button>
            </div>

            <div className="flex gap-4 overflow-hidden">
              {section.items.slice(0, maxItemsVisible).map((item, itemIndex) => {
                const isSelected = selectedSection === sectionIndex && selectedItem === itemIndex;
                const isChannel = 'lcn' in item;
                
                return (
                  <div
                    key={isChannel ? `channel-${item.id}` : `content-${item.id}`}
                    className={`flex-shrink-0 w-48 cursor-pointer transition-all duration-300 content-card ${
                      isSelected ? 'scale-105 ring-2 ring-primary' : ''
                    }`}
                    onClick={() => {
                      setSelectedSection(sectionIndex);
                      setSelectedItem(itemIndex);
                    }}
                  >
                    {isChannel ? (
                      // Channel Card
                      <div className="bg-card rounded-lg border border-border overflow-hidden">
                        <div className="aspect-video bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center relative">
                          <img 
                            src={item.logo} 
                            alt={item.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          {item.currentProgram?.isLive && (
                            <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs rounded font-bold">
                              LIVE
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-primary">
                              {item.lcn}
                            </span>
                            {item.isHD && (
                              <span className="px-1 py-0.5 bg-primary text-primary-foreground text-xs rounded">
                                HD
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-sm mb-1 truncate">
                            {item.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {item.currentProgram?.title || item.category}
                          </p>
                        </div>
                      </div>
                    ) : (
                      // Content Card
                      <div className="bg-card rounded-lg border border-border overflow-hidden">
                        <div className="aspect-[3/4]">
                          <img 
                            src={item.thumbnail} 
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <h3 className="font-semibold text-sm mb-1 truncate">
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{item.year}</span>
                            <span>•</span>
                            <span>{item.rating}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.genre}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Hints */}
      <div className="fixed bottom-4 left-4 right-4 bg-card/90 backdrop-blur-md border border-border rounded-lg p-3">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex gap-6">
            <span>↑↓ Sections</span>
            <span>←→ Items</span>
            <span>⏎ Select</span>
            <span>M Menu</span>
            <span>G Guide</span>
            <span>S Search</span>
          </div>
          <div className="text-xs">
            Use your remote or keyboard to navigate
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;