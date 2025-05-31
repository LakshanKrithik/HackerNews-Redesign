
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import StoryItem from '@/components/StoryItem';
import LoadingSpinner from '@/components/LoadingSpinner';
import { HNStory, HNItem } from '@/types';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';
import { useInterests } from '@/context/InterestsContext';
import { Settings } from 'lucide-react';
import DraggableStoryItem from '@/components/DraggableStoryItem';
import { motion, AnimatePresence } from 'framer-motion';

const getStoryTypeFromPath = (pathname: string): string => {
  switch (pathname) {
    case '/new':
      return 'newstories';
    case '/top':
      return 'topstories';
    case '/ask':
      return 'askstories';
    case '/show':
      return 'showstories';
    case '/jobs':
      return 'jobstories';
    default:
      return 'topstories';
  }
};

const getPageTitle = (pathname: string): string => {
  switch (pathname) {
    case '/new':
      return 'New Stories';
    case '/top':
      return 'Top Stories';
    case '/ask':
      return 'Ask HN';
    case '/show':
      return 'Show HN';
    case '/jobs':
      return 'Jobs';
    default:
      return 'Top Stories';
  }
};

const getPageDescription = (pathname: string): string => {
  switch (pathname) {
    case '/new':
      return 'The latest stories submitted to Hacker News';
    case '/top':
      return 'The most popular stories from the developer community';
    case '/ask':
      return 'Questions and discussions from the HN community';
    case '/show':
      return 'Projects and creations shared by the community';
    case '/jobs':
      return 'Job opportunities in tech';
    default:
      return 'The latest and most popular stories from the developer community';
  }
};

const fetchStoryIds = async (storyType: string): Promise<number[]> => {
  const res = await fetch(`https://hacker-news.firebaseio.com/v0/${storyType}.json`);
  if (!res.ok) throw new Error(`Network response was not ok for ${storyType}`);
  return res.json();
};

const fetchItem = async (id: number): Promise<HNItem> => {
  const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
  if (!res.ok) throw new Error(`Network response was not ok for item ${id}`);
  return res.json();
};

const STORIES_PER_PAGE = 20;

