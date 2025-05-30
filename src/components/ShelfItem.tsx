
import React from 'react';
import { motion } from 'framer-motion';
import { X, ExternalLink, Clock } from 'lucide-react';
import { HNStory } from '@/types';
import { useShelf } from '@/context/ShelfContext';
import { useTheme } from '@/context/ThemeContext';

interface ShelfItemProps {
  article: HNStory;
}

const ShelfItem: React.FC<ShelfItemProps> = ({ article }) => {
  const { removeFromShelf } = useShelf();
  const { theme } = useTheme();

  const domain = article.url ? new URL(article.url).hostname.replace('www.', '') : null;

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

  return (
    <motion.div
      layout
      className={`
        relative mb-3 p-3 rounded-lg group cursor-pointer
        ${theme === 'pixel' 
          ? 'bg-hn-background border border-hn-border hover:border-hn-accent' 
          : 'bg-white/50 border border-white/20 hover:bg-white/70'
        }
        transition-all duration-200
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <a
            href={article.url || `https://news.ycombinator.com/item?id=${article.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              text-sm font-medium line-clamp-2 hover:underline
              ${theme === 'pixel' ? 'text-hn-text' : 'text-soft-text'}
            `}
          >
            {article.title}
          </a>
          <div className={`
            flex items-center gap-2 mt-1 text-xs
            ${theme === 'pixel' ? 'text-muted-foreground' : 'text-soft-text-secondary'}
          `}>
            {domain && <span>({domain})</span>}
            <span className="flex items-center gap-1">
              <Clock size={10} />
              {timeAgo(article.time)}
            </span>
            {article.score && <span>{article.score} pts</span>}
          </div>
        </div>
        
        <div className="flex items-center gap-1 ml-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              window.open(article.url || `https://news.ycombinator.com/item?id=${article.id}`, '_blank');
            }}
            className={`
              p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity
              ${theme === 'pixel' ? 'hover:bg-hn-accent/20 text-hn-accent' : 'hover:bg-lavender/20 text-lavender'}
            `}
          >
            <ExternalLink size={12} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              removeFromShelf(article.id);
            }}
            className={`
              p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity
              ${theme === 'pixel' ? 'hover:bg-red-500/20 text-red-500' : 'hover:bg-red-500/20 text-red-500'}
            `}
          >
            <X size={12} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ShelfItem;
