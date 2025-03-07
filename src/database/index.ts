import AsyncStorage from '@react-native-async-storage/async-storage';

// Chaves para armazenamento
const STORAGE_KEYS = {
  CATEGORIES: '@tarefas:categories',
  FAMILY_MEMBERS: '@tarefas:family_members',
  TASKS: '@tarefas:tasks'
};

// Interfaces
interface Category {
  id: string;
  name: string;
  icon: string;
}

interface FamilyMember {
  id: string;
  name: string;
  avatar?: string;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  categoryId?: string;
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo?: string;
  deadline: string | undefined;
  createdAt: string;
  updatedAt: string;
}

// Função para inicializar o banco de dados
export const initDatabase = async (): Promise<void> => {
  try {
    // Verificar se já existem categorias
    const categoriesJson = await AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES);
    const categories: Category[] = categoriesJson ? JSON.parse(categoriesJson) : [];

    // Se não existirem categorias, criar as padrões
    if (categories.length === 0) {
      const defaultCategories: Category[] = [
        { id: '1', name: 'Limpeza', icon: '🧹' },
        { id: '2', name: 'Compras', icon: '🛒' },
        { id: '3', name: 'Cozinha', icon: '👩‍🍳' },
        { id: '4', name: 'Lavanderia', icon: '🧺' },
        { id: '5', name: 'Manutenção', icon: '🔧' }
      ];

      await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(defaultCategories));
      console.log('Categorias padrão inseridas');
    }

    // Inicializar arrays vazios para membros da família e tarefas se não existirem
    const familyMembersJson = await AsyncStorage.getItem(STORAGE_KEYS.FAMILY_MEMBERS);
    if (!familyMembersJson) {
      await AsyncStorage.setItem(STORAGE_KEYS.FAMILY_MEMBERS, JSON.stringify([]));
    }

    const tasksJson = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
    if (!tasksJson) {
      await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify([]));
    }

  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
    throw error;
  }
};

// Funções auxiliares para manipular os dados

// Categorias
export const getCategories = async (): Promise<Category[]> => {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES);
  return data ? JSON.parse(data) : [];
};

export const addCategory = async (category: Omit<Category, 'id'>): Promise<Category> => {
  const categories = await getCategories();
  const newCategory: Category = {
    ...category,
    id: Date.now().toString()
  };
  await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify([...categories, newCategory]));
  return newCategory;
};

// Membros da Família
export const getFamilyMembers = async (): Promise<FamilyMember[]> => {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.FAMILY_MEMBERS);
  return data ? JSON.parse(data) : [];
};

export const addFamilyMember = async (member: Omit<FamilyMember, 'id'>): Promise<FamilyMember> => {
  const members = await getFamilyMembers();
  const newMember: FamilyMember = {
    ...member,
    id: Date.now().toString()
  };
  await AsyncStorage.setItem(STORAGE_KEYS.FAMILY_MEMBERS, JSON.stringify([...members, newMember]));
  return newMember;
};

// Tarefas
export const getTasks = async (): Promise<Task[]> => {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
  return data ? JSON.parse(data) : [];
};

export const addTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
  const tasks = await getTasks();
  const now = new Date().toISOString();
  const newTask: Task = {
    ...task,
    id: Date.now().toString(),
    createdAt: now,
    updatedAt: now
  };
  await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify([...tasks, newTask]));
  return newTask;
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
  const tasks = await getTasks();
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) {
    throw new Error('Tarefa não encontrada');
  }

  const updatedTask: Task = {
    ...tasks[taskIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  tasks[taskIndex] = updatedTask;
  await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  return updatedTask;
};

export const deleteTask = async (id: string): Promise<void> => {
  const tasks = await getTasks();
  const filteredTasks = tasks.filter(t => t.id !== id);
  await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(filteredTasks));
};