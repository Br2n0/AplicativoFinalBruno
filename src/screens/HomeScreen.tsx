import React, { useState, useMemo, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList, 
  ActivityIndicator,
  Text 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { TaskCard } from '../components/TaskCard';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { SearchBar } from '../components/SearchBar';
import { useTasks } from '../hooks/useTasks';
import { useTheme } from '../contexts/ThemeContext';
import { Task, Category } from '../types';
import { CategoryService } from '../services/CategoryService';

export const HomeScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const { tasks, loading, error, loadTasks } = useTasks();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [localTasks, setLocalTasks] = useState<Task[]>([]);

  // Recarrega as tarefas sempre que a tela receber foco
  useFocusEffect(
    React.useCallback(() => {
      loadTasks();
    }, [loadTasks])
  );

  // Atualiza as tarefas locais quando as tarefas do hook são carregadas
  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  // Carrega todas as categorias para usar na pesquisa
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const loadedCategories = await CategoryService.getCategories();
        setCategories(loadedCategories);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    };
    
    loadCategories();
  }, []);

  // Função para formatar a data para comparação na pesquisa
  const formatDateForSearch = (dateStr: string | undefined) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('pt-BR');
    } catch (error) {
      return '';
    }
  };

  // Filtra as tarefas por nome, categoria e prazo
  const filteredTasks = useMemo(() => {
    let filtered = localTasks;

    // Filtra por texto de pesquisa
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(task => {
        // Pesquisa por título ou descrição
        const titleMatch = task.title.toLowerCase().includes(query);
        const descriptionMatch = task.description?.toLowerCase().includes(query) || false;
        
        // Pesquisa por categoria
        let categoryMatch = false;
        if (task.categoryId) {
          const category = categories.find(cat => cat.id === task.categoryId);
          if (category) {
            categoryMatch = category.name.toLowerCase().includes(query);
          }
        }
        
        // Pesquisa por prazo
        const deadlineMatch = formatDateForSearch(task.deadline).toLowerCase().includes(query);
        
        return titleMatch || descriptionMatch || categoryMatch || deadlineMatch;
      });
    }

    return filtered;
  }, [localTasks, searchQuery, categories]);

  const handleTaskPress = (task: Task) => {
    navigation.navigate('TaskDetails', { taskId: task.id });
  };

  // Função para lidar com a mudança de status na tela home
  const handleStatusChange = (updatedTask: Task) => {
    // Atualiza a tarefa na lista local
    setLocalTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  if (loading) {
    return (
      <View style={[
        styles.centerContainer,
        { backgroundColor: theme.colors.background }
      ]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[
        styles.centerContainer,
        { backgroundColor: theme.colors.background }
      ]}>
        <Text style={[
          styles.errorText,
          { color: theme.colors.error }
        ]}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <View style={[
      styles.container,
      { backgroundColor: theme.colors.background }
    ]}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={handleClearSearch}
      />
      <FlatList
        data={filteredTasks}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onPress={handleTaskPress}
            onStatusChange={handleStatusChange}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={[
              styles.emptyText,
              { color: theme.colors.text.secondary }
            ]}>
              {searchQuery
                ? 'Nenhuma tarefa encontrada para sua pesquisa'
                : 'Nenhuma tarefa cadastrada no momento'}
            </Text>
            <Text style={[
              styles.emptySubText,
              { color: theme.colors.text.secondary }
            ]}>
              Toque no botão "+" abaixo para adicionar uma nova tarefa
            </Text>
          </View>
        )}
      />
      <FloatingActionButton
        onPress={() => navigation.navigate('TaskForm')}
        icon="+"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  errorText: {
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
});