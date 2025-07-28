import React, { useState } from 'react';
import { games, Game } from '../data/mockData';
import { useKeyNavigation } from '../hooks/useKeyNavigation';

interface GamesProps {
  onClose: () => void;
  onSelectGame: (game: Game) => void;
}

const Games: React.FC<GamesProps> = ({ onClose, onSelectGame }) => {
  const [selectedGame, setSelectedGame] = useState(0);

  useKeyNavigation({
    onUp: () => {
      if (selectedGame >= 3) {
        setSelectedGame(selectedGame - 3);
      }
    },
    onDown: () => {
      if (selectedGame + 3 < games.length) {
        setSelectedGame(selectedGame + 3);
      }
    },
    onLeft: () => {
      if (selectedGame > 0) {
        setSelectedGame(selectedGame - 1);
      }
    },
    onRight: () => {
      if (selectedGame < games.length - 1) {
        setSelectedGame(selectedGame + 1);
      }
    },
    onSelect: () => {
      if (games[selectedGame]) {
        onSelectGame(games[selectedGame]);
      }
    },
    onBack: onClose
  });

  return (
    <div className="fixed inset-0 bg-background z-50">
      {/* Header */}
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Games</h1>
          <div className="text-sm text-muted-foreground">
            Press ESC to close • Use arrow keys to navigate • Enter to play
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="p-6 overflow-y-auto h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game, index) => (
            <div
              key={game.id}
              className={`p-6 rounded-lg border cursor-pointer transition-all content-card ${
                selectedGame === index
                  ? 'border-primary bg-primary/10 scale-105 ring-2 ring-primary'
                  : 'border-border bg-card hover:bg-secondary/50'
              }`}
              onClick={() => onSelectGame(game)}
            >
              <img 
                src={game.thumbnail} 
                alt={game.title}
                className="w-full h-32 rounded-lg object-cover mb-4"
              />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {game.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {game.category}
              </p>
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-primary text-primary-foreground text-xs rounded-full font-medium">
                  Play Now
                </span>
                <span className="text-xs text-muted-foreground">
                  Free
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Games;