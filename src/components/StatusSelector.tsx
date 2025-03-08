import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Task } from '../types';
import { getStatusColor, getStatusText } from '../utils/statusUtils';
import { useTheme } from '../contexts/ThemeContext';

interface StatusSelectorProps {
  currentStatus: Task['status'];
  onStatusChange: (status: Task['status']) => void;
}

/**
 * Componente para seleção de status das tarefas
 * 
 * Exibe três botões lado a lado representando os três status possíveis
 * Cada botão tem uma cor distinta e o status atual é destacado
 */
export const StatusSelector: React.FC<StatusSelectorProps> = ({
  currentStatus,
  onStatusChange
}) => {
  const { theme } = useTheme();
  const statuses: Task['status'][] = ['pending', 'in_progress', 'completed'];

  return (
    <View style={styles.container}>
      {statuses.map(status => (
        <TouchableOpacity
          key={status}
          style={[
            styles.statusButton,
            { 
              backgroundColor: getStatusColor(status),
              opacity: currentStatus === status ? 1 : 0.6,
              borderWidth: currentStatus === status ? 2 : 0,
              borderColor: theme.colors.background
            }
          ]}
          onPress={() => onStatusChange(status)}
          activeOpacity={0.8}
        >
          <Text style={styles.statusText}>
            {getStatusText(status)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});