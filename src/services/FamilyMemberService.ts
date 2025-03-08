import { FamilyMember } from '../types';
import { supabase } from './supabase';
import { getCurrentUser } from './supabase';
import { Database } from '../types/supabase';
import { ErrorService } from './ErrorService';

type FamilyMemberRow = Database['public']['Tables']['family_members']['Row'];

export class FamilyMemberService {
  // Buscar todos os membros da família
  static async getFamilyMembers(): Promise<FamilyMember[]> {
    try {
      const user = await getCurrentUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      const { data, error } = await supabase
        .from('family_members')
        .select('*')
        .eq('user_id', user.id)
        .order('name');
        
      if (error) throw error;
      
      return (data || []).map((row: FamilyMemberRow) => ({
        id: row.id,
        name: row.name,
        userId: row.user_id,
        familyId: '', // Será implementado quando tivermos a tabela de famílias
        role: 'admin', // Valor padrão até implementarmos a lógica de papéis
        joinedAt: row.created_at
      }));
    } catch (error) {
      ErrorService.logError('FamilyMemberService.getFamilyMembers', error);
      throw new Error(ErrorService.handleSupabaseError(error));
    }
  }

  // Adicionar um novo membro à família
  static async addFamilyMember(member: Omit<FamilyMember, 'id'>): Promise<FamilyMember> {
    try {
      const user = await getCurrentUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      const { data, error } = await supabase
        .from('family_members')
        .insert([
          {
            name: member.name,
            avatar: null, // Implementar upload de avatar posteriormente
            user_id: user.id,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();
        
      if (error) throw error;
      
      return {
        id: data.id,
        name: data.name,
        userId: data.user_id,
        familyId: '', // Será implementado quando tivermos a tabela de famílias
        role: 'admin', // Valor padrão até implementarmos a lógica de papéis
        joinedAt: data.created_at
      };
    } catch (error) {
      ErrorService.logError('FamilyMemberService.addFamilyMember', error);
      throw new Error(ErrorService.handleSupabaseError(error));
    }
  }

  // Buscar um membro da família por ID
  static async getFamilyMemberById(id: string): Promise<FamilyMember | null> {
    try {
      const { data, error } = await supabase
        .from('family_members')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      if (!data) return null;
      
      return {
        id: data.id,
        name: data.name,
        userId: data.user_id,
        familyId: '', // Será implementado quando tivermos a tabela de famílias
        role: 'admin', // Valor padrão até implementarmos a lógica de papéis
        joinedAt: data.created_at
      };
    } catch (error) {
      ErrorService.logError('FamilyMemberService.getFamilyMemberById', error);
      return null;
    }
  }

  // Buscar membros da família por ID da família (será implementado posteriormente)
  static async getFamilyMembersByFamilyId(familyId: string): Promise<FamilyMember[]> {
    // Esta função será implementada quando tivermos a tabela de famílias
    return [];
  }

  // Atualizar um membro da família
  static async updateFamilyMember(id: string, updates: Partial<FamilyMember>): Promise<FamilyMember | null> {
    try {
      const { data, error } = await supabase
        .from('family_members')
        .update({
          name: updates.name
          // Outros campos serão adicionados conforme necessário
        })
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      return {
        id: data.id,
        name: data.name,
        userId: data.user_id,
        familyId: '', // Será implementado quando tivermos a tabela de famílias
        role: 'admin', // Valor padrão até implementarmos a lógica de papéis
        joinedAt: data.created_at
      };
    } catch (error) {
      ErrorService.logError('FamilyMemberService.updateFamilyMember', error);
      return null;
    }
  }

  // Remover um membro da família
  static async removeFamilyMember(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('family_members')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      ErrorService.logError('FamilyMemberService.removeFamilyMember', error);
      throw new Error(ErrorService.handleSupabaseError(error));
    }
  }

  // Verificar se um usuário é administrador de uma família (será implementado posteriormente)
  static async isUserFamilyAdmin(userId: string, familyId: string): Promise<boolean> {
    // Esta função será implementada quando tivermos a tabela de famílias
    return true;
  }
}