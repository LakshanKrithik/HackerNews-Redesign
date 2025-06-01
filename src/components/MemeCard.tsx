
import React, { useState } from 'react';
import { HNStory } from '@/types';
import { Heart, Share2, Bookmark, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useShelf } from '@/context/ShelfContext';

interface MemeCardProps {
  story: HNStory;
  index: number;
}

const MemeCard: React.FC<MemeCardProps> = ({ story, index }) => {
  const { addToShelf, removeFromShelf, isInShelf } = useShelf();
  const [reactions, setReactions] = useState({ laugh: 0, relate: 0, cringe: 0 });
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const isBookmarked = isInShelf(story.id);

  // Meme templates - in a real app, these would be fetched from an API
  const memeTemplates = [
    'https://i.imgflip.com/1bij.jpg', // Distracted Boyfriend
    'https://i.imgflip.com/4t0m5.jpg', // Drake Pointing
    'https://i.imgflip.com/30b1gx.jpg', // This is Fine
    'https://i.imgflip.com/1ur9b0.jpg', // Surprised Pikachu
    'https://i.imgflip.com/26am.jpg', // Expanding Brain
  ];

  const getMemeTemplate = () => {
    return memeTemplates[index % memeTemplates.length];
  };

  const generateMemeCaption = (title: string) => {
    const captions = [
      `When ${title.toLowerCase().slice(0, 50)}... 💀`,
      `POV: You're reading "${title.slice(0, 40)}..." 🤯`,
      `Me explaining ${title.slice(0, 30)}... to my non-tech friends 😅`,
      `${title.slice(0, 40)}... hits different when you're a dev 🔥`,
      `This but make it ${title.includes('AI') ? 'AI' : 'tech'} 💻`,
    ];
    return captions[index % captions.length];
  };

  const handleReaction = (type: string) => {
    if (userReaction === type) {
      setUserReaction(null);
      setReactions(prev => ({ ...prev, [type]: prev[type] - 1 }));
    } else {
      if (userReaction) {
        setReactions(prev => ({ ...prev, [userReaction]: prev[userReaction] - 1 }));
      }
      setUserReaction(type);
      setReactions(prev => ({ ...prev, [type]: prev[type] + 1 }));
    }
  };

  const handleBookmark = () => {
    if (isBookmarked) {
      removeFromShelf(story.id);
    } else {
      addToShelf(story);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, rotate: Math.random() * 4 - 2 }}
      className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-purple-100"
    >
      <div className="flex gap-6">
        {/* Meme Image */}
        <div className="flex-shrink-0">
          <motion.img
            src={getMemeTemplate()}
            alt="Meme template"
            className="w-32 h-32 object-cover rounded-2xl border-4 border-yellow-200"
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-poppins font-bold text-lg text-purple-800 leading-tight">
              {story.title}
            </h3>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleBookmark}
              className={`p-2 rounded-full transition-colors ${
                isBookmarked ? 'text-red-500 bg-red-100' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
              }`}
            >
              <Heart size={18} className={isBookmarked ? 'fill-current' : ''} />
            </motion.button>
          </div>

          {/* Meme Caption */}
          <div className="bg-yellow-100 rounded-2xl p-3 mb-4 border-2 border-yellow-200">
            <p className="font-poppins text-purple-700 font-medium">
              {generateMemeCaption(story.title)}
            </p>
          </div>

          {/* Reaction Bar */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {[
                { type: 'laugh', emoji: '😂', label: 'Laugh' },
                { type: 'relate', emoji: '🤓', label: 'Relate' },
                { type: 'cringe', emoji: '😬', label: 'Cringe' }
              ].map((reaction) => (
                <motion.button
                  key={reaction.type}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleReaction(reaction.type)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-full border-2 transition-all ${
                    userReaction === reaction.type
                      ? 'bg-purple-100 border-purple-300 text-purple-700'
                      : 'bg-white border-gray-200 hover:border-purple-200 text-gray-600'
                  }`}
                >
                  <span>{reaction.emoji}</span>
                  <span className="text-xs font-medium">{reactions[reaction.type]}</span>
                </motion.button>
              ))}
            </div>

            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded-full border-2 border-blue-200 text-blue-700 transition-colors"
              >
                <MessageCircle size={14} />
                <span className="text-xs font-medium">{story.descendants || 0}</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-green-100 hover:bg-green-200 rounded-full border-2 border-green-200 text-green-700 transition-colors"
              >
                <Share2 size={14} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MemeCard;
