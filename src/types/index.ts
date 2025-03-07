export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  category: TaskCategory;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export type TaskCategory = 
  | 'limpeza'
  | 'cozinha'
  | 'compras'
  | 'lavanderia'
  | 'manutenção'
  | 'outros';

export interface Family {
  id: string;
  name: string;
  members: User[];
  createdAt: string;
  updatedAt: string;
  ownerId: string;
}