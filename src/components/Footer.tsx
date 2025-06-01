
import React from 'react';
import { useTheme } from '@/context/ThemeContext';

const Footer: React.FC = () => {
  const { theme } = useTheme();
  
  if (theme === 'pixel') {
    return (
      <footer className="p-4 border-t border-hn-border mt-8">
        <div className="container mx-auto text-center font-pixel text-xs text-muted-foreground">
          <p className="mt-1">Data from Hacker News API. All original content &copy; Y Combinator.</p>
        </div>
      </footer>
    );
  }
  
  return (
    <footer className="p-6 border-t border-soft-border mt-8 bg-white">
      <div className="container mx-auto text-center">
        <p className="mt-2 text-sm text-soft-text-secondary">
          Data from Hacker News API. All original content &copy; Y Combinator.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
