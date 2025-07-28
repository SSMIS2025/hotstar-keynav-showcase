import React from 'react';

interface NavbarProps {
  title: string;
  onBack: () => void;
  showTime?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ title, onBack, showTime = true }) => {
  return (
    <div className="bg-card/95 backdrop-blur-md border-b border-border p-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-muted hover:bg-secondary rounded-lg flex items-center justify-center transition-colors focus:ring-2 focus:ring-primary"
          >
            ←
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">H</span>
            </div>
            <h1 className="text-xl font-bold text-primary">{title}</h1>
          </div>
        </div>
        
        {showTime && (
          <div className="text-right text-sm text-muted-foreground">
            <div>{new Date().toLocaleDateString()}</div>
            <div>{new Date().toLocaleTimeString()}</div>
          </div>
        )}
      </div>
      
      <div className="mt-2 text-xs text-muted-foreground text-center">
        Use arrow keys to navigate • Enter to select • ESC to go back
      </div>
    </div>
  );
};

export default Navbar;