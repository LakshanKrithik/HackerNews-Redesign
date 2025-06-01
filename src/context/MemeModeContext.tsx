
import React, { createContext, useContext, useState, useEffect } from 'react';

interface MemeModeContextType {
  isMemeMode: boolean;
  toggleMemeMode: () => void;
}

const MemeModeContext = createContext<MemeModeContextType>({
  isMemeMode: false,
  toggleMemeMode: () => {},
});

export const MemeModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMemeMode, setIsMemeMode] = useState(false);

  const toggleMemeMode = () => {
    const newMode = !isMemeMode;
    setIsMemeMode(newMode);
    localStorage.setItem('hn-meme-mode', String(newMode));
  };

  useEffect(() => {
    const savedMode = localStorage.getItem('hn-meme-mode');
    if (savedMode) {
      setIsMemeMode(savedMode === 'true');
    }
  }, []);

  return (
    <MemeModeContext.Provider value={{ isMemeMode, toggleMemeMode }}>
      {children}
    </MemeModeContext.Provider>
  );
};

export const useMemeMode = () => useContext(MemeModeContext);
