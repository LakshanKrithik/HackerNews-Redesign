
import React, { useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface ParticleProps { // Renamed from SparkleProps to be more generic
  x: number;
  y: number;
  id: number;
}

const CursorEffect: React.FC = () => {
  const [sparkles, setSparkles] = useState<ParticleProps[]>([]);
  const [flowerBlooms, setFlowerBlooms] = useState<ParticleProps[]>([]); // New state for flower blooms
  const { theme } = useTheme();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (theme === 'pixel') {
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
        }, 800); // Sparkle animation duration
      } else if (theme === 'soft') {
        // Create one flower bloom per click
        const newBlooms = Array.from({ length: 1 }, (_, i) => ({
          x: e.clientX,
          y: e.clientY,
          id: Date.now() + i
        }));

        setFlowerBlooms(prev => [...prev, ...newBlooms]);

        // Remove blooms after animation completes
        setTimeout(() => {
          setFlowerBlooms(prev => prev.filter(bloom =>
            !newBlooms.some(b => b.id === bloom.id)
          ));
        }, 1000); // Flower bloom animation duration
      }
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [theme]); // Effect depends on theme

  if (theme === 'pixel') {
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
  }

  if (theme === 'soft') {
    return (
      <>
        {flowerBlooms.map(bloom => (
          <div
            key={bloom.id}
            className="flower-bloom-particle"
            style={{
              left: `${bloom.x}px`,
              top: `${bloom.y}px`,
            }}
          />
        ))}
      </>
    );
  }

  return null; // No effect to render for the current theme or no particles
};

export default CursorEffect;

