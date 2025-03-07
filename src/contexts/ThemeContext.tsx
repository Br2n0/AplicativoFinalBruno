import React, { createContext, useContext, useState, useEffect } from 'react';
import { darkTheme, lightTheme, Theme } from '../styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeContextData {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const THEME_STORAGE_KEY = '@HomeHive:theme';

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

/**
 * Provedor de tema do aplicativo
 * 
 * Gerencia o tema atual (claro ou escuro) e fornece função para alternar entre eles
 * Persiste a preferência do usuário no AsyncStorage
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estado para controlar se está no modo escuro
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  // Define o tema com base no modo atual
  const theme = isDarkMode ? darkTheme : lightTheme;

  // Carrega a preferência de tema salva ao iniciar
  useEffect(() => {
    loadThemePreference();
  }, []);

  /**
   * Carrega a preferência de tema do AsyncStorage
   */
  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Erro ao carregar preferência de tema:', error);
    }
  };

  /**
   * Alterna entre os temas claro e escuro
   * Salva a preferência no AsyncStorage
   */
  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Erro ao salvar preferência de tema:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook para acessar o tema atual e funções relacionadas
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};