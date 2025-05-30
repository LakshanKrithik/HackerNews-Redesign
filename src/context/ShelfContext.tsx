
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { HNStory } from '@/types';
import { toast } from '@/hooks/use-toast';

interface ShelfState {
  savedArticles: HNStory[];
}

type ShelfAction = 
  | { type: 'ADD_ARTICLE'; payload: HNStory }
  | { type: 'REMOVE_ARTICLE'; payload: number }
  | { type: 'LOAD_ARTICLES'; payload: HNStory[] };

const shelfReducer = (state: ShelfState, action: ShelfAction): ShelfState => {
  switch (action.type) {
    case 'ADD_ARTICLE':
      const exists = state.savedArticles.find(article => article.id === action.payload.id);
      if (exists) return state;
      return {
        ...state,
        savedArticles: [...state.savedArticles, action.payload]
      };
    case 'REMOVE_ARTICLE':
      return {
        ...state,
        savedArticles: state.savedArticles.filter(article => article.id !== action.payload)
      };
    case 'LOAD_ARTICLES':
      return {
        ...state,
        savedArticles: action.payload
      };
    default:
      return state;
  }
};

interface ShelfContextType {
  savedArticles: HNStory[];
  addToShelf: (article: HNStory) => void;
  removeFromShelf: (articleId: number) => void;
  isInShelf: (articleId: number) => boolean;
  savedCount: number;
}

const ShelfContext = createContext<ShelfContextType | undefined>(undefined);

export const ShelfProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(shelfReducer, { savedArticles: [] });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('hn-shelf');
    if (saved) {
      try {
        const articles = JSON.parse(saved);
        dispatch({ type: 'LOAD_ARTICLES', payload: articles });
      } catch (error) {
        console.error('Error loading shelf data:', error);
      }
    }
  }, []);

  // Save to localStorage whenever savedArticles changes
  useEffect(() => {
    localStorage.setItem('hn-shelf', JSON.stringify(state.savedArticles));
  }, [state.savedArticles]);

  const addToShelf = (article: HNStory) => {
    const exists = state.savedArticles.find(a => a.id === article.id);
    if (!exists) {
      dispatch({ type: 'ADD_ARTICLE', payload: article });
      toast({
        title: "Added to Shelf 📚",
        description: article.title,
      });
    }
  };

  const removeFromShelf = (articleId: number) => {
    dispatch({ type: 'REMOVE_ARTICLE', payload: articleId });
    toast({
      title: "Removed from Shelf ❌",
      description: "Article removed from your reading list",
    });
  };

  const isInShelf = (articleId: number) => {
    return state.savedArticles.some(article => article.id === articleId);
  };

  const value: ShelfContextType = {
    savedArticles: state.savedArticles,
    addToShelf,
    removeFromShelf,
    isInShelf,
    savedCount: state.savedArticles.length,
  };

  return (
    <ShelfContext.Provider value={value}>
      {children}
    </ShelfContext.Provider>
  );
};

export const useShelf = () => {
  const context = useContext(ShelfContext);
  if (context === undefined) {
    throw new Error('useShelf must be used within a ShelfProvider');
  }
  return context;
};
