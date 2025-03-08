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
import { ThemeToggleButton } from '../components/ThemeToggleButton';
import { useAlert } from '../contexts/AlertContext';
import { StatusSelector } from '../components/StatusSelector';

export const TaskDetailsScreen = ({ route, navigation }: any) => {
  const { theme } = useTheme();
  const { taskId } = route.params;
  const [task, setTask] = useState<Task | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const { showDeleteConfirmation, showError } = useAlert();

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
      showError('Não foi possível carregar os detalhes da tarefa');
    }
  };

  const handleStatusChange = async (newStatus: Task['status']) => {
    if (!task) return;

    try {
      await TaskService.updateTask(taskId, { status: newStatus });
      setTask({ ...task, status: newStatus });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      showError('Não foi possível atualizar o status da tarefa');
    }
  };

  const handleDelete = async () => {
    showDeleteConfirmation(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta tarefa?',
      async () => {
        try {
          await TaskService.deleteTask(taskId);
          navigation.goBack();
        } catch (error) {
          console.error('Erro ao deletar tarefa:', error);
          showError('Não foi possível excluir a tarefa');
        }
      }
    );
  };

  if (!task) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.text.primary }]}>
            Carregando...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            {task.title}
          </Text>
          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: theme.colors.primary }]}
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
          <StatusSelector 
            currentStatus={task.status} 
            onStatusChange={handleStatusChange} 
          />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
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
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 16,
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
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
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
  deleteButton: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
  },
});