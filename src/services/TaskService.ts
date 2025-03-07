import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types';

const TASKS_KEY = '@HomeHive:tasks';

export class TaskService {
  static async getTasks(): Promise<Task[]> {
    try {
      const data = await AsyncStorage.getItem(TASKS_KEY);
      if (data) {
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
      return [];
    }
  }

  static async saveTask(task: Task): Promise<void> {
    try {
      const tasks = await this.getTasks();
      const updatedTasks = task.id
        ? tasks.map(t => (t.id === task.id ? task : t))
        : [...tasks, { ...task, id: Date.now().toString() }];
      
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
    }
  }
}