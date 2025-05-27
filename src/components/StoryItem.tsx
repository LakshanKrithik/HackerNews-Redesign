
import React from 'react';
import { HNStory } from '@/types';
import { MessageCircle, ThumbsUp, User, Clock } from 'lucide-react';

interface StoryItemProps {
  story: HNStory;
  index: number;
}

const StoryItem: React.FC<StoryItemProps> = ({ story, index }) => {
  const domain = story.url ? new URL(story.url).hostname.replace('www.', '') : null;

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
    <article className="py-3 px-2 border-b border-hn-border last:border-b-0 hover:bg-white/5 transition-colors duration-150 group">
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
        </div>
      </div>
    </article>
  );
};

export default StoryItem;
