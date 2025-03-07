import { useState, useEffect, useCallback } from 'react';
import { Task } from '../types';
import { TaskService } from '../services/TaskService';

/**
 * Hook personalizado para gerenciar tarefas
 * 
 * Fornece funções para carregar, filtrar e manipular tarefas
 */
export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Carrega as tarefas ao inicializar
  useEffect(() => {
    loadTasks();
  }, []);

  // Filtra as tarefas quando a busca ou categoria mudam
  useEffect(() => {
    filterTasks();
  }, [tasks, searchQuery, selectedCategory]);

  // Carrega todas as tarefas do serviço
  const loadTasks = async () => {
    setLoading(true);
    try {
      const loadedTasks = await TaskService.getTasks();
      setTasks(loadedTasks);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtra as tarefas com base na busca e categoria selecionada
  const filterTasks = useCallback(() => {
    let result = [...tasks];
    
    if (searchQuery) {
      result = result.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    
    if (selectedCategory) {
      result = result.filter(task => task.categoryId === selectedCategory);
    }
    
    setFilteredTasks(result);
  }, [tasks, searchQuery, selectedCategory]);

  return { tasks, filteredTasks, loading, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, loadTasks };
};