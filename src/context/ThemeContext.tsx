
import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'pixel' | 'soft';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'pixel',
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('pixel');

  const toggleTheme = () => {
    const newTheme = theme === 'pixel' ? 'soft' : 'pixel';
    setTheme(newTheme);
    localStorage.setItem('hn-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  useEffect(() => {
    // Initialize theme from localStorage or default to 'pixel'
    const savedTheme = localStorage.getItem('hn-theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'pixel');
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
