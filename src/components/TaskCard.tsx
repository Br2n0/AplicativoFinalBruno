import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Task, Category } from '../types';
import { CategoryService } from '../services/CategoryService';
import { getStatusColor, getStatusText } from '../utils/statusUtils';
import { TaskService } from '../services/TaskService';

interface TaskCardProps {
  task: Task;
  onPress: (task: Task) => void;
  onStatusChange?: (task: Task) => void;
}

export const TaskCard = ({ task, onPress, onStatusChange }: TaskCardProps) => {
  const { theme } = useTheme();
  const [category, setCategory] = useState<Category | null>(null);
  const [currentTask, setCurrentTask] = useState<Task>(task);

  // Buscar categoria da tarefa
  useEffect(() => {
    const fetchCategory = async () => {
      if (currentTask.categoryId) {
        try {
          const categoryData = await CategoryService.getCategoryById(currentTask.categoryId);
          setCategory(categoryData);
        } catch (error) {
          console.error('Erro ao buscar categoria:', error);
        }
      }
    };

    fetchCategory();
  }, [currentTask.categoryId]);

  // Atualiza o estado local quando a tarefa muda
  useEffect(() => {
    setCurrentTask(task);
  }, [task]);

  // Função para formatar a data
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('pt-BR');
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return '';
    }
  };

  // Função para alternar o status da tarefa
  const toggleStatus = async () => {
    // Define o próximo status em um ciclo: pendente -> em andamento -> concluída -> pendente
    const nextStatus: Task['status'] = 
      currentTask.status === 'pending' ? 'in_progress' :
      currentTask.status === 'in_progress' ? 'completed' : 'pending';
    
    try {
      // Atualiza o status no banco de dados
      await TaskService.updateTask(currentTask.id, { status: nextStatus });
      
      // Atualiza o estado local
      const updatedTask = { ...currentTask, status: nextStatus };
      setCurrentTask(updatedTask);
      
      // Notifica o componente pai sobre a mudança
      if (onStatusChange) {
        onStatusChange(updatedTask);
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  return (
    <TouchableOpacity
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: theme.roundness.medium,
        padding: theme.spacing.md,
        marginVertical: theme.spacing.sm,
        marginHorizontal: theme.spacing.md,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      }}
      onPress={() => onPress(currentTask)}
    >
      <View style={styles.header}>
        <Text style={[
          styles.title,
          { color: theme.colors.text.primary }
        ]}>{currentTask.title}</Text>
        <TouchableOpacity
          style={[
            styles.status,
            { backgroundColor: getStatusColor(currentTask.status) }
          ]}
          onPress={toggleStatus}
          activeOpacity={0.7}
        >
          <Text style={styles.statusText}>
            {getStatusText(currentTask.status)}
          </Text>
        </TouchableOpacity>
      </View>

      {currentTask.description && (
        <Text style={[
          styles.description,
          { color: theme.colors.text.secondary }
        ]} numberOfLines={2}>
          {currentTask.description}
        </Text>
      )}

      <View style={styles.infoContainer}>
        {category && (
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={[
              styles.categoryText,
              { color: theme.colors.text.secondary }
            ]}>
              {category.name}
            </Text>
          </View>
        )}

        {currentTask.deadline && (
          <Text style={[
            styles.infoText,
            { color: theme.colors.text.secondary }
          ]}>
            Prazo: {formatDate(currentTask.deadline)}
          </Text>
        )}
      </View>

      {currentTask.assignedTo && (
        <Text style={[
          styles.assignedText,
          { color: theme.colors.text.secondary }
        ]}>
          Responsável: {currentTask.assignedTo}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  status: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
    // Adiciona uma borda sutil para indicar que é clicável
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  categoryText: {
    fontSize: 14,
  },
  infoText: {
    fontSize: 14,
  },
  assignedText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
});