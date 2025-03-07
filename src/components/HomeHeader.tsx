import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggleButton from './ThemeToggleButton';
import LogoutButton from './LogoutButton';

interface HomeHeaderProps {
  title?: string;
}

/**
 * Cabeçalho da tela principal
 * 
 * Exibe o logo do aplicativo, nome do usuário, botão de tema e botão de logout
 */
const HomeHeader: React.FC<HomeHeaderProps> = ({ title = 'HomeHive' }) => {
  const { theme } = useTheme();
  const { user } = useAuth();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      <View style={styles.leftSection}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/logo.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />
        </View>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.colors.primary }]}>
            {title}
          </Text>
          {user && (
            <Text style={[styles.subtitle, { color: theme.colors.text }]}>
              Olá, {user.name.split(' ')[0]}
            </Text>
          )}
        </View>
      </View>
      
      <View style={styles.rightSection}>
        <ThemeToggleButton style={styles.themeButton} />
        <LogoutButton style={styles.logoutButton} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    marginRight: 12,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  titleContainer: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeButton: {
    marginRight: 12,
  },
  logoutButton: {
    // Sem estilos adicionais necessários
  },
});

export default HomeHeader;