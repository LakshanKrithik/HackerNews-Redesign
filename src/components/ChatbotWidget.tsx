
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { HNStory } from '@/types';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ArticleContext {
  title: string;
  url?: string;
}

const ChatbotWidget: React.FC = () => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [articleContext, setArticleContext] = useState<ArticleContext | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const dragControls = useDragControls();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = articleContext 
        ? `Hey! I'm now channeling the essence of "${articleContext.title}". Ask me anything about myself!`
        : "Hey there! I'm Patch 🤖✨ Drop a story on me to chat about it, or just ask me anything tech-related!";
      
      setMessages([{
        id: '1',
        text: welcomeMessage,
        isBot: true,
        timestamp: new Date()
      }]);
    }
  }, [isOpen, articleContext]);

  const onDrop = (acceptedFiles: File[], event: any) => {
    // Check if we're dropping from a story card
    const draggedData = event.dataTransfer?.getData('application/json');
    if (draggedData) {
      try {
        const story: HNStory = JSON.parse(draggedData);
        setArticleContext({
          title: story.title,
          url: story.url
        });
        setIsOpen(true);
        setMessages([]);
      } catch (error) {
        console.error('Error parsing dropped data:', error);
      }
    }
  };

  const { getRootProps, isDragOver } = useDropzone({
    onDrop,
    noClick: true,
    accept: {
      'application/json': []
    }
  });

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const chatMessages = messages.concat(userMessage).map(msg => ({
        role: msg.isBot ? 'assistant' : 'user',
        content: msg.text
      }));

      const { data, error } = await supabase.functions.invoke('chat-with-patch', {
        body: {
          messages: chatMessages,
          articleContext
        }
      });

      if (error) throw error;

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Oops! My circuits are a bit glitchy right now. Try again in a moment! ⚡",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearArticleContext = () => {
    setArticleContext(null);
    setMessages([]);
  };

  return (
    <div {...getRootProps()} className="fixed bottom-4 right-4 z-50">
      {/* Drag indicator when hovering */}
      {isDragOver && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`absolute inset-0 rounded-full border-4 border-dashed ${
            theme === 'pixel' ? 'border-hn-accent' : 'border-lavender'
          } bg-black bg-opacity-20 flex items-center justify-center`}
        >
          <span className={`text-lg font-bold ${
            theme === 'pixel' ? 'text-hn-accent' : 'text-lavender'
          }`}>
            Drop Story Here!
          </span>
        </motion.div>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className={`absolute bottom-16 right-0 w-80 h-96 ${
              theme === 'pixel' 
                ? 'bg-hn-background border border-hn-border shadow-pixel' 
                : 'glassmorphic rounded-2xl'
            } flex flex-col overflow-hidden`}
            drag
            dragControls={dragControls}
            dragMomentum={false}
            onDrag={(event, info) => {
              setPosition({ x: info.offset.x, y: info.offset.y });
            }}
          >
            {/* Header */}
            <div className={`p-4 border-b ${
              theme === 'pixel' ? 'border-hn-border bg-hn-background' : 'border-white border-opacity-20 bg-white bg-opacity-10'
            } flex items-center justify-between cursor-move`}
            onPointerDown={(e) => dragControls.start(e)}>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  theme === 'pixel' ? 'bg-hn-accent animate-pulse' : 'bg-lavender animate-pulse'
                }`} />
                <span className={`font-bold ${
                  theme === 'pixel' ? 'text-hn-text font-pixel' : 'text-soft-text'
                }`}>
                  Patch {articleContext && '📰'}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className={theme === 'pixel' ? 'text-hn-text hover:text-hn-accent' : 'text-soft-text hover:text-lavender'}
              >
                <X size={16} />
              </Button>
            </div>

            {/* Article Context Banner */}
            {articleContext && (
              <div className={`p-2 text-xs ${
                theme === 'pixel' ? 'bg-hn-accent text-hn-background' : 'bg-lavender text-white'
              } flex items-center justify-between`}>
                <span className="truncate">📰 {articleContext.title}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearArticleContext}
                  className="h-4 w-4 p-0 hover:bg-white hover:bg-opacity-20"
                >
                  <X size={12} />
                </Button>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                      message.isBot
                        ? theme === 'pixel'
                          ? 'bg-hn-border text-hn-text'
                          : 'bg-white bg-opacity-20 text-soft-text backdrop-blur-sm'
                        : theme === 'pixel'
                          ? 'bg-hn-accent text-hn-background'
                          : 'bg-lavender text-white'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className={`px-3 py-2 rounded-lg ${
                    theme === 'pixel' ? 'bg-hn-border' : 'bg-white bg-opacity-20 backdrop-blur-sm'
                  }`}>
                    <Loader2 className={`w-4 h-4 animate-spin ${
                      theme === 'pixel' ? 'text-hn-accent animate-icon-glitch' : 'text-lavender'
                    }`} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={`p-3 border-t ${
              theme === 'pixel' ? 'border-hn-border' : 'border-white border-opacity-20'
            } flex space-x-2`}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Chat with Patch..."
                className={`flex-1 px-3 py-2 text-sm rounded-lg border ${
                  theme === 'pixel'
                    ? 'bg-hn-background border-hn-border text-hn-text placeholder-muted-foreground'
                    : 'bg-white bg-opacity-20 border-white border-opacity-30 text-soft-text placeholder-soft-text-secondary backdrop-blur-sm'
                } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                  theme === 'pixel' ? 'focus:ring-hn-accent' : 'focus:ring-lavender'
                }`}
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isLoading}
                size="sm"
                className={theme === 'pixel'
                  ? 'bg-hn-accent hover:bg-hn-accent/90 text-hn-background'
                  : 'bg-lavender hover:bg-lavender/90 text-white'
                }
              >
                <Send size={14} />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          theme === 'pixel'
            ? 'bg-hn-accent hover:bg-hn-accent/90 text-hn-background shadow-pixel-accent'
            : 'glassmorphic hover:bg-lavender hover:bg-opacity-20 text-lavender hover:text-white'
        } ${isDragOver ? 'scale-110' : 'scale-100'}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        drag
        dragMomentum={false}
        dragElastic={0.1}
      >
        <MessageCircle size={24} className={isLoading ? 'animate-pulse' : ''} />
        {articleContext && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-xs">📰</span>
          </div>
        )}
      </motion.button>
    </div>
  );
};

export default ChatbotWidget;
