import React, { useState, useEffect } from 'react';
import { contentLibrary, channels } from '../data/mockData';
import { useGridNavigation } from '../hooks/useGridNavigation';

interface HomeProps {
  onNavigate: (section: string) => void;
  onOpenMenu: () => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate, onOpenMenu }) => {
  const [selectedSection, setSelectedSection] = useState(0);
  const [previewContent, setPreviewContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('');

  const sections = [
    { id: 'live-tv', title: 'Live TV', items: channels },
    { id: 'trending', title: 'Trending Now', items: contentLibrary },
    { id: 'recent', title: 'Recently Added', items: contentLibrary.slice().reverse() },
  ];

  const currentSection = sections[selectedSection];
  const itemsPerRow = Math.floor(window.innerWidth / 250); // Dynamic based on screen size
  const totalItems = currentSection.items.length;

  const { selectedIndex, scrollOffset, isSelected } = useGridNavigation({
    itemsPerRow,
    totalItems,
    onSelect: (index) => {
      const item = currentSection.items[index];
      setIsLoading(true);
      
      // Simulate loading
      setTimeout(() => {
        setIsLoading(false);
        if (currentSection.id === 'live-tv') {
          onNavigate('live-tv');
        } else {
          setPreviewContent(item);
          if ('thumbnail' in item) {
            setBackgroundImage((item as any).thumbnail);
          }
        }
      }, 800);
    },
    onBack: onOpenMenu
  });

  // Auto-preview content on focus
  useEffect(() => {
    const focusedItem = currentSection.items[selectedIndex % totalItems];
    if (focusedItem) {
      const hasThumb = 'thumbnail' in focusedItem;
      if (hasThumb) {
        setBackgroundImage((focusedItem as any).thumbnail);
      }
    }
  }, [selectedIndex, currentSection, totalItems]);

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'PageUp':
      case 'PageDown':
        event.preventDefault();
        const newSection = event.key === 'PageUp' 
          ? Math.max(0, selectedSection - 1)
          : Math.min(sections.length - 1, selectedSection + 1);
        if (newSection !== selectedSection) {
          setSelectedSection(newSection);
        }
        break;
      case 'm':
      case 'M':
        event.preventDefault();
        onOpenMenu();
        break;
      case 'g':
      case 'G':
        event.preventDefault();
        onNavigate('tv-guide');
        break;
      case 's':
      case 'S':
        if (!event.ctrlKey) {
          event.preventDefault();
          onNavigate('search');
        }
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedSection]);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background Image with Fade */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat hero-background"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-primary font-semibold">Loading content...</p>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="bg-card/50 backdrop-blur-md border-b border-border p-6 relative z-10">
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
      <div className="p-6 relative z-10">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-primary">
              {currentSection.title}
            </h2>
            <div className="text-sm text-muted-foreground">
              Section {selectedSection + 1} of {sections.length}
            </div>
          </div>

          <div 
            className="grid gap-4 grid-container"
            style={{
              gridTemplateColumns: `repeat(${itemsPerRow}, 1fr)`,
              transform: `translate(-${scrollOffset.x}px, -${scrollOffset.y}px)`
            }}
          >
            {currentSection.items.map((item, itemIndex) => {
              const isSelectedItem = isSelected(itemIndex);
              const isChannel = 'lcn' in item;
                
              return (
                <div
                  key={isChannel ? `channel-${item.id}` : `content-${item.id}`}
                  className={`cursor-pointer transition-all duration-300 content-card ${
                    isSelectedItem ? 'content-focus' : ''
                  }`}
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