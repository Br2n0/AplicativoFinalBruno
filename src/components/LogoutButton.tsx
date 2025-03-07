import React from 'react';
import { TouchableOpacity, StyleSheet, Animated, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface LogoutButtonProps {
  size?: number;
  style?: object;
}

/**
 * Botão de logout com animação
 * 
 * Exibe um ícone de logout e confirma a ação antes de deslogar o usuário
 */
const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  size = 24, 
  style 
}) => {
  const { signOut } = useAuth();
  const { theme } = useTheme();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  // Anima o botão quando pressionado
  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();
  };

  // Confirma o logout antes de executar
  const handleLogout = () => {
    animateButton();
    
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair do aplicativo?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Sair',
          onPress: signOut,
          style: 'destructive'
        }
      ]
    );
  };

  return (
    <TouchableOpacity
      onPress={handleLogout}
      style={[styles.button, { backgroundColor: theme.colors.card }, style]}
      activeOpacity={0.7}
    >
      <Animated.View style={{
        transform: [{ scale: scaleAnim }]
      }}>
        <Ionicons name="log-out-outline" size={size} color={theme.colors.primary} />
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

export default LogoutButton;