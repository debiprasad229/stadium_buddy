import { useState, useEffect } from 'react';

export type Theme = 'dark' | 'light' | 'high-contrast';

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('arena_theme');
    if (saved === 'dark' || saved === 'light' || saved === 'high-contrast') {
      return saved;
    }
    return 'dark'; // Default theme
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('arena_theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return { theme, setTheme };
}
