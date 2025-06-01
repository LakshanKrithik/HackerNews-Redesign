
import React from 'react';
import { useTheme } from '@/context/ThemeContext';

const Footer: React.FC = () => {
  const { theme } = useTheme();
  
  if (theme === 'pixel') {
    return (
      <footer className="p-2 sm:p-4 border-t border-hn-border mt-4 sm:mt-8">
        <div className="container mx-auto text-center font-pixel text-xs text-muted-foreground max-w-7xl">
          <p className="mt-1 px-2">Data from Hacker News API. All original content &copy; Y Combinator.</p>
        </div>
      </footer>
    );
  }
  
  return (
    <footer className="p-4 sm:p-6 border-t border-soft-border mt-4 sm:mt-8 bg-white">
      <div className="container mx-auto text-center max-w-7xl">
        <p className="mt-2 text-xs sm:text-sm text-soft-text-secondary px-2">
          Data from Hacker News API. All original content &copy; Y Combinator.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
