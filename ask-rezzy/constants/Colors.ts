// constants/Colors.ts

export const Colors = {
  primary: {
    blue: '#007AFF',
    lightBlue: '#E3F2FF',
    darkBlue: '#0056CC',
  },
  
  text: {
    primary: '#000000',
    secondary: '#666666',
    placeholder: '#999999',
    white: '#FFFFFF',
  },
  
  background: {
    primary: '#FFFFFF',
    secondary: '#F8F9FA',
    gray: '#F0F0F0',
    lightGray: '#F7F7F7',
  },
  
  quiz: {
    correct: '#34C759',
    incorrect: '#FF3B30',
    selected: '#007AFF',
    unselected: '#F0F0F0',
  },
  
  border: {
    light: '#E5E5E5',
    medium: '#D1D1D1',
    dark: '#999999',
  },
  
  shadow: {
    light: 'rgba(0, 0, 0, 0.1)',
    medium: 'rgba(0, 0, 0, 0.15)',
    dark: 'rgba(0, 0, 0, 0.25)',
  }
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
} as const;