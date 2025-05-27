
import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-hn-background bg-opacity-80 backdrop-blur-sm sticky top-0 z-50 p-4 border-b border-hn-border">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="font-pixel text-2xl text-hn-text relative group">
          <span 
            className="inline-block animate-glitch-subtle [--glitch-color1:theme(colors.hn-accent)] [--glitch-color2:theme(colors.hn-accent-secondary)] [--glitch-color3:theme(colors.hn-glitch-yellow)] group-hover:animate-glitch-hover"
            data-text="HN"
          >
            HN
          </span>
        </Link>
        <nav className="space-x-3 sm:space-x-4 font-pixel text-xs sm:text-sm">
          {['new', 'top', 'ask', 'show', 'jobs'].map((item) => (
            <a
              key={item}
              href={`https://news.ycombinator.com/${item}`} // Link to original HN for now
              target="_blank"
              rel="noopener noreferrer"
              className="text-hn-text hover:text-hn-accent glitch-text-hover"
              data-text={item.charAt(0).toUpperCase() + item.slice(1)}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
