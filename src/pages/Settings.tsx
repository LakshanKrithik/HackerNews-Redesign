
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useInterests, availableTopics } from '@/context/InterestsContext';
import { useTheme } from '@/context/ThemeContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Settings = () => {
  const { selectedTopics, setSelectedTopics } = useInterests();
  const { theme } = useTheme();
  const [tempSelectedTopics, setTempSelectedTopics] = useState<string[]>(selectedTopics);

  const handleTopicToggle = (topicId: string) => {
    setTempSelectedTopics(
      tempSelectedTopics.includes(topicId)
        ? tempSelectedTopics.filter(id => id !== topicId)
        : [...tempSelectedTopics, topicId]
    );
  };

  const handleApply = () => {
    setSelectedTopics(tempSelectedTopics);
  };

  const hasChanges = JSON.stringify(tempSelectedTopics.sort()) !== JSON.stringify(selectedTopics.sort());

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        {theme === 'pixel' ? (
          <>
            <h1 className="font-pixel text-2xl sm:text-3xl text-hn-accent mb-6 text-center animate-flicker">
              Tune My Feed
            </h1>
            <div className="bg-hn-background border border-hn-border shadow-pixel p-6">
              <p className="text-muted-foreground mb-4 font-pixel text-sm">
                Select topics you're interested in to see relevant stories ranked higher:
              </p>
              <div className="space-y-3">
                {availableTopics.map(topic => (
                  <label key={topic.id} className="flex items-center space-x-3 cursor-pointer">
                    <Checkbox
                      checked={tempSelectedTopics.includes(topic.id)}
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
              <div className="mt-6 text-center">
                <Button
                  onClick={handleApply}
                  disabled={!hasChanges}
                  className="bg-hn-accent hover:bg-hn-accent/90 text-white font-pixel text-sm px-6 py-2 border border-hn-border shadow-pixel disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply Settings
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mb-8 text-center">
              <h1 className="font-poppins font-bold text-3xl sm:text-4xl bg-gradient-to-r from-lavender to-soft-accent bg-clip-text text-transparent mb-2">
                Tune My Feed
              </h1>
              <p className="text-soft-text-secondary max-w-xl mx-auto">
                Customize your feed by selecting topics you're passionate about
              </p>
            </div>
            
            <Card className="shadow-soft bg-white border-soft-border">
              <CardHeader className="bg-white">
                <CardTitle className="text-soft-text">Choose Your Interests</CardTitle>
                <CardDescription className="text-soft-text-secondary">
                  Stories matching your selected topics will be ranked higher in your feed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 bg-white">
                {availableTopics.map(topic => (
                  <label key={topic.id} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Checkbox
                      checked={tempSelectedTopics.includes(topic.id)}
                      onCheckedChange={() => handleTopicToggle(topic.id)}
                      className="mt-1 border-soft-border data-[state=checked]:bg-soft-accent data-[state=checked]:border-soft-accent"
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
                <div className="pt-4 text-center">
                  <Button
                    onClick={handleApply}
                    disabled={!hasChanges}
                    className="bg-soft-accent hover:bg-soft-accent/90 text-white px-8 py-2 rounded-lg shadow-soft disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Apply Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Settings;
