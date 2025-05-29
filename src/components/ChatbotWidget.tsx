import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Zap, Eye } from 'lucide-react';
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
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDropping, setIsDropping] = useState(false);
  
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setIsDropping(true);
    
    const draggedData = e.dataTransfer?.getData('application/json');
    if (draggedData) {
      try {
        const story: HNStory = JSON.parse(draggedData);
        
        // Simulate absorption animation delay
        setTimeout(() => {
          setArticleContext({
            title: story.title,
            url: story.url
          });
          setIsOpen(true);
          setMessages([]);
          setIsDropping(false);
        }, 800);
      } catch (error) {
        console.error('Error parsing dropped data:', error);
        setIsDropping(false);
      }
    } else {
      setIsDropping(false);
    }
  };

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
    <div 
      className="fixed bottom-4 right-4 z-50"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Enhanced drag indicator with magnetism effect */}
      {isDragOver && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            scale: { duration: 1, repeat: Infinity },
            rotate: { duration: 2, repeat: Infinity }
          }}
          className={`absolute inset-0 rounded-full border-4 border-dashed ${
            theme === 'pixel' ? 'border-hn-accent' : 'border-lavender'
          } bg-black bg-opacity-20 flex items-center justify-center z-10`}
          style={{
            boxShadow: theme === 'pixel' 
              ? '0 0 30px #FF3C00, 0 0 60px rgba(255, 60, 0, 0.3)'
              : '0 0 30px #C5B4E3, 0 0 60px rgba(197, 180, 227, 0.3)'
          }}
        >
          <motion.span 
            className={`text-lg font-bold ${
              theme === 'pixel' ? 'text-hn-accent' : 'text-lavender'
            }`}
            animate={{ y: [-2, 2, -2] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            🧲 Drop Story Here!
          </motion.span>
        </motion.div>
      )}

      {/* Absorption animation */}
      {isDropping && (
        <motion.div
          initial={{ scale: 1, opacity: 1 }}
          animate={{ 
            scale: [1, 1.2, 0],
            opacity: [1, 0.8, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 rounded-full z-20 flex items-center justify-center"
          style={{
            background: theme === 'pixel' 
              ? 'radial-gradient(circle, #FF3C00 0%, transparent 70%)'
              : 'radial-gradient(circle, #C5B4E3 0%, transparent 70%)'
          }}
        >
          <Zap className={`w-8 h-8 ${
            theme === 'pixel' ? 'text-hn-accent' : 'text-lavender'
          }`} />
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
                <motion.div 
                  className={`w-3 h-3 rounded-full ${
                    theme === 'pixel' ? 'bg-hn-accent' : 'bg-lavender'
                  }`}
                  animate={{ 
                    scale: isDragOver ? [1, 1.5, 1] : 1,
                    opacity: isDragOver ? [1, 0.5, 1] : 1
                  }}
                  transition={{ duration: 0.5, repeat: isDragOver ? Infinity : 0 }}
                />
                <span className={`font-bold ${
                  theme === 'pixel' ? 'text-hn-text font-pixel' : 'text-soft-text'
                }`}>
                  Patch {articleContext && '📰'}
                  {isDragOver && (
                    <motion.span
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="ml-2"
                    >
                      <Eye className="inline w-4 h-4" />
                    </motion.span>
                  )}
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
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-2 text-xs ${
                  theme === 'pixel' ? 'bg-hn-accent text-hn-background' : 'bg-lavender text-white'
                } flex items-center justify-between`}
              >
                <span className="truncate">📰 {articleContext.title}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearArticleContext}
                  className="h-4 w-4 p-0 hover:bg-white hover:bg-opacity-20"
                >
                  <X size={12} />
                </Button>
              </motion.div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
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
                </motion.div>
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

      {/* Enhanced Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          theme === 'pixel'
            ? 'bg-hn-accent hover:bg-hn-accent/90 text-hn-background shadow-pixel-accent'
            : 'glassmorphic hover:bg-lavender hover:bg-opacity-20 text-lavender hover:text-white'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          scale: isDragOver ? [1, 1.15, 1] : 1,
          rotate: isDragOver ? [0, 10, -10, 0] : 0,
        }}
        transition={{
          scale: { duration: 0.5, repeat: isDragOver ? Infinity : 0 },
          rotate: { duration: 1, repeat: isDragOver ? Infinity : 0 }
        }}
        style={{
          boxShadow: isDragOver 
            ? theme === 'pixel'
              ? '0 0 25px #FF3C00, 0 0 50px rgba(255, 60, 0, 0.3)'
              : '0 0 25px #C5B4E3, 0 0 50px rgba(197, 180, 227, 0.3)'
            : undefined
        }}
        drag
        dragMomentum={false}
        dragElastic={0.1}
      >
        <MessageCircle size={24} className={isLoading ? 'animate-pulse' : ''} />
        {articleContext && (
          <motion.div 
            className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <span className="text-xs">📰</span>
          </motion.div>
        )}
        
        {/* Glowing ring when drag is active */}
        {isDragOver && (
          <motion.div
            className="absolute inset-0 rounded-full border-2"
            style={{
              borderColor: theme === 'pixel' ? '#FF3C00' : '#C5B4E3'
            }}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.7, 0.3, 0.7]
            }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </motion.button>
    </div>
  );
};

export default ChatbotWidget;
