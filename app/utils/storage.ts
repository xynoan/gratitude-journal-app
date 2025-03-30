import AsyncStorage from '@react-native-async-storage/async-storage';
import { GratitudeEntry, UserStats } from './types';
import { format } from 'date-fns';

const ENTRIES_KEY = 'gratitude_entries';
const STATS_KEY = 'user_stats';

// Save a new gratitude entry
export const saveEntry = async (entry: GratitudeEntry): Promise<boolean> => {
  try {
    // Get existing entries
    const existingEntries = await getEntries();
    
    // Check if an entry for today already exists
    const todayDate = format(new Date(), 'yyyy-MM-dd');
    const existingIndex = existingEntries.findIndex(e => e.date === todayDate);
    
    let updatedEntries: GratitudeEntry[];
    
    if (existingIndex >= 0) {
      // Update existing entry
      updatedEntries = [...existingEntries];
      updatedEntries[existingIndex] = entry;
    } else {
      // Add new entry
      updatedEntries = [...existingEntries, entry];
      
      // Update streak
      await updateStreak(true);
    }
    
    // Save updated entries
    await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(updatedEntries));
    
    // Update last entry date in stats
    await updateLastEntryDate(entry.date);
    
    return true;
  } catch (error) {
    console.error('Error saving entry:', error);
    return false;
  }
};

// Get all entries
export const getEntries = async (): Promise<GratitudeEntry[]> => {
  try {
    const entriesJson = await AsyncStorage.getItem(ENTRIES_KEY);
    return entriesJson ? JSON.parse(entriesJson) : [];
  } catch (error) {
    console.error('Error getting entries:', error);
    return [];
  }
};

// Get entry for a specific date
export const getEntryByDate = async (date: string): Promise<GratitudeEntry | null> => {
  try {
    const entries = await getEntries();
    return entries.find(entry => entry.date === date) || null;
  } catch (error) {
    console.error('Error getting entry by date:', error);
    return null;
  }
};

// Delete an entry
export const deleteEntry = async (id: string): Promise<boolean> => {
  try {
    const entries = await getEntries();
    const updatedEntries = entries.filter(entry => entry.id !== id);
    await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(updatedEntries));
    
    // Update stats
    const stats = await getStats();
    stats.totalEntries = updatedEntries.length;
    await AsyncStorage.setItem(STATS_KEY, JSON.stringify(stats));
    
    return true;
  } catch (error) {
    console.error('Error deleting entry:', error);
    return false;
  }
};

// Initialize or get user stats
export const getStats = async (): Promise<UserStats> => {
  try {
    const statsJson = await AsyncStorage.getItem(STATS_KEY);
    if (statsJson) {
      return JSON.parse(statsJson);
    } else {
      // Initialize stats if they don't exist
      const initialStats: UserStats = {
        streak: 0,
        totalEntries: 0,
        lastEntryDate: null,
        startDate: format(new Date(), 'yyyy-MM-dd'),
      };
      await AsyncStorage.setItem(STATS_KEY, JSON.stringify(initialStats));
      return initialStats;
    }
  } catch (error) {
    console.error('Error getting stats:', error);
    return {
      streak: 0,
      totalEntries: 0,
      lastEntryDate: null,
      startDate: format(new Date(), 'yyyy-MM-dd'),
    };
  }
};

// Update streak based on current date and last entry date
export const updateStreak = async (isNewEntry: boolean = false): Promise<number> => {
  try {
    const stats = await getStats();
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    
    // If we're adding a new entry
    if (isNewEntry) {
      // If this is the first entry ever or there's no last entry date
      if (!stats.lastEntryDate) {
        stats.streak = 1;
      } else {
        const lastEntryDate = new Date(stats.lastEntryDate);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const isYesterday = format(lastEntryDate, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd');
        const isToday = format(lastEntryDate, 'yyyy-MM-dd') === todayStr;
        
        if (isToday) {
          // Already logged today, streak stays the same
        } else if (isYesterday) {
          // Logged yesterday, increment streak
          stats.streak += 1;
        } else {
          // Missed a day, reset streak to 1
          stats.streak = 1;
        }
      }
      
      stats.totalEntries += 1;
    } else {
      // Just checking if streak should be reset
      if (stats.lastEntryDate) {
        const lastEntryDate = new Date(stats.lastEntryDate);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const daysSinceLastEntry = Math.floor(
          (today.getTime() - lastEntryDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        // If more than one day has passed since the last entry, reset streak
        if (daysSinceLastEntry > 1) {
          stats.streak = 0;
        }
      }
    }
    
    // Save updated stats
    await AsyncStorage.setItem(STATS_KEY, JSON.stringify(stats));
    
    return stats.streak;
  } catch (error) {
    console.error('Error updating streak:', error);
    return 0;
  }
};

// Update the last entry date in stats
export const updateLastEntryDate = async (date: string): Promise<void> => {
  try {
    const stats = await getStats();
    stats.lastEntryDate = date;
    await AsyncStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Error updating last entry date:', error);
  }
};

const storageUtils = {
  saveEntry,
  getEntries,
  getEntryByDate,
  deleteEntry,
  getStats,
  updateStreak,
  updateLastEntryDate,
};

export default storageUtils; 