import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category } from '../types';

const CATEGORIES_KEY = '@HomeHive:categories';

export class CategoryService {
  static async getCategories(): Promise<Category[]> {
    try {
      const data = await AsyncStorage.getItem(CATEGORIES_KEY);
      if (data) {
        return JSON.parse(data);
      }
      
      // Retorna categorias padrão se não houver dados salvos
      return [
        { id: '1', name: 'Limpeza', icon: '🧹' },
        { id: '2', name: 'Cozinha', icon: '🍳' },
        { id: '3', name: 'Compras', icon: '🛒' },
        { id: '4', name: 'Lavanderia', icon: '👕' },
      ];
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      return [];
    }
  }
}