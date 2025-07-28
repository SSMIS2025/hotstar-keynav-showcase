import React, { useState } from 'react';
import Home from '../components/Home';
import LiveTV from '../components/LiveTV';
import TVGuide from '../components/TVGuide';
import ServiceList from '../components/ServiceList';
import Search from '../components/Search';
import Games from '../components/Games';
import MainMenu from '../components/MainMenu';
import VideoPlayer from '../components/VideoPlayer';
import { Content, Channel, Program, Game } from '../data/mockData';

const Index = () => {
  const [currentView, setCurrentView] = useState<string>('home');
  const [showMenu, setShowMenu] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    setShowMenu(false);
  };

  const handleOpenMenu = () => {
    setShowMenu(true);
  };

  const handleCloseMenu = () => {
    setShowMenu(false);
  };

  const handleSelectContent = (content: Content | Channel) => {
    if ('lcn' in content) {
      // It's a channel, go to live TV
      setCurrentView('live-tv');
    } else {
      // It's content, open video player
      setSelectedContent(content);
      setCurrentView('video-player');
    }
  };

  const handleSelectProgram = (program: Program) => {
    setSelectedProgram(program);
    setCurrentView('video-player');
  };

  const handleSelectGame = (game: Game) => {
    // For demo, just show an alert
    alert(`Starting ${game.title}...`);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return (
          <Home 
            onNavigate={handleNavigate} 
            onOpenMenu={handleOpenMenu}
          />
        );
      case 'live-tv':
        return (
          <LiveTV 
            onOpenGuide={() => handleNavigate('tv-guide')}
            onOpenMenu={handleOpenMenu}
          />
        );
      case 'tv-guide':
        return (
          <TVGuide 
            onClose={() => handleNavigate('home')}
            onSelectProgram={handleSelectProgram}
          />
        );
      case 'service-list':
        return (
          <ServiceList 
            onClose={() => handleNavigate('home')}
            onSelectChannel={handleSelectContent}
          />
        );
      case 'search':
        return (
          <Search 
            onClose={() => handleNavigate('home')}
            onSelectContent={handleSelectContent}
          />
        );
      case 'games':
        return (
          <Games 
            onClose={() => handleNavigate('home')}
            onSelectGame={handleSelectGame}
          />
        );
      case 'video-player':
        return (
          <VideoPlayer 
            content={selectedContent || undefined}
            program={selectedProgram || undefined}
            onClose={() => {
              setSelectedContent(null);
              setSelectedProgram(null);
              handleNavigate('home');
            }}
          />
        );
      default:
        return (
          <Home 
            onNavigate={handleNavigate} 
            onOpenMenu={handleOpenMenu}
          />
        );
    }
  };

  return (
    <>
      {renderCurrentView()}
      
      {showMenu && (
        <MainMenu 
          onClose={handleCloseMenu}
          onNavigate={handleNavigate}
        />
      )}
    </>
  );
};

export default Index;
