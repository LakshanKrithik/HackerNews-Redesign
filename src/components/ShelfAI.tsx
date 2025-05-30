
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import { useShelf } from '@/context/ShelfContext';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

const ShelfAI: React.FC = () => {
  const { savedArticles } = useShelf();
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickActions = [
    "Summarize my shelf",
    "Group articles by topic",
    "What's trending?",
    "Best articles to read first"
  ];

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare context about saved articles
      const articlesContext = savedArticles.map(article => ({
        title: article.title,
        url: article.url,
        score: article.score,
        by: article.by,
        time: article.time
      }));

      const response = await fetch('/functions/v1/chat-with-patch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...messages.map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.content
            })),
            {
              role: 'user',
              content: content
            }
          ],
          articleContext: {
            type: 'shelf_analysis',
            articles: articlesContext,
            count: savedArticles.length
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: 'ai',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I couldn't analyze your shelf right now. Please try again later.",
        sender: 'ai',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (savedArticles.length === 0) {
    return (
      <div className={`text-center py-4 ${theme === 'pixel' ? 'text-muted-foreground' : 'text-soft-text-secondary'}`}>
        <p className="text-sm">Save some articles first to get AI insights!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {messages.length > 0 && (
        <ScrollArea className="h-32">
          <div className="space-y-2">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`
                  text-xs p-2 rounded max-w-[90%]
                  ${message.sender === 'user'
                    ? `ml-auto ${theme === 'pixel' ? 'bg-hn-accent text-hn-background' : 'bg-lavender text-white'}`
                    : `mr-auto ${theme === 'pixel' ? 'bg-hn-border text-hn-text' : 'bg-white/50 text-soft-text'}`
                  }
                `}
              >
                {message.content}
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      )}

      {messages.length === 0 && (
        <div className="grid grid-cols-1 gap-2">
          {quickActions.map((action) => (
            <Button
              key={action}
              variant="outline"
              size="sm"
              onClick={() => sendMessage(action)}
              disabled={isLoading}
              className={`
                text-xs h-8 justify-start
                ${theme === 'pixel' 
                  ? 'border-hn-border hover:bg-hn-accent hover:text-hn-background' 
                  : 'border-white/30 hover:bg-lavender hover:text-white'
                }
              `}
            >
              {action}
            </Button>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
          placeholder="Ask about your shelf..."
          disabled={isLoading}
          className={`
            flex-1 px-2 py-1 text-xs rounded border
            ${theme === 'pixel'
              ? 'bg-hn-background border-hn-border text-hn-text placeholder:text-muted-foreground'
              : 'bg-white/50 border-white/30 text-soft-text placeholder:text-soft-text-secondary'
            }
            focus:outline-none focus:ring-1 focus:ring-lavender
          `}
        />
        <Button
          onClick={() => sendMessage(input)}
          disabled={isLoading || !input.trim()}
          size="sm"
          className={`
            h-7 w-7 p-0
            ${theme === 'pixel' 
              ? 'bg-hn-accent hover:bg-hn-accent/80' 
              : 'bg-lavender hover:bg-lavender/80'
            }
          `}
        >
          {isLoading ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Send size={12} />
          )}
        </Button>
      </div>
    </div>
  );
};

export default ShelfAI;
