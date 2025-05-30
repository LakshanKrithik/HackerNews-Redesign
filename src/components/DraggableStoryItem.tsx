
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HNStory } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { useShelf } from '@/context/ShelfContext';
import { Upload } from 'lucide-react';

interface DraggableStoryItemProps {
  story: HNStory;
  index: number;
  children: React.ReactNode;
}

const DraggableStoryItem: React.FC<DraggableStoryItemProps> = ({ story, children }) => {
  const { theme } = useTheme();
  const { addToShelf } = useShelf();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify(story));
    e.dataTransfer.effectAllowed = 'copy';
    setIsDragging(true);
    
    // Create custom drag image with upload icon
    const dragImage = document.createElement('div');
    dragImage.innerHTML = '📤';
    dragImage.style.fontSize = '32px';
    dragImage.style.background = 'transparent';
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 16, 16);
    
    // Clean up drag image
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Listen for drops on the shelf area
  React.useEffect(() => {
    const handleGlobalDrop = (e: DragEvent) => {
      const target = e.target as Element;
      const shelfElement = target?.closest('[data-shelf-drop-zone]');
      
      if (shelfElement && isDragging) {
        try {
          const storyData = e.dataTransfer?.getData('application/json');
          if (storyData) {
            const droppedStory = JSON.parse(storyData);
            if (droppedStory.id === story.id) {
              addToShelf(story);
            }
          }
        } catch (error) {
          console.error('Error handling shelf drop:', error);
        }
      }
    };

    document.addEventListener('drop', handleGlobalDrop);
    return () => document.removeEventListener('drop', handleGlobalDrop);
  }, [isDragging, story, addToShelf]);

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`cursor-grab active:cursor-grabbing transition-all duration-200 ${
        theme === 'pixel' ? 'hover:shadow-pixel-accent' : 'hover:shadow-soft-hover'
      }`}
    >
      <motion.div
        animate={{
          scale: isDragging ? 1.08 : 1,
          y: isDragging ? [0, -2, 0] : 0,
        }}
        transition={{
          scale: { duration: 0.2 },
          y: { 
            duration: 1.5, 
            repeat: isDragging ? Infinity : 0, 
            ease: "easeInOut" 
          }
        }}
        style={{
          boxShadow: isDragging 
            ? theme === 'pixel' 
              ? '0 0 20px #FF3C00, 0 0 40px #FF3C00' 
              : '0 0 20px #C5B4E3, 0 0 40px rgba(197, 180, 227, 0.3)'
            : undefined,
          border: isDragging 
            ? theme === 'pixel'
              ? '2px solid #FF3C00'
              : '2px solid #C5B4E3'
            : undefined,
          borderRadius: theme === 'pixel' ? '0px' : '12px'
        }}
      >
        {children}
        
        {/* Floating upload indicator when dragging */}
        {isDragging && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center ${
              theme === 'pixel' 
                ? 'bg-hn-accent text-hn-background' 
                : 'bg-lavender text-white'
            }`}
          >
            <Upload size={16} />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default DraggableStoryItem;
