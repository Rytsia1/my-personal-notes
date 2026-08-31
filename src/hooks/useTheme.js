import { useState, useEffect } from 'react';

const LOCAL_STORAGE_THEME_KEY = 'NOTES_APP_THEME';

const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(LOCAL_STORAGE_THEME_KEY) || 'dark';
  });

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return { theme, toggleTheme };
};

export default useTheme;
