
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center space-x-1 my-8">
      <div className="w-3 h-3 bg-hn-accent animate-pixel-spinner-delay-1"></div>
      <div className="w-3 h-3 bg-hn-accent-secondary animate-pixel-spinner-delay-2"></div>
      <div className="w-3 h-3 bg-hn-glitch-yellow animate-pixel-spinner-delay-3"></div>
    </div>
  );
};

export default LoadingSpinner;
