import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

// Define the types for our context
type Theme = 'light' | 'dark' | 'system';
type FontSize = 'small' | 'medium' | 'large';

interface AppContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  isBiometricEnabled: boolean;
  toggleBiometric: () => void;
  isAuthenticated: boolean;
  authenticate: () => Promise<boolean>;
  streak: number;
  incrementStreak: () => void;
  resetStreak: () => void;
  lastEntryDate: string | null;
  updateLastEntryDate: (date: string) => void;
}

// Create the context with default values
const AppContext = createContext<AppContextType>({
  theme: 'system',
  setTheme: () => {},
  fontSize: 'medium',
  setFontSize: () => {},
  isBiometricEnabled: false,
  toggleBiometric: () => {},
  isAuthenticated: false,
  authenticate: async () => false,
  streak: 0,
  incrementStreak: () => {},
  resetStreak: () => {},
  lastEntryDate: null,
  updateLastEntryDate: () => {},
});

// Custom hook to use the AppContext
export const useAppContext = () => useContext(AppContext);

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('system');
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [streak, setStreak] = useState(0);
  const [lastEntryDate, setLastEntryDate] = useState<string | null>(null);

  // Load saved settings on app start
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) setTheme(savedTheme as Theme);
        
        const savedFontSize = await AsyncStorage.getItem('fontSize');
        if (savedFontSize) setFontSize(savedFontSize as FontSize);
        
        const savedBiometricEnabled = await AsyncStorage.getItem('biometricEnabled');
        if (savedBiometricEnabled) setIsBiometricEnabled(savedBiometricEnabled === 'true');
        
        const savedStreak = await AsyncStorage.getItem('streak');
        if (savedStreak) setStreak(parseInt(savedStreak, 10));
        
        const savedLastEntryDate = await AsyncStorage.getItem('lastEntryDate');
        if (savedLastEntryDate) setLastEntryDate(savedLastEntryDate);
        
        // If biometrics are enabled, authenticate on app start
        if (savedBiometricEnabled === 'true') {
          authenticate();
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    
    loadSettings();
  }, []);

  // Save settings when they change
  useEffect(() => {
    const saveSettings = async () => {
      try {
        await AsyncStorage.setItem('theme', theme);
        await AsyncStorage.setItem('fontSize', fontSize);
        await AsyncStorage.setItem('biometricEnabled', isBiometricEnabled.toString());
        await AsyncStorage.setItem('streak', streak.toString());
        if (lastEntryDate) {
          await AsyncStorage.setItem('lastEntryDate', lastEntryDate);
        }
      } catch (error) {
        console.error('Error saving settings:', error);
      }
    };
    
    saveSettings();
  }, [theme, fontSize, isBiometricEnabled, streak, lastEntryDate]);

  const toggleBiometric = () => {
    setIsBiometricEnabled(prev => !prev);
  };

  const authenticate = async (): Promise<boolean> => {
    if (!isBiometricEnabled) {
      setIsAuthenticated(true);
      return true;
    }
    
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        setIsAuthenticated(true);
        return true;
      }
      
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        setIsAuthenticated(true);
        return true;
      }
      
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access your Gratitude Journal',
        fallbackLabel: 'Use passcode',
      });
      
      setIsAuthenticated(result.success);
      return result.success;
    } catch (error) {
      console.error('Authentication error:', error);
      return false;
    }
  };

  const incrementStreak = () => {
    setStreak(prev => prev + 1);
  };

  const resetStreak = () => {
    setStreak(0);
  };

  const updateLastEntryDate = (date: string) => {
    setLastEntryDate(date);
  };

  return (
    <AppContext.Provider value={{
      theme,
      setTheme,
      fontSize,
      setFontSize,
      isBiometricEnabled,
      toggleBiometric,
      isAuthenticated,
      authenticate,
      streak,
      incrementStreak,
      resetStreak,
      lastEntryDate,
      updateLastEntryDate,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext; 