const Index = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { theme } = useTheme();
  const { selectedTopics, scoreStory } = useInterests();
  const location = useLocation();
  
  const storyType = getStoryTypeFromPath(location.pathname);
  const pageTitle = getPageTitle(location.pathname);
  const pageDescription = getPageDescription(location.pathname);

  // Reset to first page when route changes
  useEffect(() => {
    setCurrentPage(0);
    // Smooth scroll to top when switching views
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const { data: storyIds, isLoading: isLoadingIds, error: errorIds } = useQuery<number[], Error>({
    queryKey: [storyType],
    queryFn: () => fetchStoryIds(storyType),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const currentStoryIds = storyIds?.slice(currentPage * STORIES_PER_PAGE, (currentPage + 1) * STORIES_PER_PAGE);

  const { data: stories = [], isLoading: isLoadingStories, error: errorStories } = useQuery<HNStory[], Error>({
    queryKey: ['stories', storyType, currentStoryIds, selectedTopics],
    queryFn: async () => {
      if (!currentStoryIds || currentStoryIds.length === 0) return [];
      const storyPromises = currentStoryIds.map(id => fetchItem(id));
      const fetchedItems: HNItem[] = await Promise.all(storyPromises);
      
      // Filter for valid stories that are not deleted or dead
      const validStories = fetchedItems.filter(
        item => item && !item.deleted && !item.dead
      );
      
      // Sort by interest score if user has selected topics
      if (selectedTopics.length > 0) {
        return (validStories as HNStory[]).sort((a, b) => {
          const scoreA = scoreStory(a.title, a.url);
          const scoreB = scoreStory(b.title, b.url);
          
          if (scoreA !== scoreB) {
            return scoreB - scoreA;
          }
          
          return 0;
        });
      }
      
      return validStories as HNStory[];
    },
    enabled: !!currentStoryIds && currentStoryIds.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  useEffect(() => {
    console.log("Story type:", storyType);
    console.log("Story IDs:", storyIds);
    console.log("Current page IDs:", currentStoryIds);
    console.log("Fetched stories:", stories);
  }, [storyType, storyIds, currentStoryIds, stories]);

  if (errorIds || errorStories) {
    const error = errorIds || errorStories;
    return (
      <Layout>
        <div className={`text-center py-10 ${theme === 'pixel' ? 'text-hn-accent font-pixel' : 'text-soft-accent font-poppins'}`}>
          <p>Error loading stories: {error?.message}</p>
          <p>Please try refreshing the page.</p>
        </div>
      </Layout>
    );
  }
  
  const totalPages = storyIds ? Math.ceil(storyIds.length / STORIES_PER_PAGE) : 0;

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        {theme === 'pixel' ? (
          <h1 className="font-pixel text-2xl sm:text-3xl text-hn-accent animate-flicker">
            {pageTitle}
            {selectedTopics.length > 0 && <span className="text-sm ml-2">({selectedTopics.length} interests)</span>}
          </h1>
        ) : (
          <div className="text-center flex-1">
            <h1 className="font-poppins font-bold text-3xl sm:text-4xl bg-gradient-to-r from-lavender to-soft-accent bg-clip-text text-transparent mb-2">
              {pageTitle}
            </h1>
            <p className="text-soft-text-secondary max-w-xl mx-auto">
              {selectedTopics.length > 0 
                ? `Personalized feed based on ${selectedTopics.length} selected interests`
                : pageDescription
              }
            </p>
          </div>
        )}
        
        <Button
          asChild
          variant="outline"
          size="sm"
          className={theme === 'pixel' 
            ? "bg-hn-background text-hn-text hover:bg-hn-accent hover:text-hn-background border-hn-border shadow-pixel-sm" 
            : "bg-white text-soft-text hover:bg-lavender hover:text-white border-soft-border rounded-full shadow-soft"
          }
        >
          <a href="/settings">
            <Settings size={16} className="mr-2" />
            Settings
          </a>
        </Button>
      </div>

      {(isLoadingIds || (isLoadingStories && (!stories || stories.length === 0))) ? (
        <LoadingSpinner />
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={storyType}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={theme === 'pixel' 
                ? "bg-hn-background border border-hn-border shadow-pixel"
                : "bg-transparent"
              }
            >
              {stories && stories.length > 0 ? (
                stories.map((story, index) => (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <DraggableStoryItem 
                      story={story} 
                      index={currentPage * STORIES_PER_PAGE + index}
                    >
                      <StoryItem 
                        story={story} 
                        index={currentPage * STORIES_PER_PAGE + index} 
                      />
                    </DraggableStoryItem>
                  </motion.div>
                ))
              ) : (
                <p className={`text-center py-10 ${theme === 'pixel' ? 'text-muted-foreground' : 'text-soft-text-secondary'}`}>
                  No stories found or still loading...
                </p>
              )}
            </motion.div>
          </AnimatePresence>
          
          {totalPages > 1 && (
            <div className={`mt-8 flex justify-center items-center space-x-2 ${
              theme === 'pixel' ? 'font-pixel' : 'font-poppins'
            }`}>
              <Button
                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                variant="outline"
                className={theme === 'pixel' 
                  ? "bg-hn-background text-hn-text hover:bg-hn-accent hover:text-hn-background border-hn-border shadow-pixel-sm hover:shadow-pixel-accent" 
                  : "bg-white text-soft-text hover:bg-lavender hover:text-white border-soft-border rounded-full shadow-soft"
                }
              >
                Prev
              </Button>
              <span className={`text-sm ${theme === 'pixel' ? 'text-muted-foreground' : 'text-soft-text-secondary'}`}>
                Page {currentPage + 1} of {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage === totalPages - 1 || !stories || stories.length < STORIES_PER_PAGE}
                variant="outline"
                className={theme === 'pixel' 
                  ? "bg-hn-background text-hn-text hover:bg-hn-accent hover:text-hn-background border-hn-border shadow-pixel-sm hover:shadow-pixel-accent" 
                  : "bg-white text-soft-text hover:bg-lavender hover:text-white border-soft-border rounded-full shadow-soft"
                }
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </Layout>
  );
};

export default Index;
