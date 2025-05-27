
import React from 'react';
import { useTheme } from '@/context/ThemeContext';

const Footer: React.FC = () => {
  const { theme } = useTheme();
  
  if (theme === 'pixel') {
    return (
      <footer className="p-4 border-t border-hn-border mt-8">
        <div className="container mx-auto text-center font-pixel text-xs text-muted-foreground">
          <span className="inline-block animate-glitch-subtle animate-flicker [--glitch-color1:theme(colors.hn-accent)] [--glitch-color2:theme(colors.hn-accent-secondary)] [--glitch-color3:theme(colors.hn-glitch-yellow)]" data-text="HN">
            HN
          </span> Pixel Remix by Lovable
          <p className="mt-1">Data from Hacker News API. All original content &copy; Y Combinator.</p>
        </div>
      </footer>
    );
  }
  
  return (
    <footer className="p-6 border-t border-soft-border mt-8 bg-white">
      <div className="container mx-auto text-center">
        <div className="font-poppins font-medium text-sm text-soft-text">
          <span className="bg-gradient-to-r from-lavender to-soft-accent bg-clip-text text-transparent">
            HackerNews
          </span> Soft UI by Lovable
        </div>
        <p className="mt-2 text-sm text-soft-text-secondary">
          Data from Hacker News API. All original content &copy; Y Combinator.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
