export interface Channel {
  id: number;
  lcn: number; // Logical Channel Number
  name: string;
  logo: string;
  category: string;
  isHD: boolean;
  language: string;
  currentProgram?: Program;
}

export interface Program {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  genre: string;
  rating?: string;
  thumbnail?: string;
  isLive?: boolean;
}

export interface TVGuideData {
  channelId: number;
  date: string;
  programs: Program[];
}

export interface Content {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  genre: string;
  year: number;
  rating: string;
  duration: string;
  type: 'movie' | 'series' | 'live' | 'sports';
  videoUrl?: string;
}

export interface Game {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
  playUrl: string;
}

// Mock Channels Data
export const channels: Channel[] = [
  {
    id: 1,
    lcn: 101,
    name: "Star Plus HD",
    logo: "/api/placeholder/60/60",
    category: "Entertainment",
    isHD: true,
    language: "Hindi",
    currentProgram: {
      id: "p1",
      title: "Anupamaa",
      description: "Family drama series",
      startTime: "20:00",
      endTime: "20:30",
      genre: "Drama",
      isLive: true
    }
  },
  {
    id: 2,
    lcn: 102,
    name: "Colors HD",
    logo: "/api/placeholder/60/60",
    category: "Entertainment",
    isHD: true,
    language: "Hindi"
  },
  {
    id: 3,
    lcn: 103,
    name: "Sony HD",
    logo: "/api/placeholder/60/60",
    category: "Entertainment",
    isHD: true,
    language: "Hindi"
  },
  {
    id: 4,
    lcn: 201,
    name: "Star Sports 1 HD",
    logo: "/api/placeholder/60/60",
    category: "Sports",
    isHD: true,
    language: "English"
  },
  {
    id: 5,
    lcn: 301,
    name: "Discovery HD",
    logo: "/api/placeholder/60/60",
    category: "Documentary",
    isHD: true,
    language: "English"
  },
  {
    id: 6,
    lcn: 401,
    name: "Cartoon Network",
    logo: "/api/placeholder/60/60",
    category: "Kids",
    isHD: false,
    language: "English"
  }
];

// Generate TV Guide data for 15 days
export const generateTVGuide = (): TVGuideData[] => {
  const guide: TVGuideData[] = [];
  const today = new Date();
  
  for (let dayOffset = -7; dayOffset <= 7; dayOffset++) {
    const date = new Date(today);
    date.setDate(today.getDate() + dayOffset);
    
    channels.forEach(channel => {
      const programs: Program[] = [];
      let currentTime = new Date(date);
      currentTime.setHours(6, 0, 0, 0); // Start at 6 AM
      
      const programTitles = [
        "Morning News", "Breakfast Show", "Drama Series", "Reality Show",
        "Movie Time", "Comedy Show", "Evening News", "Prime Time Drama",
        "Late Night Talk", "Documentary", "Sports Live", "Music Show"
      ];
      
      for (let i = 0; i < 12; i++) {
        const endTime = new Date(currentTime);
        endTime.setHours(currentTime.getHours() + 2);
        
        programs.push({
          id: `${channel.id}-${date.toISOString().split('T')[0]}-${i}`,
          title: programTitles[i % programTitles.length],
          description: `${programTitles[i % programTitles.length]} on ${channel.name}`,
          startTime: currentTime.toISOString(),
          endTime: endTime.toISOString(),
          genre: channel.category,
          rating: ["U", "PG", "12+", "15+", "18+"][Math.floor(Math.random() * 5)],
          isLive: dayOffset === 0 && i === 10 // Mark some as live for today
        });
        
        currentTime = endTime;
      }
      
      guide.push({
        channelId: channel.id,
        date: date.toISOString().split('T')[0],
        programs
      });
    });
  }
  
  return guide;
};

// Mock Content Data
export const contentLibrary: Content[] = [
  {
    id: "1",
    title: "The Kashmir Files",
    description: "A story of resilience and truth",
    thumbnail: "/api/placeholder/300/400",
    genre: "Drama",
    year: 2022,
    rating: "8.1",
    duration: "2h 50m",
    type: "movie",
    videoUrl: "/sample-video.mp4"
  },
  {
    id: "2",
    title: "Scam 1992",
    description: "The Harshad Mehta Story",
    thumbnail: "/api/placeholder/300/400",
    genre: "Biography",
    year: 2020,
    rating: "9.5",
    duration: "10 episodes",
    type: "series"
  },
  {
    id: "3",
    title: "Arya",
    description: "A romantic action drama",
    thumbnail: "/api/placeholder/300/400",
    genre: "Action",
    year: 2023,
    rating: "7.8",
    duration: "2h 45m",
    type: "movie"
  }
];

// Mock Games Data
export const games: Game[] = [
  {
    id: "g1",
    title: "Cricket Quiz",
    thumbnail: "/api/placeholder/200/150",
    category: "Sports Quiz",
    playUrl: "/games/cricket-quiz"
  },
  {
    id: "g2",
    title: "Movie Trivia",
    thumbnail: "/api/placeholder/200/150",
    category: "Entertainment",
    playUrl: "/games/movie-trivia"
  },
  {
    id: "g3",
    title: "Word Puzzle",
    thumbnail: "/api/placeholder/200/150",
    category: "Puzzle",
    playUrl: "/games/word-puzzle"
  }
];

export const tvGuideData = generateTVGuide();