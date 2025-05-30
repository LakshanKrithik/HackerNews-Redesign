
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import ChatbotWidget from './ChatbotWidget';
import Shelf from './Shelf';
import { useTheme } from '@/context/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme } = useTheme();
  
  return (
    <div className={`
      min-h-screen flex flex-col transition-colors duration-300
      ${theme === 'pixel' ? 'font-sans bg-hn-background' : 'font-poppins bg-soft-background'}
    `}>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
      <ChatbotWidget />
      <Shelf />
    </div>
  );
};

export default Layout;
