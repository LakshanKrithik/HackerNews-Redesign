
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import StoryItem from '@/components/StoryItem';
import LoadingSpinner from '@/components/LoadingSpinner';
import { HNStory, HNItem } from '@/types';
import { Button } from '@/components/ui/button'; // Using shadcn button for pagination

const fetchStoryIds = async (): Promise<number[]> => {
  const res = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
  if (!res.ok) throw new Error('Network response was not ok for story IDs');
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

  const { data: storyIds, isLoading: isLoadingIds, error: errorIds } = useQuery<number[], Error>({
    queryKey: ['topStoryIds'],
    queryFn: fetchStoryIds,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const currentStoryIds = storyIds?.slice(currentPage * STORIES_PER_PAGE, (currentPage + 1) * STORIES_PER_PAGE);

  const { data: stories, isLoading: isLoadingStories, error: errorStories } = useQuery<HNStory[], Error>({
    queryKey: ['stories', currentStoryIds],
    queryFn: async () => {
      if (!currentStoryIds || currentStoryIds.length === 0) return [];
      const storyPromises = currentStoryIds.map(id => fetchItem(id) as Promise<HNStory>);
      const fetchedStories = await Promise.all(storyPromises);
      return fetchedStories.filter(story => story && story.type === 'story' && !story.deleted && !story.dead);
    },
    enabled: !!currentStoryIds && currentStoryIds.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  useEffect(() => {
    console.log("Story IDs:", storyIds);
    console.log("Current page IDs:", currentStoryIds);
    console.log("Fetched stories:", stories);
  }, [storyIds, currentStoryIds, stories]);


  if (errorIds || errorStories) {
    const error = errorIds || errorStories;
    return (
      <Layout>
        <div className="text-center text-hn-accent font-pixel py-10">
          <p>Error loading stories: {error?.message}</p>
          <p>Please try refreshing the page.</p>
        </div>
      </Layout>
    );
  }
  
  const totalPages = storyIds ? Math.ceil(storyIds.length / STORIES_PER_PAGE) : 0;

  return (
    <Layout>
      <h1 className="font-pixel text-2xl sm:text-3xl text-hn-accent mb-6 text-center animate-flicker">
        Top Stories
      </h1>
      {(isLoadingIds || (isLoadingStories && (!stories || stories.length === 0))) ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="bg-hn-background border border-hn-border shadow-pixel">
            {stories && stories.length > 0 ? (
              stories.map((story, index) => (
                <StoryItem 
                  key={story.id} 
                  story={story} 
                  index={currentPage * STORIES_PER_PAGE + index} 
                />
              ))
            ) : (
              <p className="text-center py-10 text-muted-foreground">No stories found or still loading...</p>
            )}
          </div>
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center space-x-2 font-pixel">
              <Button
                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                variant="outline"
                className="bg-hn-background text-hn-text hover:bg-hn-accent hover:text-hn-background border-hn-border shadow-pixel-sm hover:shadow-pixel-accent"
              >
                Prev
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage + 1} of {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage === totalPages - 1 || !stories || stories.length < STORIES_PER_PAGE}
                variant="outline"
                className="bg-hn-background text-hn-text hover:bg-hn-accent hover:text-hn-background border-hn-border shadow-pixel-sm hover:shadow-pixel-accent"
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
