
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '@/context/ThemeContext';
import { Switch } from '@/components/ui/switch';
import { useMemeMode } from '@/context/MemeModeContext';

const Header: React.FC = () => {
  const { theme } = useTheme();
  const { isMemeMode, toggleMemeMode } = useMemeMode();
  const location = useLocation();
  
  const navItems = [
    { path: '/new', label: 'New' },
    { path: '/top', label: 'Top' },
    { path: '/ask', label: 'Ask' },
    { path: '/show', label: 'Show' },
    { path: '/jobs', label: 'Jobs' }
  ];

  const isActive = (path: string) => {
    if (path === '/top' && location.pathname === '/') return true;
    return location.pathname === path;
  };
  
  return (
    <header className={`
      sticky top-0 z-50 p-2 sm:p-4 border-b transition-all duration-300
      ${isMemeMode 
        ? 'bg-gradient-to-r from-blue-50 to-yellow-50 border-purple-200 shadow-lg' 
        : theme === 'pixel' 
          ? 'bg-hn-background bg-opacity-80 backdrop-blur-sm border-hn-border' 
          : 'bg-soft-background bg-opacity-90 backdrop-blur-md border-soft-border shadow-soft'}
    `}>
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl">
        {/* Logo and Title */}
        <Link to="/" className={`
          font-${isMemeMode ? 'poppins' : theme === 'pixel' ? 'pixel' : 'poppins'} 
          text-xl sm:text-2xl shrink-0
          ${isMemeMode 
            ? 'text-purple-600 font-bold transform hover:scale-105 transition-transform' 
            : theme === 'pixel' ? 'text-hn-text relative group' : 'text-soft-text font-semibold'}
        `}>
          {isMemeMode ? (
            <span className="animate-bounce">😂 HackerMemes</span>
          ) : theme === 'pixel' ? (
            <span 
              className="inline-block animate-glitch-subtle [--glitch-color1:theme(colors.hn-accent)] [--glitch-color2:theme(colors.hn-accent-secondary)] [--glitch-color3:theme(colors.hn-glitch-yellow)] group-hover:animate-glitch-hover"
              data-text="HN"
            >
              HN
            </span>
          ) : (
            <span className="bg-gradient-to-r from-lavender to-soft-accent bg-clip-text text-transparent">HackerNews</span>
          )}
        </Link>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
          {/* Meme Mode Toggle */}
          <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-full px-3 py-2 border border-purple-200 min-w-0">
            <span className={`text-xs sm:text-sm font-medium transition-colors truncate ${!isMemeMode ? 'text-purple-600' : 'text-gray-400'}`}>
              🧠 HN
            </span>
            <Switch 
              checked={isMemeMode} 
              onCheckedChange={toggleMemeMode}
              className="data-[state=checked]:bg-purple-500 data-[state=unchecked]:bg-gray-300 shrink-0"
            />
            <span className={`text-xs sm:text-sm font-medium transition-colors truncate ${isMemeMode ? 'text-purple-600' : 'text-gray-400'}`}>
              😂 Memes
            </span>
          </div>
          
          {!isMemeMode && (
            <>
              {/* Navigation - Mobile Scrollable */}
              <nav className={`
                flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-1 sm:pb-0 w-full sm:w-auto
                ${theme === 'pixel' 
                  ? 'font-pixel text-xs sm:text-sm' 
                  : 'font-poppins text-sm sm:text-base'}
              `}>
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`transition-colors whitespace-nowrap px-2 py-1 rounded ${
                      theme === 'pixel'
                        ? isActive(item.path)
                          ? "text-hn-accent glitch-text-hover font-bold"
                          : "text-hn-text hover:text-hn-accent glitch-text-hover"
                        : isActive(item.path)
                          ? "text-soft-accent font-semibold"
                          : "text-soft-text hover:text-soft-accent"
                    }`}
                    data-text={item.label}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              
              <ThemeToggle />
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
