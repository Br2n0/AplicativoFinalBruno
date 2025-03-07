import React from 'react';
import { StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface FABProps {
  onPress: () => void;
  icon: string;
}

export const FloatingActionButton = ({ onPress, icon }: FABProps) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.fab,
        { backgroundColor: theme.colors.primary }
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[
        styles.fabIcon,
        { color: '#000000' } // Mantemos preto para contraste com o roxo
      ]}>
        {icon}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    // No Android, usamos elevation
    ...Platform.select({
      android: {
        elevation: 4,
      },
      // No iOS, usamos shadow
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
    }),
  },
  fabIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});