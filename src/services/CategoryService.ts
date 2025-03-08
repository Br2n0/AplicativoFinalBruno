import { Category } from '../types';
import { supabase } from './supabase';
import { getCurrentUser } from './supabase';
import { Database } from '../types/supabase';
import { ErrorService } from './ErrorService';

type CategoryRow = Database['public']['Tables']['categories']['Row'];

export class CategoryService {
  // Buscar todas as categorias
  static async getCategories(): Promise<Category[]> {
    try {
      const user = await getCurrentUser();
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .or(`user_id.is.null,user_id.eq.${user?.id || ''}`)
        .order('name');
        
      if (error) throw error;
      
      return (data || []).map((row: CategoryRow) => ({
        id: row.id,
        name: row.name,
        icon: row.icon
      }));
    } catch (error) {
      ErrorService.logError('CategoryService.getCategories', error);
      throw new Error(ErrorService.handleSupabaseError(error));
    }
  }

  // Buscar uma categoria específica por ID
  static async getCategoryById(id: string): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      if (!data) return null;
      
      return {
        id: data.id,
        name: data.name,
        icon: data.icon
      };
    } catch (error) {
      ErrorService.logError('CategoryService.getCategoryById', error);
      return null;
    }
  }

  // Criar uma nova categoria
  static async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    try {
      const user = await getCurrentUser();
      
      const { data, error } = await supabase
        .from('categories')
        .insert([
          {
            name: category.name,
            icon: category.icon,
            user_id: user?.id,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();
        
      if (error) throw error;
      
      return {
        id: data.id,
        name: data.name,
        icon: data.icon
      };
    } catch (error) {
      ErrorService.logError('CategoryService.createCategory', error);
      throw new Error(ErrorService.handleSupabaseError(error));
    }
  }
  
  // Atualizar uma categoria
  static async updateCategory(id: string, category: Partial<Omit<Category, 'id'>>): Promise<Category> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update({
          name: category.name,
          icon: category.icon,
        })
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      return {
        id: data.id,
        name: data.name,
        icon: data.icon
      };
    } catch (error) {
      ErrorService.logError('CategoryService.updateCategory', error);
      throw new Error(ErrorService.handleSupabaseError(error));
    }
  }
  
  // Excluir uma categoria
  static async deleteCategory(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      ErrorService.logError('CategoryService.deleteCategory', error);
      throw new Error(ErrorService.handleSupabaseError(error));
    }
  }
}