import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'mosafiroon_favorites';

function readStoredFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Persists favorited package/hotel keys (group title or package id) to
// localStorage so the heart icon stays red across page reloads.
export function useFavorites() {
  const [favorites, setFavorites] = useState(readStoredFavorites);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = useCallback((key) => favorites.includes(key), [favorites]);

  const toggleFavorite = useCallback((key) => {
    setFavorites((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }, []);

  return { isFavorite, toggleFavorite };
}
