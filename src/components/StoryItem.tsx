
import React, { useState } from 'react';
import { HNStory } from '@/types';
import { MessageCircle, ThumbsUp, User, Clock, ThumbsDown, Flame, Rocket, Heart } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useShelf } from '@/context/ShelfContext';
import { motion } from 'framer-motion';

interface StoryItemProps {
  story: HNStory;
  index: number;
}

const StoryItem: React.FC<StoryItemProps> = ({ story, index }) => {
  const { theme } = useTheme();
  const { addToShelf, removeFromShelf, isInShelf } = useShelf();
  const domain = story.url ? new URL(story.url).hostname.replace('www.', '') : null;
  const [activeAnimation, setActiveAnimation] = useState<string | null>(null);
  const isBookmarked = isInShelf(story.id);

  const timeAgo = (timestamp: number): string => {
    const now = Math.floor(Date.now() / 1000);
    const seconds = now - timestamp;
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleReactionClick = (reactionName: string, storyId: number) => {
    console.log(`Reacted with ${reactionName} to story ${storyId}`);
    setActiveAnimation(`${storyId}-${reactionName}`);
    setTimeout(() => {
      setActiveAnimation(null);
    }, 300);
  };

  const handleBookmarkClick = () => {
    if (isBookmarked) {
      removeFromShelf(story.id);
    } else {
      addToShelf(story);
    }
  };

  const reactions = [
    { name: 'like', icon: ThumbsUp, label: 'Like' },
    { name: 'dislike', icon: ThumbsDown, label: 'Dislike' },
    { name: 'fire', icon: Flame, label: 'Fire Hot' },
    { name: 'rocket', icon: Rocket, label: 'To The Moon!' },
  ];

  // Pixel theme styles
  if (theme === 'pixel') {
    return (
      <article className="py-3 px-2 border-b border-hn-border last:border-b-0 hover:bg-white/5 transition-colors duration-150 group relative">
        {/* Heart Icon - Top Right */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleBookmarkClick}
          className={`
            absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-200
            ${isBookmarked 
              ? 'text-red-500 opacity-100' 
              : 'text-muted-foreground hover:text-red-500'
            }
          `}
          title={isBookmarked ? 'Remove from Shelf' : 'Add to Shelf'}
        >
          <Heart 
            size={16} 
            className={isBookmarked ? 'fill-current' : ''} 
          />
        </motion.button>

        <div className="flex items-baseline">
          <span className="text-muted-foreground text-sm mr-2 w-6 text-right">{index + 1}.</span>
          <div>
            <a
              href={story.url || `https://news.ycombinator.com/item?id=${story.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-pixel text-base md:text-lg text-hn-text mb-1 group-hover:text-hn-accent relative inline-block"
            >
              <span className="relative z-10 group-hover:animate-text-shadow-glitch">{story.title}</span>
               {domain && <span className="text-xs text-muted-foreground ml-1">({domain})</span>}
            </a>
            <div className="text-xs text-muted-foreground flex items-center flex-wrap gap-x-3 gap-y-1 mt-1 font-mono">
              {story.score && (
                <span className="flex items-center">
                  <ThumbsUp size={12} className="mr-1 text-hn-accent" /> {story.score} pts
                </span>
              )}
              {story.by && (
                <span className="flex items-center">
                  <User size={12} className="mr-1" /> by {story.by}
                </span>
              )}
              <span className="flex items-center">
                <Clock size={12} className="mr-1" /> {timeAgo(story.time)}
              </span>
              {typeof story.descendants !== 'undefined' && (
                 <a 
                  href={`https://news.ycombinator.com/item?id=${story.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-hn-accent-secondary glitch-text-hover"
                  data-text={`${story.descendants} comments`}
                >
                  <MessageCircle size={12} className="mr-1 text-hn-accent-secondary" /> {story.descendants} comments
                </a>
              )}
            </div>
            {/* Reaction Emojis Section */}
            <div className="mt-2 flex items-center space-x-2">
              {reactions.map(reaction => (
                <button
                  key={reaction.name}
                  title={reaction.label}
                  onClick={() => handleReactionClick(reaction.name, story.id)}
                  className={`p-1 rounded hover:bg-hn-accent/20 transition-colors duration-150 ${
                    activeAnimation === `${story.id}-${reaction.name}` ? 'animate-icon-glitch' : ''
                  }`}
                  aria-label={reaction.label}
                >
                  <reaction.icon 
                    size={16} 
                    className="text-hn-text group-hover:text-hn-accent" 
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Soft UI theme styles
  return (
    <article className="mb-4 last:mb-0">
      <div className="bg-white rounded-xl p-4 shadow-soft hover:shadow-soft-hover transform hover:-translate-y-1 transition-all duration-300 relative group">
        {/* Heart Icon - Top Right */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleBookmarkClick}
          className={`
            absolute top-3 right-3 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200
            ${isBookmarked 
              ? 'text-red-500 opacity-100 bg-red-50' 
              : 'text-soft-text-secondary hover:text-red-500 hover:bg-red-50'
            }
          `}
          title={isBookmarked ? 'Remove from Shelf' : 'Add to Shelf'}
        >
          <Heart 
            size={16} 
            className={isBookmarked ? 'fill-current' : ''} 
          />
        </motion.button>

        <div className="flex items-start">
          <div className="flex flex-col items-center mr-4">
            <div className="bg-soft-background rounded-full w-8 h-8 flex items-center justify-center font-poppins text-soft-text">
              {index + 1}
            </div>
            {story.score && (
              <div className="mt-2 flex flex-col items-center">
                <ThumbsUp size={14} className="text-lavender mb-1" />
                <span className="text-xs text-soft-text-secondary">{story.score}</span>
              </div>
            )}
          </div>
          
          <div className="flex-1 pr-8">
            <a
              href={story.url || `https://news.ycombinator.com/item?id=${story.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-soft-text text-lg font-medium leading-tight hover:text-soft-accent transition-colors"
            >
              {story.title}
              {domain && <span className="text-xs text-soft-text-secondary ml-2 font-normal">({domain})</span>}
            </a>
            
            <div className="mt-2 flex flex-wrap items-center text-xs text-soft-text-secondary gap-4">
              {story.by && (
                <span className="flex items-center">
                  <User size={12} className="mr-1 text-lavender" /> {story.by}
                </span>
              )}
              <span className="flex items-center">
                <Clock size={12} className="mr-1 text-lavender" /> {timeAgo(story.time)}
              </span>
              {typeof story.descendants !== 'undefined' && (
                <a 
                  href={`https://news.ycombinator.com/item?id=${story.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-soft-accent-secondary hover:text-soft-accent transition-colors"
                >
                  <MessageCircle size={12} className="mr-1" /> {story.descendants} comments
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default StoryItem;
