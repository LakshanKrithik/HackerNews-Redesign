
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Topic {
  id: string;
  name: string;
  keywords: string[];
}

export const availableTopics: Topic[] = [
  { id: 'ai', name: 'AI & Machine Learning', keywords: ['ai', 'artificial intelligence', 'machine learning', 'ml', 'neural', 'gpt', 'chatgpt', 'openai', 'llm', 'deep learning'] },
  { id: 'devops', name: 'DevOps & Infrastructure', keywords: ['devops', 'kubernetes', 'docker', 'aws', 'cloud', 'infrastructure', 'deployment', 'ci/cd', 'terraform', 'ansible'] },
  { id: 'climate', name: 'Climate Tech', keywords: ['climate', 'green tech', 'renewable', 'sustainability', 'carbon', 'solar', 'wind', 'electric', 'environment'] },
  { id: 'crypto', name: 'Crypto & Blockchain', keywords: ['crypto', 'blockchain', 'bitcoin', 'ethereum', 'defi', 'nft', 'web3', 'cryptocurrency'] },
  { id: 'frontend', name: 'Frontend Development', keywords: ['react', 'vue', 'angular', 'frontend', 'javascript', 'typescript', 'css', 'html', 'ui', 'ux'] },
  { id: 'backend', name: 'Backend Development', keywords: ['backend', 'api', 'database', 'server', 'node', 'python', 'go', 'rust', 'java', 'sql'] },
  { id: 'startup', name: 'Startups & Business', keywords: ['startup', 'entrepreneur', 'business', 'funding', 'vc', 'venture capital', 'ipo', 'growth'] },
  { id: 'security', name: 'Security & Privacy', keywords: ['security', 'privacy', 'cybersecurity', 'hacking', 'vulnerability', 'encryption', 'data protection'] }
];

interface InterestsContextType {
  selectedTopics: string[];
  setSelectedTopics: (topics: string[]) => void;
  scoreStory: (title: string, url?: string) => number;
}

const InterestsContext = createContext<InterestsContextType | undefined>(undefined);

export const InterestsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('hn-interests');
    if (saved) {
      setSelectedTopics(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('hn-interests', JSON.stringify(selectedTopics));
  }, [selectedTopics]);

  const scoreStory = (title: string, url?: string): number => {
    if (selectedTopics.length === 0) return 0;

    const text = `${title} ${url || ''}`.toLowerCase();
    let score = 0;

    selectedTopics.forEach(topicId => {
      const topic = availableTopics.find(t => t.id === topicId);
      if (topic) {
        topic.keywords.forEach(keyword => {
          if (text.includes(keyword.toLowerCase())) {
            score += 1;
          }
        });
      }
    });

    return score;
  };

  return (
    <InterestsContext.Provider value={{ selectedTopics, setSelectedTopics, scoreStory }}>
      {children}
    </InterestsContext.Provider>
  );
};

export const useInterests = () => {
  const context = useContext(InterestsContext);
  if (context === undefined) {
    throw new Error('useInterests must be used within an InterestsProvider');
  }
  return context;
};
