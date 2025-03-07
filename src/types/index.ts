// Define o tipo para uma tarefa
export interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'pending' | 'in_progress' | 'completed';
    categoryId?: string;
    assignedTo?: string;
    deadline?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  // Define o tipo para uma categoria
  export interface Category {
    id: string;
    name: string;
    icon: string;
  }
  
  // Define o tipo para um membro da família
  export interface FamilyMember {
    id: string;
    userId: string;
    familyId: string;
    role: 'admin' | 'member';
    joinedAt: string;
  }

  export interface User {
    id: string;
    name: string;
    email: string;
    photoUrl?: string;
    createdAt: string;
  }

  export interface Family {
    id: string;
    name: string;
    createdBy: string; // userId do criador
    createdAt: string;
    inviteCode: string;
  }

  export interface FamilyInvite {
    id: string;
    familyId: string;
    email: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
    expiresAt: string;
  }