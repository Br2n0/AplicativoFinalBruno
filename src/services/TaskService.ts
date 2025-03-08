import { Task } from '../types';
import { supabase } from './supabase';
import { getCurrentUser } from './supabase';
import { Database } from '../types/supabase';
import { ErrorService } from './ErrorService';

type TaskRow = Database['public']['Tables']['tasks']['Row'];

export class TaskService {
  // Buscar todas as tarefas
  static async getTasks(): Promise<Task[]> {
    try {
      const user = await getCurrentUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return (data || []).map((row: TaskRow) => ({
        id: row.id,
        title: row.title,
        description: row.description || undefined,
        status: row.status,
        categoryId: row.category_id || undefined,
        assignedTo: row.assigned_to || undefined,
        deadline: row.deadline || undefined,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
    } catch (error) {
      ErrorService.logError('TaskService.getTasks', error);
      throw new Error(ErrorService.handleSupabaseError(error));
    }
  }

  // Buscar tarefa por ID
  static async getTaskById(id: string): Promise<Task | null> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      if (!data) return null;
      
      return {
        id: data.id,
        title: data.title,
        description: data.description || undefined,
        status: data.status,
        categoryId: data.category_id || undefined,
        assignedTo: data.assigned_to || undefined,
        deadline: data.deadline || undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      ErrorService.logError('TaskService.getTaskById', error);
      return null;
    }
  }

  // Criar uma nova tarefa
  static async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    try {
      const user = await getCurrentUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            title: task.title,
            description: task.description || null,
            status: task.status,
            category_id: task.categoryId || null,
            assigned_to: task.assignedTo || null,
            deadline: task.deadline || null,
            created_at: now,
            updated_at: now,
            user_id: user.id
          }
        ])
        .select()
        .single();
        
      if (error) throw error;
      
      return {
        id: data.id,
        title: data.title,
        description: data.description || undefined,
        status: data.status,
        categoryId: data.category_id || undefined,
        assignedTo: data.assigned_to || undefined,
        deadline: data.deadline || undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      ErrorService.logError('TaskService.createTask', error);
      throw new Error(ErrorService.handleSupabaseError(error));
    }
  }

  // Atualizar uma tarefa
  static async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    try {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('tasks')
        .update({
          title: updates.title,
          description: updates.description || null,
          status: updates.status,
          category_id: updates.categoryId || null,
          assigned_to: updates.assignedTo || null,
          deadline: updates.deadline || null,
          updated_at: now
        })
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      return {
        id: data.id,
        title: data.title,
        description: data.description || undefined,
        status: data.status,
        categoryId: data.category_id || undefined,
        assignedTo: data.assigned_to || undefined,
        deadline: data.deadline || undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      ErrorService.logError('TaskService.updateTask', error);
      throw new Error(ErrorService.handleSupabaseError(error));
    }
  }

  // Deletar uma tarefa
  static async deleteTask(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      ErrorService.logError('TaskService.deleteTask', error);
      throw new Error(ErrorService.handleSupabaseError(error));
    }
  }
}