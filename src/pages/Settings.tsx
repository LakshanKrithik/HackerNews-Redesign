
import React from 'react';
import Layout from '@/components/Layout';
import { useInterests, availableTopics } from '@/context/InterestsContext';
import { useTheme } from '@/context/ThemeContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Settings = () => {
  const { selectedTopics, setSelectedTopics } = useInterests();
  const { theme } = useTheme();

  const handleTopicToggle = (topicId: string) => {
    setSelectedTopics(
      selectedTopics.includes(topicId)
        ? selectedTopics.filter(id => id !== topicId)
        : [...selectedTopics, topicId]
    );
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        {theme === 'pixel' ? (
          <>
            <h1 className="font-pixel text-2xl sm:text-3xl text-hn-accent mb-6 text-center animate-flicker">
              Interest Settings
            </h1>
            <div className="bg-hn-background border border-hn-border shadow-pixel p-6">
              <p className="text-muted-foreground mb-4 font-pixel text-sm">
                Select topics you're interested in to see relevant stories ranked higher:
              </p>
              <div className="space-y-3">
                {availableTopics.map(topic => (
                  <label key={topic.id} className="flex items-center space-x-3 cursor-pointer">
                    <Checkbox
                      checked={selectedTopics.includes(topic.id)}
                      onCheckedChange={() => handleTopicToggle(topic.id)}
                      className="border-hn-border data-[state=checked]:bg-hn-accent data-[state=checked]:border-hn-accent"
                    />
                    <div>
                      <div className="text-hn-text font-pixel text-sm">{topic.name}</div>
                      <div className="text-muted-foreground text-xs">
                        {topic.keywords.slice(0, 4).join(', ')}...
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mb-8 text-center">
              <h1 className="font-poppins font-bold text-3xl sm:text-4xl bg-gradient-to-r from-lavender to-soft-accent bg-clip-text text-transparent mb-2">
                Interest Settings
              </h1>
              <p className="text-soft-text-secondary max-w-xl mx-auto">
                Customize your feed by selecting topics you're passionate about
              </p>
            </div>
            
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-soft-text">Choose Your Interests</CardTitle>
                <CardDescription>
                  Stories matching your selected topics will be ranked higher in your feed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {availableTopics.map(topic => (
                  <label key={topic.id} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-soft-background transition-colors">
                    <Checkbox
                      checked={selectedTopics.includes(topic.id)}
                      onCheckedChange={() => handleTopicToggle(topic.id)}
                      className="mt-1"
                    />
                    <div>
                      <div className="text-soft-text font-medium">{topic.name}</div>
                      <div className="text-soft-text-secondary text-sm mt-1">
                        Keywords: {topic.keywords.slice(0, 5).join(', ')}
                        {topic.keywords.length > 5 && '...'}
                      </div>
                    </div>
                  </label>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Settings;
