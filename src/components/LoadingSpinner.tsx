
import React from 'react';
import { useTheme } from '@/context/ThemeContext';

const LoadingSpinner: React.FC = () => {
  const { theme } = useTheme();

  if (theme === 'pixel') {
    return (
      <div className="flex justify-center items-center space-x-1 my-8">
        <div className="w-3 h-3 bg-hn-accent animate-pixel-spinner-delay-1"></div>
        <div className="w-3 h-3 bg-hn-accent-secondary animate-pixel-spinner-delay-2"></div>
        <div className="w-3 h-3 bg-hn-glitch-yellow animate-pixel-spinner-delay-3"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center my-8">
      <div className="relative w-12 h-12">
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-lavender border-opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-lavender border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
