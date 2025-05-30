
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { useShelf } from '@/context/ShelfContext';
import { useTheme } from '@/context/ThemeContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import ShelfItem from './ShelfItem';
import ShelfAI from './ShelfAI';

const Shelf: React.FC = () => {
  const { savedArticles, savedCount } = useShelf();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const storyData = e.dataTransfer.getData('application/json');
      if (storyData) {
        const story = JSON.parse(storyData);
        // The addToShelf will be handled by the story item itself
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  return (
    <>
      {/* Desktop Shelf - Fixed Right Side */}
      <div className="hidden lg:block fixed right-4 top-1/2 -translate-y-1/2 z-40">
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className={`
            ${theme === 'pixel' 
              ? 'bg-hn-background border-2 border-hn-accent shadow-pixel-accent' 
              : 'bg-white/80 backdrop-blur-md border border-white/30 shadow-2xl'
            }
            rounded-xl p-4 w-80 max-h-96
          `}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BookOpen size={20} className={theme === 'pixel' ? 'text-hn-accent' : 'text-lavender'} />
              <h3 className={`font-semibold ${theme === 'pixel' ? 'text-hn-text font-pixel' : 'text-soft-text font-poppins'}`}>
                Shelf
              </h3>
              {savedCount > 0 && (
                <span className={`
                  px-2 py-1 rounded-full text-xs font-medium
                  ${theme === 'pixel' 
                    ? 'bg-hn-accent text-hn-background' 
                    : 'bg-lavender text-white'
                  }
                `}>
                  {savedCount}
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAIOpen(!isAIOpen)}
              className={theme === 'pixel' ? 'text-hn-accent hover:bg-hn-accent/20' : 'text-lavender hover:bg-lavender/20'}
            >
              <Sparkles size={16} />
            </Button>
          </div>

          <ScrollArea className="h-64">
            <AnimatePresence>
              {savedArticles.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-center py-8 ${theme === 'pixel' ? 'text-muted-foreground' : 'text-soft-text-secondary'}`}
                >
                  <BookOpen size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Drop articles here to save for later</p>
                </motion.div>
              ) : (
                savedArticles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ShelfItem article={article} />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </ScrollArea>

          <AnimatePresence>
            {isAIOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-3 pt-3 border-t border-white/20"
              >
                <ShelfAI />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Mobile Shelf - Bottom Collapsible */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className={`
            ${theme === 'pixel'
              ? 'bg-hn-background border-t-2 border-hn-accent'
              : 'bg-white/90 backdrop-blur-md border-t border-white/30'
            }
            px-4 pb-safe
          `}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`
              w-full py-3 flex items-center justify-between
              ${theme === 'pixel' ? 'text-hn-text' : 'text-soft-text'}
            `}
          >
            <div className="flex items-center gap-2">
              <BookOpen size={20} className={theme === 'pixel' ? 'text-hn-accent' : 'text-lavender'} />
              <span className="font-medium">Shelf</span>
              {savedCount > 0 && (
                <span className={`
                  px-2 py-1 rounded-full text-xs font-medium
                  ${theme === 'pixel' 
                    ? 'bg-hn-accent text-hn-background' 
                    : 'bg-lavender text-white'
                  }
                `}>
                  {savedCount}
                </span>
              )}
            </div>
            {isOpen ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="pb-4"
              >
                <ScrollArea className="h-64">
                  {savedArticles.length === 0 ? (
                    <div className={`text-center py-8 ${theme === 'pixel' ? 'text-muted-foreground' : 'text-soft-text-secondary'}`}>
                      <BookOpen size={32} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Drop articles here to save for later</p>
                    </div>
                  ) : (
                    savedArticles.map((article) => (
                      <ShelfItem key={article.id} article={article} />
                    ))
                  )}
                </ScrollArea>

                <div className="mt-3 pt-3 border-t border-white/20">
                  <Button
                    onClick={() => setIsAIOpen(!isAIOpen)}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Sparkles size={16} className="mr-2" />
                    Ask AI about my shelf
                  </Button>
                </div>

                <AnimatePresence>
                  {isAIOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-3"
                    >
                      <ShelfAI />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
};

export default Shelf;
