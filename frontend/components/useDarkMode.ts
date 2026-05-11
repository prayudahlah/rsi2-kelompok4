'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'rsi-dark-mode';

export function useDarkMode(defaultValue = true) {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return defaultValue;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'true') return true;
    if (stored === 'false') return false;
    return defaultValue;
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'true') setDarkMode(true);
    if (stored === 'false') setDarkMode(false);

    setIsMounted(true);

    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      if (event.newValue === 'true') setDarkMode(true);
      if (event.newValue === 'false') setDarkMode(false);
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(darkMode));
  }, [darkMode]);

  return {
    darkMode,
    setDarkMode,
    toggleDarkMode: () => setDarkMode((prev) => !prev),
    isMounted,
  };
}
