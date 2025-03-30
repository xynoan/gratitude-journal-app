import { useColorScheme } from 'react-native';
import { useAppContext } from '../context/AppContext';

// Define our color palettes
const lightColors = {
  primary: '#4C956C',
  secondary: '#9EC1A3',
  accent: '#FF8C42',
  background: '#FAFAFA',
  surface: '#FFFFFF',
  text: '#333333',
  textSecondary: '#666666',
  border: '#DDDDDD',
  error: '#E53935',
  success: '#43A047',
  warning: '#FFA000',
};

const darkColors = {
  primary: '#4C956C',
  secondary: '#4E7B51',
  accent: '#FF8C42',
  background: '#121212',
  surface: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
  border: '#444444',
  error: '#E57373',
  success: '#81C784',
  warning: '#FFD54F',
};

// Font size configurations
const fontSizes = {
  small: {
    h1: 24,
    h2: 20,
    h3: 18,
    body: 14,
    caption: 12,
  },
  medium: {
    h1: 28,
    h2: 24,
    h3: 20,
    body: 16,
    caption: 14,
  },
  large: {
    h1: 32,
    h2: 28,
    h3: 24,
    body: 18,
    caption: 16,
  },
};

// Spacings
const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

// Border radius
const borderRadius = {
  small: 4,
  medium: 8,
  large: 16,
  round: 9999,
};

// Shadow styles
const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

// Animation durations
const animations = {
  fast: 200,
  normal: 300,
  slow: 500,
};

// Hook to use theme
export const useTheme = () => {
  const { theme, fontSize: fontSizeSetting } = useAppContext();
  const systemTheme = useColorScheme() || 'light';
  
  // Determine which color scheme to use
  const activeTheme = theme === 'system' ? systemTheme : theme;
  const colors = activeTheme === 'dark' ? darkColors : lightColors;
  
  return {
    colors,
    fonts: fontSizes[fontSizeSetting],
    spacing,
    borderRadius,
    shadows,
    animations,
  };
};

export type Theme = ReturnType<typeof useTheme>;

const themeUtils = {
  useTheme,
  lightColors,
  darkColors,
  fontSizes,
  spacing,
  borderRadius,
  shadows,
  animations,
};

export default themeUtils; 