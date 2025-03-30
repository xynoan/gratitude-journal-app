export interface GratitudeEntry {
  id: string;
  date: string;
  entries: string[];
  photos: string[];
  mood?: string;
  tags?: string[];
  notes?: string;
}

export interface UserStats {
  streak: number;
  totalEntries: number;
  lastEntryDate: string | null;
  startDate: string;
}

export type MoodType = 'happy' | 'content' | 'neutral' | 'sad' | 'stressed';

export interface Prompt {
  id: string;
  text: string;
  category?: string;
}

export const DEFAULT_PROMPTS: Prompt[] = [
  { id: '1', text: 'What made you smile today?', category: 'daily' },
  { id: '2', text: 'Who are you grateful for today?', category: 'people' },
  { id: '3', text: 'What personal strength are you thankful for?', category: 'self' },
  { id: '4', text: 'What challenge did you overcome today?', category: 'growth' },
  { id: '5', text: 'What small joy brightened your day?', category: 'daily' },
  { id: '6', text: 'What about your health are you grateful for?', category: 'health' },
  { id: '7', text: 'What opportunity are you thankful for?', category: 'opportunity' },
  { id: '8', text: 'What in nature brought you joy today?', category: 'nature' },
  { id: '9', text: 'What made you laugh today?', category: 'joy' },
  { id: '10', text: 'What simple pleasure did you enjoy today?', category: 'pleasure' },
];

export const DEFAULT_TAGS = [
  'Family',
  'Friends',
  'Work',
  'Health',
  'Nature',
  'Learning',
  'Accomplishment',
  'Self-care',
  'Relationship',
  'Home',
  'Food',
  'Surprise',
  'Memories',
];

const typesExport = {
  DEFAULT_PROMPTS,
  DEFAULT_TAGS,
};

export default typesExport; 