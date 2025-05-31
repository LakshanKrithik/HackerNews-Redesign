
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '@/context/ThemeContext';

const Header: React.FC = () => {
  const { theme } = useTheme();
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
      sticky top-0 z-50 p-4 border-b transition-all duration-300
      ${theme === 'pixel' 
        ? 'bg-hn-background bg-opacity-80 backdrop-blur-sm border-hn-border' 
        : 'bg-soft-background bg-opacity-90 backdrop-blur-md border-soft-border shadow-soft'}
    `}>
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className={`
          font-${theme === 'pixel' ? 'pixel' : 'poppins'} text-2xl 
          ${theme === 'pixel' ? 'text-hn-text relative group' : 'text-soft-text font-semibold'}
        `}>
          {theme === 'pixel' ? (
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
        
        <div className="flex items-center space-x-4">
          <nav className={`
            space-x-3 sm:space-x-4 
            ${theme === 'pixel' 
              ? 'font-pixel text-xs sm:text-sm' 
              : 'font-poppins text-sm sm:text-base'}
          `}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`transition-colors ${
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
        </div>
      </div>
    </header>
  );
};

export default Header;
