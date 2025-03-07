import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CustomInput } from '../components/CustomInput';
import { CategoryPicker } from '../components/CategoryPicker';
import { TaskService } from '../services/TaskService';
import { FamilyMemberService } from '../services/FamilyMemberService';
import { Task, FamilyMember } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface TaskFormData {
  title: string;
  description: string;
  categoryId: string | null;
  assignedTo: string | null;
  deadline: Date | null;
}

export const TaskFormScreen = ({ route, navigation }: any) => {
  const { theme } = useTheme();
  const { taskId } = route.params || {};
  const isEditing = !!taskId;

  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    categoryId: null,
    assignedTo: null,
    deadline: null,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);

  useEffect(() => {
    if (isEditing) {
      loadTask();
    }
    loadFamilyMembers();
  }, []);

  const loadTask = async () => {
    try {
      const task = await TaskService.getTaskById(taskId);
      if (task) {
        setFormData({
          title: task.title,
          description: task.description || '',
          categoryId: task.categoryId || null,
          assignedTo: task.assignedTo || null,
          deadline: task.deadline ? new Date(task.deadline) : null,
        });
      }
    } catch (error) {
      console.error('Erro ao carregar tarefa:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados da tarefa');
    }
  };

  const loadFamilyMembers = async () => {
    try {
      const members = await FamilyMemberService.getFamilyMembers();
      setFamilyMembers(members);
    } catch (error) {
      console.error('Erro ao carregar membros da família:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TaskFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      // Convertendo formData para o formato esperado pelo TaskService
      const taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
        title: formData.title,
        description: formData.description || undefined,
        status: 'pending',
        categoryId: formData.categoryId || undefined,
        assignedTo: formData.assignedTo || undefined,
        deadline: formData.deadline ? formData.deadline.toISOString() : undefined,
      };

      if (isEditing) {
        await TaskService.updateTask(taskId, taskData);
      } else {
        await TaskService.createTask(taskData);
      }

      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
      Alert.alert('Erro', 'Não foi possível salvar a tarefa');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background }
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.scrollView}>
        <CustomInput
          label="Título"
          value={formData.title}
          onChangeText={(text) => setFormData({ ...formData, title: text })}
          error={errors.title}
        />

        <CustomInput
          label="Descrição"
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Categoria</Text>
        <CategoryPicker
          selectedId={formData.categoryId}
          onSelect={(categoryId) => setFormData({ ...formData, categoryId })}
        />

        <TouchableOpacity
          style={[
            styles.dateButton,
            { backgroundColor: theme.colors.surface }
          ]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={[
            styles.dateButtonText,
            { color: theme.colors.text.primary }
          ]}>
            {formData.deadline
              ? formData.deadline.toLocaleDateString('pt-BR')
              : 'Selecionar Prazo'}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={formData.deadline || new Date()}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) {
                setFormData({ ...formData, deadline: date });
              }
            }}
          />
        )}

        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: theme.colors.primary }
          ]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>
            {isEditing ? 'Salvar Alterações' : 'Criar Tarefa'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    padding: 16,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 8,
  },
  dateButton: {
    backgroundColor: '#2D2D2D',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 24,
  },
  dateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#BB86FC',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
  },
  submitButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});