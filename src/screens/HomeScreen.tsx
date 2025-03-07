import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import HomeHeader from '../components/HomeHeader';
import TaskCard from '../components/TaskCard';
import SearchBar from '../components/SearchBar';
import CategoryPicker from '../components/CategoryPicker';
import FloatingActionButton from '../components/FloatingActionButton';
import { Task, TaskCategory } from '../types';

// Dados de exemplo para tarefas
const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Limpar a cozinha',
    description: 'Lavar a louça e limpar o fogão',
    completed: false,
    category: 'cozinha',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: '1'
  },
  {
    id: '2',
    title: 'Fazer compras',
    description: 'Comprar leite, pão e ovos',
    completed: true,
    category: 'compras',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: '1'
  },
  {
    id: '3',
    title: 'Lavar roupas',
    description: 'Separar roupas claras e escuras',
    completed: false,
    category: 'lavanderia',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: '1'
  },
  {
    id: '4',
    title: 'Trocar lâmpada',
    description: 'Comprar lâmpada nova para o quarto',
    completed: false,
    category: 'manutenção',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: '1'
  },
];

/**
 * Tela principal do aplicativo
 * 
 * Exibe a lista de tarefas com opções de filtro e pesquisa
 */
const HomeScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | null>(null);

  // Filtra as tarefas com base na pesquisa e categoria selecionada
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (task.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    const matchesCategory = selectedCategory ? task.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  // Navega para a tela de detalhes da tarefa
  const handleTaskPress = (task: Task) => {
    // @ts-ignore - Navegação tipada corretamente no arquivo de navegação
    navigation.navigate('TaskDetails', { taskId: task.id });
  };

  // Alterna o estado de conclusão da tarefa
  const handleToggleComplete = (task: Task) => {
    const updatedTasks = tasks.map(t => 
      t.id === task.id ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
  };

  // Navega para a tela de criação de tarefa
  const handleAddTask = () => {
    // @ts-ignore - Navegação tipada corretamente no arquivo de navegação
    navigation.navigate('TaskForm');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <HomeHeader />
      
      <View style={styles.filtersContainer}>
        <SearchBar 
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Buscar tarefas..."
        />
        
        <CategoryPicker
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </View>
      
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard 
            task={item} 
            onPress={handleTaskPress}
            onToggleComplete={handleToggleComplete}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
            Nenhuma tarefa encontrada
          </Text>
        }
      />
      
      <FloatingActionButton onPress={handleAddTask} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filtersContainer: {
    padding: 16,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    opacity: 0.7,
  },
});

export default HomeScreen;