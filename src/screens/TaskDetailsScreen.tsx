import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { TaskService } from '../services/TaskService';
import { CategoryService } from '../services/CategoryService';
import { useTheme } from '../contexts/ThemeContext';
import { Task, Category } from '../types';

export const TaskDetailsScreen = ({ route, navigation }: any) => {
  const { theme } = useTheme();
  const { taskId } = route.params;
  const [task, setTask] = useState<Task | null>(null);
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    loadTask();
  }, [taskId]);

  const loadTask = async () => {
    try {
      const loadedTask = await TaskService.getTaskById(taskId);
      setTask(loadedTask);

      if (loadedTask?.categoryId) {
        const taskCategory = await CategoryService.getCategoryById(loadedTask.categoryId);
        setCategory(taskCategory);
      }
    } catch (error) {
      console.error('Erro ao carregar tarefa:', error);
      Alert.alert('Erro', 'Não foi possível carregar os detalhes da tarefa');
    }
  };

  const handleStatusChange = async (newStatus: Task['status']) => {
    if (!task) return;

    try {
      await TaskService.updateTask(taskId, { status: newStatus });
      setTask({ ...task, status: newStatus });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o status da tarefa');
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta tarefa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await TaskService.deleteTask(taskId);
              navigation.goBack();
            } catch (error) {
              console.error('Erro ao deletar tarefa:', error);
              Alert.alert('Erro', 'Não foi possível excluir a tarefa');
            }
          }
        }
      ]
    );
  };

  if (!task) {
    return (
      <View style={[
        styles.container,
        { backgroundColor: theme.colors.background }
      ]}>
        <Text style={[
          styles.errorText,
          { color: theme.colors.error }
        ]}>
          Tarefa não encontrada
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[
      styles.container,
      { backgroundColor: theme.colors.background }
    ]}>
      <View style={[
        styles.header,
        { borderBottomColor: theme.colors.border }
      ]}>
        <Text style={[
          styles.title,
          { color: theme.colors.text.primary }
        ]}>
          {task.title}
        </Text>
        <TouchableOpacity
          style={[
            styles.editButton,
            { backgroundColor: theme.colors.primary }
          ]}
          onPress={() => navigation.navigate('TaskForm', { taskId })}
        >
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[
          styles.sectionTitle,
          { color: theme.colors.primary }
        ]}>
          Descrição
        </Text>
        <Text style={[
          styles.description,
          { color: theme.colors.text.primary }
        ]}>
          {task.description || 'Sem descrição'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[
          styles.sectionTitle,
          { color: theme.colors.primary }
        ]}>
          Categoria
        </Text>
        <View style={styles.categoryContainer}>
          {category && (
            <>
              <Text style={[
                styles.categoryIcon,
                { color: theme.colors.text.primary }
              ]}>
                {category.icon}
              </Text>
              <Text style={[
                styles.categoryName,
                { color: theme.colors.text.primary }
              ]}>
                {category.name}
              </Text>
            </>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[
          styles.sectionTitle,
          { color: theme.colors.primary }
        ]}>
          Status
        </Text>
        <View style={styles.statusButtons}>
          <TouchableOpacity
            style={[
              styles.statusButton,
              task.status === 'pending' && styles.activeStatus,
              { backgroundColor: theme.colors.surface }
            ]}
            onPress={() => handleStatusChange('pending')}
          >
            <Text style={[
              styles.statusText,
              { color: theme.colors.text.primary }
            ]}>
              Pendente
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.statusButton,
              task.status === 'in_progress' && styles.activeStatus,
              { backgroundColor: theme.colors.surface }
            ]}
            onPress={() => handleStatusChange('in_progress')}
          >
            <Text style={[
              styles.statusText,
              { color: theme.colors.text.primary }
            ]}>
              Em Andamento
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.statusButton,
              task.status === 'completed' && styles.activeStatus,
              { backgroundColor: theme.colors.surface }
            ]}
            onPress={() => handleStatusChange('completed')}
          >
            <Text style={[
              styles.statusText,
              { color: theme.colors.text.primary }
            ]}>
              Concluída
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.deleteButton,
          { backgroundColor: theme.colors.error }
        ]}
        onPress={handleDelete}
      >
        <Text style={[
          styles.deleteButtonText,
          { color: theme.colors.text.primary }
        ]}>
          Excluir Tarefa
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 16,
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  activeStatus: {
    backgroundColor: '#673AB7',
  },
  statusText: {
    fontSize: 14,
  },
  deleteButton: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    margin: 20,
  },
});