
import React, { useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface SparkleProps {
  x: number;
  y: number;
  id: number;
}

const CursorEffect: React.FC = () => {
  const [sparkles, setSparkles] = useState<SparkleProps[]>([]);
  const { theme } = useTheme();

  useEffect(() => {
    // Only apply effects in pixel theme
    if (theme !== 'pixel') return;

    const handleClick = (e: MouseEvent) => {
      // Create multiple sparkles for one click
      const newSparkles = Array.from({ length: 3 }, (_, i) => ({
        x: e.clientX + (Math.random() * 20 - 10),
        y: e.clientY + (Math.random() * 20 - 10),
        id: Date.now() + i
      }));
      
      setSparkles(prev => [...prev, ...newSparkles]);
      
      // Remove sparkles after animation completes
      setTimeout(() => {
        setSparkles(prev => prev.filter(sparkle => 
          !newSparkles.some(s => s.id === sparkle.id)
        ));
      }, 800);
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [theme]);

  // Don't render anything if not in pixel theme
  if (theme !== 'pixel') return null;

  return (
    <>
      {sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          className="cursor-sparkle"
          style={{
            left: `${sparkle.x}px`,
            top: `${sparkle.y}px`,
          }}
        />
      ))}
    </>
  );
};

export default CursorEffect;
