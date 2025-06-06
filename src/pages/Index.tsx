
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import StoryItem from '@/components/StoryItem';
import MemeCard from '@/components/MemeCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { HNStory, HNItem } from '@/types';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';
import { useMemeMode } from '@/context/MemeModeContext';
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
  const [createdMemes, setCreatedMemes] = useState<any[]>([]);
  const { theme } = useTheme();
  const { isMemeMode } = useMemeMode();
  const { selectedTopics, scoreStory } = useInterests();
  const location = useLocation();
  
  const storyType = getStoryTypeFromPath(location.pathname);
  const pageTitle = isMemeMode ? `${getPageTitle(location.pathname)} Memes` : getPageTitle(location.pathname);
  const pageDescription = isMemeMode 
    ? `Hilarious memes about ${getPageTitle(location.pathname).toLowerCase()}` 
    : getPageDescription(location.pathname);

  // Reset to first page when route changes
  useEffect(() => {
    setCurrentPage(0);
    // Smooth scroll to top when switching views
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // Clear created memes when switching out of meme mode
  useEffect(() => {
    if (!isMemeMode) {
      setCreatedMemes([]);
    }
  }, [isMemeMode]);

  const handleMemeCreated = (newMeme: any) => {
    setCreatedMemes(prev => [newMeme, ...prev]);
    // Scroll to top to show the new meme
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      <Layout onMemeCreated={handleMemeCreated}>
        <div className={`text-center py-6 sm:py-10 px-2 ${
          isMemeMode 
            ? 'text-purple-600 font-poppins' 
            : theme === 'pixel' ? 'text-hn-accent font-pixel' : 'text-soft-accent font-poppins'
        }`}>
          <p className="text-sm sm:text-base">Error loading {isMemeMode ? 'memes' : 'stories'}: {error?.message}</p>
          <p className="text-sm sm:text-base">Please try refreshing the page.</p>
        </div>
      </Layout>
    );
  }
  
  const totalPages = storyIds ? Math.ceil(storyIds.length / STORIES_PER_PAGE) : 0;

  // Combine created memes with fetched stories for meme mode
  const displayItems = isMemeMode ? [...createdMemes, ...(stories || [])] : (stories || []);

  return (
    <Layout onMemeCreated={handleMemeCreated}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-4">
        {isMemeMode ? (
          <div className="text-center flex-1">
            <h1 className="font-poppins font-bold text-2xl sm:text-3xl lg:text-4xl xl:text-5xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              {pageTitle} 😂
            </h1>
            <p className="text-purple-600 max-w-xl mx-auto text-sm sm:text-base lg:text-lg px-2">
              {pageDescription} • Where tech news meets meme magic ✨
            </p>
          </div>
        ) : theme === 'pixel' ? (
          <h1 className="font-pixel text-xl sm:text-2xl lg:text-3xl text-hn-accent animate-flicker">
            {pageTitle}
            {selectedTopics.length > 0 && <span className="text-xs sm:text-sm ml-2">({selectedTopics.length} interests)</span>}
          </h1>
        ) : (
          <div className="text-center sm:text-left flex-1">
            <h1 className="font-poppins font-bold text-2xl sm:text-3xl lg:text-4xl bg-gradient-to-r from-lavender to-soft-accent bg-clip-text text-transparent mb-2">
              {pageTitle}
            </h1>
            <p className="text-soft-text-secondary max-w-xl mx-auto sm:mx-0 text-sm sm:text-base px-2 sm:px-0">
              {selectedTopics.length > 0 
                ? `Personalized feed based on ${selectedTopics.length} selected interests`
                : pageDescription
              }
            </p>
          </div>
        )}
        
        {!isMemeMode && (
          <Button
            asChild
            variant="outline"
            size="sm"
            className={`shrink-0 ${theme === 'pixel' 
              ? "bg-hn-background text-hn-text hover:bg-hn-accent hover:text-hn-background border-hn-border shadow-pixel-sm" 
              : "bg-white text-soft-text hover:bg-lavender hover:text-white border-soft-border rounded-full shadow-soft"
            }`}
          >
            <a href="/settings">
              <Settings size={14} className="sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Settings</span>
              <span className="sm:hidden">⚙️</span>
            </a>
          </Button>
        )}
      </div>

      {(isLoadingIds || (isLoadingStories && (!stories || stories.length === 0))) ? (
        <LoadingSpinner />
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${storyType}-${isMemeMode}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={isMemeMode 
                ? "space-y-4 sm:space-y-6"
                : theme === 'pixel' 
                  ? "bg-hn-background border border-hn-border shadow-pixel"
                  : "bg-transparent"
              }
            >
              {displayItems && displayItems.length > 0 ? (
                isMemeMode ? (
                  displayItems.map((story, index) => (
                    <MemeCard 
                      key={story.id}
                      story={story} 
                      index={index}
                    />
                  ))
                ) : (
                  displayItems.map((story, index) => (
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
                )
              ) : (
                <p className={`text-center py-6 sm:py-10 px-2 text-sm sm:text-base ${
                  isMemeMode 
                    ? 'text-purple-600' 
                    : theme === 'pixel' ? 'text-muted-foreground' : 'text-soft-text-secondary'
                }`}>
                  No {isMemeMode ? 'memes' : 'stories'} found or still loading...
                </p>
              )}
            </motion.div>
          </AnimatePresence>
          
          {totalPages > 1 && !isMemeMode && (
            <div className={`mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 ${
              isMemeMode ? 'font-poppins' : theme === 'pixel' ? 'font-pixel' : 'font-poppins'
            }`}>
              <Button
                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                variant="outline"
                size="sm"
                className={isMemeMode
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 border-purple-300 rounded-full font-bold"
                  : theme === 'pixel' 
                    ? "bg-hn-background text-hn-text hover:bg-hn-accent hover:text-hn-background border-hn-border shadow-pixel-sm hover:shadow-pixel-accent" 
                    : "bg-white text-soft-text hover:bg-lavender hover:text-white border-soft-border rounded-full shadow-soft"
                }
              >
                Prev
              </Button>
              <span className={`text-xs sm:text-sm px-2 ${
                isMemeMode 
                  ? 'text-purple-600 font-medium' 
                  : theme === 'pixel' ? 'text-muted-foreground' : 'text-soft-text-secondary'
              }`}>
                Page {currentPage + 1} of {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage === totalPages - 1 || !stories || stories.length < STORIES_PER_PAGE}
                variant="outline"
                size="sm"
                className={isMemeMode
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 border-purple-300 rounded-full font-bold"
                  : theme === 'pixel' 
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
