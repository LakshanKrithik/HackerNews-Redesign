
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import ChatbotWidget from './ChatbotWidget';
import Shelf from './Shelf';
import CreateMemeButton from './CreateMemeButton';
import { useTheme } from '@/context/ThemeContext';
import { useMemeMode } from '@/context/MemeModeContext';

interface LayoutProps {
  children: React.ReactNode;
  onMemeCreated?: (meme: any) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onMemeCreated }) => {
  const { theme } = useTheme();
  const { isMemeMode } = useMemeMode();
  
  return (
    <div className={`
      min-h-screen flex flex-col transition-colors duration-300
      ${isMemeMode 
        ? 'font-poppins bg-gradient-to-br from-blue-50 via-purple-50 to-yellow-50' 
        : theme === 'pixel' ? 'font-sans bg-hn-background' : 'font-poppins bg-soft-background'}
    `}>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
      {!isMemeMode && <ChatbotWidget />}
      {isMemeMode && <CreateMemeButton onMemeCreated={onMemeCreated} />}
      <Shelf />
    </div>
  );
};

export default Layout;
