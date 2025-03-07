import AsyncStorage from '@react-native-async-storage/async-storage';
import { FamilyMember } from '../types';

const STORAGE_KEY = '@tarefas:family_members';

export class FamilyMemberService {
  // Buscar todos os membros da família
  static async getFamilyMembers(): Promise<FamilyMember[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao buscar membros da família:', error);
      return [];
    }
  }

  // Adicionar um novo membro à família
  static async addFamilyMember(member: Omit<FamilyMember, 'id'>): Promise<FamilyMember> {
    try {
      const members = await this.getFamilyMembers();
      const newMember: FamilyMember = {
        ...member,
        id: Date.now().toString(),
      };

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...members, newMember]));
      return newMember;
    } catch (error) {
      console.error('Erro ao adicionar membro da família:', error);
      throw error;
    }
  }

  // Buscar membro por ID
  static async getFamilyMemberById(id: string): Promise<FamilyMember | null> {
    try {
      const members = await this.getFamilyMembers();
      return members.find(member => member.id === id) || null;
    } catch (error) {
      console.error('Erro ao buscar membro da família por ID:', error);
      return null;
    }
  }

  // Buscar membros por família
  static async getFamilyMembersByFamilyId(familyId: string): Promise<FamilyMember[]> {
    try {
      const members = await this.getFamilyMembers();
      return members.filter(member => member.familyId === familyId);
    } catch (error) {
      console.error('Erro ao buscar membros por família:', error);
      return [];
    }
  }

  // Atualizar membro
  static async updateFamilyMember(id: string, updates: Partial<FamilyMember>): Promise<FamilyMember | null> {
    try {
      const members = await this.getFamilyMembers();
      const index = members.findIndex(member => member.id === id);
      
      if (index === -1) return null;

      const updatedMember = { ...members[index], ...updates };
      members[index] = updatedMember;

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(members));
      return updatedMember;
    } catch (error) {
      console.error('Erro ao atualizar membro da família:', error);
      throw error;
    }
  }

  // Remover membro
  static async removeFamilyMember(id: string): Promise<void> {
    try {
      const members = await this.getFamilyMembers();
      const filteredMembers = members.filter(member => member.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredMembers));
    } catch (error) {
      console.error('Erro ao remover membro da família:', error);
      throw error;
    }
  }

  // Verificar se usuário é admin de uma família
  static async isUserFamilyAdmin(userId: string, familyId: string): Promise<boolean> {
    try {
      const members = await this.getFamilyMembers();
      const member = members.find(m => m.userId === userId && m.familyId === familyId);
      return member?.role === 'admin' || false;
    } catch (error) {
      console.error('Erro ao verificar permissão de admin:', error);
      return false;
    }
  }
}