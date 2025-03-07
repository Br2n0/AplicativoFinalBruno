// Tema escuro do aplicativo
export const darkTheme = {
  colors: {
    background: '#121212',
    surface: '#1E1E1E',
    primary: '#BB86FC',
    secondary: '#03DAC6',
    accent: '#CF6679',
    error: '#CF6679',
    text: {
      primary: '#FFFFFF',
      secondary: '#B3B3B3',
      disabled: '#666666',
    },
    border: '#2D2D2D',
    success: '#4CAF50',
    warning: '#FF9800',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  roundness: {
    small: 4,
    medium: 8,
    large: 16,
  }
};

// Tema claro do aplicativo
export const lightTheme = {
  colors: {
    background: '#F5F5F5',
    surface: '#FFFFFF',
    primary: '#6200EE',
    secondary: '#03DAC6',
    accent: '#CF6679',
    error: '#B00020',
    text: {
      primary: '#000000',
      secondary: '#555555',
      disabled: '#999999',
    },
    border: '#E0E0E0',
    success: '#4CAF50',
    warning: '#FF9800',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  roundness: {
    small: 4,
    medium: 8,
    large: 16,
  }
};

export type Theme = typeof darkTheme;