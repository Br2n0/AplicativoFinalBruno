import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onPress: (task: Task) => void;
  onToggleComplete: (task: Task) => void;
}

/**
 * Cartão de tarefa
 * 
 * Exibe os detalhes de uma tarefa e permite marcar como concluída
 */
const TaskCard: React.FC<TaskCardProps> = ({ task, onPress, onToggleComplete }) => {
  const { theme } = useTheme();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  
  // Anima o cartão quando pressionado
  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start();
    
    onPress(task);
  };

  // Retorna o ícone correspondente à categoria da tarefa
  const getCategoryIcon = () => {
    switch (task.category) {
      case 'limpeza':
        return 'brush';
      case 'cozinha':
        return 'restaurant';
      case 'compras':
        return 'cart';
      case 'lavanderia':
        return 'shirt';
      case 'manutenção':
        return 'construct';
      case 'outros':
      default:
        return 'list';
    }
  };

  // Retorna a cor correspondente à categoria da tarefa
  const getCategoryColor = () => {
    switch (task.category) {
      case 'limpeza':
        return '#4CAF50'; // Verde
      case 'cozinha':
        return '#FF9800'; // Laranja
      case 'compras':
        return '#2196F3'; // Azul
      case 'lavanderia':
        return '#9C27B0'; // Roxo
      case 'manutenção':
        return '#F44336'; // Vermelho
      case 'outros':
      default:
        return '#607D8B'; // Cinza azulado
    }
  };

  return (
    <Animated.View style={{
      transform: [{ scale: scaleAnim }]
    }}>
      <TouchableOpacity
        style={[styles.container, { backgroundColor: theme.colors.card }]}
        onPress={animatePress}
        activeOpacity={0.7}
      >
        <View style={styles.content}>
          <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor() }]}>
            <Ionicons name={getCategoryIcon()} size={20} color="#FFF" />
          </View>
          
          <View style={styles.textContainer}>
            <Text 
              style={[styles.title, { 
                color: theme.colors.text,
                textDecorationLine: task.completed ? 'line-through' : 'none',
                opacity: task.completed ? 0.7 : 1
              }]}
              numberOfLines={1}
            >
              {task.title}
            </Text>
            
            {task.description ? (
              <Text 
                style={[styles.description, { color: theme.colors.text, opacity: 0.7 }]}
                numberOfLines={1}
              >
                {task.description}
              </Text>
            ) : null}
          </View>
          
          <TouchableOpacity 
            style={styles.checkbox} 
            onPress={() => onToggleComplete(task)}
          >
            <Ionicons 
              name={task.completed ? 'checkmark-circle' : 'ellipse-outline'} 
              size={24} 
              color={task.completed ? theme.colors.primary : theme.colors.text} 
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
  },
  checkbox: {
    padding: 4,
  },
});

export default TaskCard;