import React, { useState, useMemo } from 'react';
import { contentLibrary, channels, Content, Channel } from '../data/mockData';
import { useKeyNavigation } from '../hooks/useKeyNavigation';

interface SearchProps {
  onClose: () => void;
  onSelectContent: (content: Content | Channel) => void;
}

const Search: React.FC<SearchProps> = ({ onClose, onSelectContent }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchType, setSearchType] = useState<'all' | 'movies' | 'channels'>('all');

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const regex = new RegExp(searchQuery, 'gi');
    const results: (Content | Channel)[] = [];

    // Search content
    if (searchType === 'all' || searchType === 'movies') {
      contentLibrary.forEach(content => {
        if (regex.test(content.title) || 
            regex.test(content.description) || 
            regex.test(content.genre)) {
          results.push(content);
        }
      });
    }

    // Search channels
    if (searchType === 'all' || searchType === 'channels') {
      channels.forEach(channel => {
        if (regex.test(channel.name) || 
            regex.test(channel.category) || 
            regex.test(channel.language) ||
            regex.test(channel.lcn.toString())) {
          results.push(channel);
        }
      });
    }

    return results;
  }, [searchQuery, searchType]);

  useKeyNavigation({
    onUp: () => {
      if (selectedIndex > 0) {
        setSelectedIndex(selectedIndex - 1);
      }
    },
    onDown: () => {
      if (selectedIndex < searchResults.length - 1) {
        setSelectedIndex(selectedIndex + 1);
      }
    },
    onSelect: () => {
      if (searchResults[selectedIndex]) {
        onSelectContent(searchResults[selectedIndex]);
      }
    },
    onBack: onClose
  });

  const isChannel = (item: Content | Channel): item is Channel => {
    return 'lcn' in item;
  };

  const isContent = (item: Content | Channel): item is Content => {
    return 'type' in item;
  };

  return (
    <div className="fixed inset-0 bg-background z-50">
      {/* Header */}
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-primary">Search</h1>
          <div className="text-sm text-muted-foreground">
            Press ESC to close • Use arrow keys to navigate • Enter to select
          </div>
        </div>
        
        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search content, channels, or programs..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            autoFocus
          />
        </div>
        
        {/* Search Type Filters */}
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'All' },
            { key: 'movies', label: 'Movies & Shows' },
            { key: 'channels', label: 'Channels' }
          ].map(({ key, label }) => (
            <button
              key={key}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                searchType === key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-secondary'
              }`}
              onClick={() => {
                setSearchType(key as typeof searchType);
                setSelectedIndex(0);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results */}
      <div className="p-6 overflow-y-auto h-full">
        {!searchQuery.trim() ? (
          <div className="text-center text-muted-foreground py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-lg mb-2">Start typing to search</p>
            <p className="text-sm">
              Search for movies, TV shows, channels, or programs using regex patterns
            </p>
            <div className="mt-4 text-xs bg-muted rounded-lg p-3 max-w-md mx-auto">
              <p className="font-semibold mb-2">Regex Examples:</p>
              <ul className="space-y-1 text-left">
                <li>• "star.*hd" - Matches "Star Plus HD", "Star Sports HD"</li>
                <li>• "drama|action" - Matches content with Drama OR Action</li>
                <li>• "^news" - Matches titles starting with "News"</li>
                <li>• "2022$" - Matches content from year 2022</li>
              </ul>
            </div>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <div className="text-6xl mb-4">😔</div>
            <p className="text-lg mb-2">No results found</p>
            <p className="text-sm">
              Try adjusting your search query or use different keywords
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground mb-4">
              Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
            </div>
            
            {searchResults.map((item, index) => (
              <div
                key={isChannel(item) ? `channel-${item.id}` : `content-${item.id}`}
                className={`p-4 rounded-lg border cursor-pointer transition-all content-card ${
                  selectedIndex === index
                    ? 'border-primary bg-primary/10 scale-[1.02] ring-2 ring-primary'
                    : 'border-border bg-card hover:bg-secondary/50'
                }`}
                onClick={() => onSelectContent(item)}
              >
                {isChannel(item) ? (
                  // Channel Result
                  <div className="flex items-center gap-4">
                    <img 
                      src={item.logo} 
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded">
                          CHANNEL
                        </span>
                        <span className="text-sm font-mono text-primary">
                          LCN {item.lcn}
                        </span>
                        {item.isHD && (
                          <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded font-bold">
                            HD
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {item.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item.category} • {item.language}
                      </p>
                      {item.currentProgram && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full live-pulse"></div>
                          <span className="text-sm font-medium">
                            {item.currentProgram.title}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  // Content Result
                  <div className="flex items-center gap-4">
                    <img 
                      src={item.thumbnail} 
                      alt={item.title}
                      className="w-16 h-24 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-1 text-xs rounded font-medium ${
                          item.type === 'movie' ? 'bg-blue-500/20 text-blue-400' :
                          item.type === 'series' ? 'bg-green-500/20 text-green-400' :
                          'bg-orange-500/20 text-orange-400'
                        }`}>
                          {item.type.toUpperCase()}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {item.year}
                        </span>
                        <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                          {item.rating}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{item.genre}</span>
                        <span>•</span>
                        <span>{item.duration}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;