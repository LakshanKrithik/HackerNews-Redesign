
export interface HNStory {
  id: number;
  title: string;
  by: string;
  time: number;
  score: number;
  url?: string;
  descendants?: number; // Number of comments
  kids?: number[]; // Comment IDs
  type: 'story' | 'comment' | 'job';
}

export interface HNItem extends HNStory {
  // Comments might have 'text' and 'parent'
  text?: string;
  parent?: number;
}
