
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="flex items-center space-x-2">
      <Moon 
        size={16} 
        className={`transition-colors ${theme === 'pixel' ? 'text-hn-text' : 'text-slate-400'}`} 
      />
      <Switch 
        checked={theme === 'soft'} 
        onCheckedChange={toggleTheme} 
        className={`${theme === 'pixel' ? 'data-[state=checked]:bg-hn-accent border-hn-border' : 'data-[state=checked]:bg-lavender border-slate-200'}`}
      />
      <Sun 
        size={16} 
        className={`transition-colors ${theme === 'soft' ? 'text-amber-500' : 'text-slate-400'}`} 
      />
    </div>
  );
};

export default ThemeToggle;
