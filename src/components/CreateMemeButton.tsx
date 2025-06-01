
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Upload, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const CreateMemeButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');

  const memeTemplates = [
    { id: 1, name: 'Distracted Boyfriend', url: 'https://i.imgflip.com/1bij.jpg' },
    { id: 2, name: 'Drake Pointing', url: 'https://i.imgflip.com/4t0m5.jpg' },
    { id: 3, name: 'This is Fine', url: 'https://i.imgflip.com/30b1gx.jpg' },
    { id: 4, name: 'Surprised Pikachu', url: 'https://i.imgflip.com/1ur9b0.jpg' },
  ];

  const generateAISuggestion = () => {
    const suggestions = [
      { top: "WHEN YOU SEE A NEW JS FRAMEWORK", bottom: "BUT YOU'RE STILL LEARNING REACT" },
      { top: "DEBUGGING FOR 3 HOURS", bottom: "IT WAS A MISSING SEMICOLON" },
      { top: "PRODUCTION IS DOWN", bottom: "BUT THE TESTS PASS LOCALLY" },
      { top: "SENIOR DEV SAYS 'JUST A QUICK FIX'", bottom: "REFACTORS ENTIRE CODEBASE" },
    ];
    const suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    setTopText(suggestion.top);
    setBottomText(suggestion.bottom);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ 
          repeat: Infinity, 
          duration: 2,
          ease: "easeInOut"
        }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-white z-50 border-4 border-white"
      >
        <Plus size={24} className="animate-pulse" />
      </motion.button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl bg-gradient-to-br from-purple-50 to-pink-50 border-4 border-purple-200">
          <DialogHeader>
            <DialogTitle className="font-poppins text-2xl text-purple-800 flex items-center space-x-2">
              <span>🎨</span>
              <span>Create Your Meme</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Template Selection */}
            <div>
              <h3 className="font-poppins font-semibold text-purple-700 mb-3">Choose a Template</h3>
              <div className="grid grid-cols-2 gap-3">
                {memeTemplates.map((template) => (
                  <motion.div
                    key={template.id}
                    whileHover={{ scale: 1.05 }}
                    className="relative cursor-pointer rounded-2xl overflow-hidden border-4 border-purple-200 hover:border-purple-400"
                  >
                    <img 
                      src={template.url} 
                      alt={template.name}
                      className="w-full h-24 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-purple-600 bg-opacity-90 text-white text-xs font-medium p-2">
                      {template.name}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Text Inputs */}
            <div className="space-y-4">
              <div>
                <label className="font-poppins font-semibold text-purple-700 block mb-2">
                  Top Text
                </label>
                <Input
                  value={topText}
                  onChange={(e) => setTopText(e.target.value)}
                  placeholder="WHEN YOU..."
                  className="rounded-2xl border-2 border-purple-200 font-bold text-center uppercase"
                />
              </div>
              <div>
                <label className="font-poppins font-semibold text-purple-700 block mb-2">
                  Bottom Text
                </label>
                <Input
                  value={bottomText}
                  onChange={(e) => setBottomText(e.target.value)}
                  placeholder="...BUT THEN..."
                  className="rounded-2xl border-2 border-purple-200 font-bold text-center uppercase"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                onClick={generateAISuggestion}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-2xl font-poppins font-semibold py-3"
              >
                <Zap size={18} className="mr-2" />
                AI Suggest 🤖
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-2 border-purple-300 text-purple-700 hover:bg-purple-100 rounded-2xl font-poppins font-semibold py-3"
              >
                <Upload size={18} className="mr-2" />
                Upload Image
              </Button>
            </div>

            <Button
              onClick={() => setIsOpen(false)}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-2xl font-poppins font-bold py-4 text-lg"
            >
              Create Meme! 🎉
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateMemeButton;
