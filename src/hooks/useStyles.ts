import { StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Hook personalizado para criar estilos com base no tema atual
 * 
 * Permite criar estilos que se adaptam automaticamente ao tema claro/escuro
 */
export const useStyles = () => {
  const { theme } = useTheme();

  // Estilos comuns para telas
  const screenStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      padding: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text.primary,
      marginBottom: 16,
    },
    subtitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text.primary,
      marginBottom: 8,
    },
  });

  // Estilos comuns para formulários
  const formStyles = StyleSheet.create({
    inputContainer: {
      marginBottom: 16,
    },
    label: {
      fontSize: 16,
      marginBottom: 8,
      color: theme.colors.text.primary,
    },
    button: {
      backgroundColor: theme.colors.primary,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 16,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  return { screenStyles, formStyles };
};