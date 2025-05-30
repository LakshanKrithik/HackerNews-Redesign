
import React, { useState } from 'react';
import { HNStory } from '@/types';
import { MessageCircle, ThumbsUp, User, Clock, ThumbsDown, Flame, Rocket, Heart } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useShelf } from '@/context/ShelfContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

interface StoryItemProps {
  story: HNStory;
  index: number;
}

const StoryItem: React.FC<StoryItemProps> = ({ story, index }) => {
  const { theme } = useTheme();
  const { addToShelf, removeFromShelf, isInShelf } = useShelf();
  const domain = story.url ? new URL(story.url).hostname.replace('www.', '') : null;
  const [activeReactions, setActiveReactions] = useState<Record<string, boolean>>({});
  const [animatingReaction, setAnimatingReaction] = useState<string | null>(null);
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

  const handleReactionClick = (reactionName: string) => {
    const reactionKey = `${story.id}-${reactionName}`;
    const isCurrentlyActive = activeReactions[reactionKey];
    
    // Toggle reaction state
    setActiveReactions(prev => ({
      ...prev,
      [reactionKey]: !isCurrentlyActive
    }));
    
    // Trigger animation
    setAnimatingReaction(reactionKey);
    setTimeout(() => {
      setAnimatingReaction(null);
    }, 600);
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isBookmarked) {
      removeFromShelf(story.id);
    } else {
      addToShelf(story);
    }
  };

  const getReactionVariants = (reactionName: string) => {
    const reactionKey = `${story.id}-${reactionName}`;
    const isActive = activeReactions[reactionKey];
    const isAnimating = animatingReaction === reactionKey;

    switch (reactionName) {
      case 'like':
        return {
          scale: isAnimating ? [1, 1.3, 1.1, 1] : 1,
          rotate: isAnimating ? [0, 10, -5, 0] : 0,
          y: isAnimating ? [0, -5, 0] : 0,
        };
      case 'dislike':
        return {
          scale: isAnimating ? [1, 0.9, 1.1, 1] : 1,
          x: isAnimating ? [0, -3, 3, -2, 2, 0] : 0,
          rotate: isAnimating ? [0, -5, 5, 0] : 0,
        };
      case 'fire':
        return {
          scale: isAnimating ? [1, 1.2, 1] : 1,
          y: isAnimating ? [0, -8, -4, 0] : 0,
          rotate: isAnimating ? [0, 5, -5, 0] : 0,
        };
      case 'rocket':
        return {
          scale: isAnimating ? [1, 1.1, 1] : 1,
          y: isAnimating ? [0, -12, -6, 0] : 0,
          x: isAnimating ? [0, 2, -1, 0] : 0,
        };
      default:
        return {};
    }
  };

  const getReactionColor = (reactionName: string) => {
    const reactionKey = `${story.id}-${reactionName}`;
    const isActive = activeReactions[reactionKey];
    
    if (!isActive) {
      return theme === 'pixel' ? 'text-hn-text' : 'text-soft-text-secondary';
    }
    
    switch (reactionName) {
      case 'like':
        return 'text-green-500';
      case 'dislike':
        return 'text-red-500';
      case 'fire':
        return 'text-orange-500';
      case 'rocket':
        return 'text-blue-500';
      default:
        return theme === 'pixel' ? 'text-hn-accent' : 'text-soft-accent';
    }
  };

  const reactions = [
    { name: 'like', icon: ThumbsUp, label: 'Like' },
    { name: 'dislike', icon: ThumbsDown, label: 'Dislike' },
    { name: 'fire', icon: Flame, label: 'Mark as Hot' },
    { name: 'rocket', icon: Rocket, label: 'Launchworthy' },
  ];

  // Pixel theme styles
  if (theme === 'pixel') {
    return (
      <TooltipProvider>
        <article className="py-3 px-2 border-b border-hn-border last:border-b-0 hover:bg-white/5 transition-colors duration-150 group relative">
          {/* Heart Icon - Top Right - Always visible */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleBookmarkClick}
            className={`
              absolute top-2 right-2 p-2 rounded z-10 transition-all duration-200
              ${isBookmarked 
                ? 'text-red-500 bg-red-500/10' 
                : 'text-muted-foreground hover:text-red-500 hover:bg-red-500/10'
              }
            `}
            title={isBookmarked ? 'Remove from Shelf' : 'Add to Shelf'}
          >
            <Heart 
              size={18} 
              className={isBookmarked ? 'fill-current' : ''} 
            />
          </motion.button>

          <div className="flex items-baseline pr-12">
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
              {/* Reaction Icons Section */}
              <div className="mt-2 flex items-center space-x-2">
                {reactions.map(reaction => {
                  const reactionKey = `${story.id}-${reaction.name}`;
                  const isAnimating = animatingReaction === reactionKey;
                  
                  return (
                    <Tooltip key={reaction.name}>
                      <TooltipTrigger asChild>
                        <motion.button
                          onClick={() => handleReactionClick(reaction.name)}
                          className={`p-1 rounded hover:bg-hn-accent/20 transition-colors duration-150 relative ${getReactionColor(reaction.name)}`}
                          aria-label={reaction.label}
                          animate={getReactionVariants(reaction.name)}
                          transition={{
                            duration: 0.6,
                            ease: "easeOut",
                            times: [0, 0.3, 0.7, 1]
                          }}
                        >
                          <reaction.icon size={16} />
                          
                          {/* Special effect animations */}
                          <AnimatePresence>
                            {isAnimating && (
                              <>
                                {reaction.name === 'like' && (
                                  <motion.div
                                    initial={{ scale: 0, opacity: 0.8 }}
                                    animate={{ scale: 2, opacity: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="absolute inset-0 rounded-full bg-green-500/30"
                                  />
                                )}
                                {reaction.name === 'fire' && (
                                  <motion.div
                                    initial={{ y: 0, opacity: 1, scale: 0.5 }}
                                    animate={{ y: -20, opacity: 0, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.8 }}
                                    className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-orange-400 text-xs"
                                  >
                                    🔥
                                  </motion.div>
                                )}
                                {reaction.name === 'rocket' && (
                                  <motion.div
                                    initial={{ y: 0, opacity: 1, scale: 0.5 }}
                                    animate={{ y: -15, opacity: 0, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-blue-400 text-xs"
                                  >
                                    ✨
                                  </motion.div>
                                )}
                              </>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{reaction.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          </div>
        </article>
      </TooltipProvider>
    );
  }

  // Soft UI theme styles
  return (
    <TooltipProvider>
      <article className="mb-4 last:mb-0">
        <div className="bg-white rounded-xl p-4 shadow-soft hover:shadow-soft-hover transform hover:-translate-y-1 transition-all duration-300 relative group">
          {/* Heart Icon - Top Right - Always visible */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleBookmarkClick}
            className={`
              absolute top-3 right-3 p-2 rounded-full z-10 transition-all duration-200
              ${isBookmarked 
                ? 'text-red-500 bg-red-50' 
                : 'text-soft-text-secondary hover:text-red-500 hover:bg-red-50'
              }
            `}
            title={isBookmarked ? 'Remove from Shelf' : 'Add to Shelf'}
          >
            <Heart 
              size={18} 
              className={isBookmarked ? 'fill-current' : ''} 
            />
          </motion.button>

          <div className="flex items-start pr-12">
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
            
            <div className="flex-1">
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
              
              {/* Reaction Icons Section */}
              <div className="mt-3 flex items-center space-x-3">
                {reactions.map(reaction => {
                  const reactionKey = `${story.id}-${reaction.name}`;
                  const isAnimating = animatingReaction === reactionKey;
                  
                  return (
                    <Tooltip key={reaction.name}>
                      <TooltipTrigger asChild>
                        <motion.button
                          onClick={() => handleReactionClick(reaction.name)}
                          className={`p-2 rounded-full hover:bg-gray-100 transition-colors duration-150 relative ${getReactionColor(reaction.name)}`}
                          aria-label={reaction.label}
                          animate={getReactionVariants(reaction.name)}
                          transition={{
                            duration: 0.6,
                            ease: "easeOut",
                            times: [0, 0.3, 0.7, 1]
                          }}
                        >
                          <reaction.icon size={18} />
                          
                          {/* Special effect animations */}
                          <AnimatePresence>
                            {isAnimating && (
                              <>
                                {reaction.name === 'like' && (
                                  <motion.div
                                    initial={{ scale: 0, opacity: 0.8 }}
                                    animate={{ scale: 2.5, opacity: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="absolute inset-0 rounded-full bg-green-500/20"
                                  />
                                )}
                                {reaction.name === 'fire' && (
                                  <motion.div
                                    initial={{ y: 0, opacity: 1, scale: 0.5 }}
                                    animate={{ y: -25, opacity: 0, scale: 1.2 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.8 }}
                                    className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-orange-400"
                                  >
                                    🔥
                                  </motion.div>
                                )}
                                {reaction.name === 'rocket' && (
                                  <motion.div
                                    initial={{ y: 0, opacity: 1, scale: 0.5 }}
                                    animate={{ y: -20, opacity: 0, scale: 1.2 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-blue-400"
                                  >
                                    ✨
                                  </motion.div>
                                )}
                              </>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{reaction.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </article>
    </TooltipProvider>
  );
};

export default StoryItem;
