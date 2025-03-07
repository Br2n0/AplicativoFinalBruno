import React from 'react';
import { TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeToggleButtonProps {
  size?: number;
  style?: object;
}

/**
 * Botão para alternar entre os temas claro e escuro
 * 
 * Exibe um ícone de sol ou lua dependendo do tema atual
 * e anima a transição entre os temas
 */
const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({ 
  size = 24, 
  style 
}) => {
  const { isDarkMode, toggleTheme, theme } = useTheme();
  const rotateAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  // Anima o botão quando o tema é alterado
  const animateButton = () => {
    // Reseta a animação de rotação
    rotateAnim.setValue(0);
    
    // Anima a escala (efeito de pressionar)
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic)
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.elastic(1.5)
      })
    ]).start();
    
    // Anima a rotação
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 450,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic)
    }).start();
    
    // Alterna o tema
    toggleTheme();
  };

  // Mapeia o valor da animação para a rotação em graus
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <TouchableOpacity
      onPress={animateButton}
      style={[styles.button, { backgroundColor: theme.colors.card }, style]}
      activeOpacity={0.7}
    >
      <Animated.View style={{
        transform: [{ rotate: spin }, { scale: scaleAnim }]
      }}>
        {isDarkMode ? (
          <Ionicons name="sunny" size={size} color={theme.colors.primary} />
        ) : (
          <Ionicons name="moon" size={size} color={theme.colors.primary} />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
});

export default ThemeToggleButton;