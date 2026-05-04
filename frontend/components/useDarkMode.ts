'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'rsi-dark-mode';

export function useDarkMode(defaultValue = true) {
  const [darkMode, setDarkMode] = useState(defaultValue);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'true') setDarkMode(true);
    if (stored === 'false') setDarkMode(false);

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
  };
}
