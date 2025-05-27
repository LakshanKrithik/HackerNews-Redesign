
import React from 'react';

const Footer: React.FC = () => {
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
};

export default Footer;
