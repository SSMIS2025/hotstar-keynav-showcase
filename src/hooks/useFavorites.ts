import { useState, useEffect, useCallback } from 'react';

export interface FavoriteItem {
  id: string;
  type: 'channel' | 'program' | 'content';
  title: string;
  addedAt: string;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  // Load favorites from cookies on mount
  useEffect(() => {
    const savedFavorites = getCookie('hotstar_favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Failed to parse favorites from cookie:', error);
      }
    }
  }, []);

  // Save favorites to cookies whenever they change
  useEffect(() => {
    setCookie('hotstar_favorites', JSON.stringify(favorites), 365);
  }, [favorites]);

  const addFavorite = useCallback((item: Omit<FavoriteItem, 'addedAt'>) => {
    const newFavorite: FavoriteItem = {
      ...item,
      addedAt: new Date().toISOString()
    };
    
    setFavorites(prev => {
      // Check if already exists
      if (prev.some(fav => fav.id === item.id && fav.type === item.type)) {
        return prev;
      }
      return [...prev, newFavorite];
    });
  }, []);

  const removeFavorite = useCallback((id: string, type: string) => {
    setFavorites(prev => prev.filter(fav => !(fav.id === id && fav.type === type)));
  }, []);

  const isFavorite = useCallback((id: string, type: string) => {
    return favorites.some(fav => fav.id === id && fav.type === type);
  }, [favorites]);

  const toggleFavorite = useCallback((item: Omit<FavoriteItem, 'addedAt'>) => {
    if (isFavorite(item.id, item.type)) {
      removeFavorite(item.id, item.type);
    } else {
      addFavorite(item);
    }
  }, [isFavorite, addFavorite, removeFavorite]);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite
  };
};

// Cookie utility functions
function setCookie(name: string, value: string, days: number) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}