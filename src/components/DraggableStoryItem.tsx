
import React from 'react';
import { HNStory } from '@/types';
import { useTheme } from '@/context/ThemeContext';

interface DraggableStoryItemProps {
  story: HNStory;
  index: number;
  children: React.ReactNode;
}

const DraggableStoryItem: React.FC<DraggableStoryItemProps> = ({ story, children }) => {
  const { theme } = useTheme();

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify(story));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`cursor-grab active:cursor-grabbing transition-all duration-200 hover:scale-[1.01] ${
        theme === 'pixel' ? 'hover:shadow-pixel-accent' : 'hover:shadow-soft-hover'
      }`}
    >
      {children}
    </div>
  );
};

export default DraggableStoryItem;
