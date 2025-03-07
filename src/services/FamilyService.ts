import AsyncStorage from '@react-native-async-storage/async-storage';
import { Family, FamilyInvite, FamilyMember } from '../types';

const STORAGE_KEYS = {
  FAMILIES: '@tarefas:families',
  FAMILY_MEMBERS: '@tarefas:family_members',
  INVITES: '@tarefas:family_invites',
};

export class FamilyService {
  // Criar uma nova família
  static async createFamily(name: string, createdBy: string): Promise<Family> {
    const families = await this.getFamilies();
    
    const newFamily: Family = {
      id: Date.now().toString(),
      name,
      createdBy,
      createdAt: new Date().toISOString(),
      inviteCode: this.generateInviteCode(),
    };

    await AsyncStorage.setItem(
      STORAGE_KEYS.FAMILIES,
      JSON.stringify([...families, newFamily])
    );

    // Adicionar o criador como membro admin
    await this.addFamilyMember({
      id: Date.now().toString(),
      userId: createdBy,
      familyId: newFamily.id,
      role: 'admin',
      joinedAt: new Date().toISOString(),
    });

    return newFamily;
  }

  // Gerar código de convite único
  private static generateInviteCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  // Buscar todas as famílias
  static async getFamilies(): Promise<Family[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.FAMILIES);
    return data ? JSON.parse(data) : [];
  }

  // Buscar família por ID
  static async getFamilyById(id: string): Promise<Family | null> {
    const families = await this.getFamilies();
    return families.find(family => family.id === id) || null;
  }

  // Buscar família por código de convite
  static async getFamilyByInviteCode(code: string): Promise<Family | null> {
    const families = await this.getFamilies();
    return families.find(family => family.inviteCode === code) || null;
  }

  // Adicionar membro à família
  static async addFamilyMember(member: FamilyMember): Promise<void> {
    const members = await this.getFamilyMembers();
    await AsyncStorage.setItem(
      STORAGE_KEYS.FAMILY_MEMBERS,
      JSON.stringify([...members, member])
    );
  }

  // Buscar membros de uma família
  static async getFamilyMembers(familyId?: string): Promise<FamilyMember[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.FAMILY_MEMBERS);
    const members = data ? JSON.parse(data) : [];
    return familyId ? members.filter(member => member.familyId === familyId) : members;
  }

  // Criar convite para família
  static async createInvite(familyId: string, email: string): Promise<FamilyInvite> {
    const invites = await this.getInvites();
    
    const newInvite: FamilyInvite = {
      id: Date.now().toString(),
      familyId,
      email,
      status: 'pending',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias
    };

    await AsyncStorage.setItem(
      STORAGE_KEYS.INVITES,
      JSON.stringify([...invites, newInvite])
    );

    return newInvite;
  }

  // Buscar convites
  static async getInvites(email?: string): Promise<FamilyInvite[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.INVITES);
    const invites = data ? JSON.parse(data) : [];
    return email ? invites.filter(invite => invite.email === email) : invites;
  }

  // Atualizar status do convite
  static async updateInviteStatus(
    inviteId: string,
    status: 'accepted' | 'rejected'
  ): Promise<void> {
    const invites = await this.getInvites();
    const updatedInvites = invites.map(invite =>
      invite.id === inviteId ? { ...invite, status } : invite
    );

    await AsyncStorage.setItem(
      STORAGE_KEYS.INVITES,
      JSON.stringify(updatedInvites)
    );
  }
}