import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

/**
 * Provedor de autenticação
 * 
 * Gerencia o estado de autenticação do usuário e fornece métodos
 * para login, cadastro, logout e recuperação de senha
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carrega o usuário armazenado ao iniciar o aplicativo
    loadStoredUser();
  }, []);

  /**
   * Carrega o usuário armazenado no AsyncStorage
   */
  const loadStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('@Auth:user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Realiza o login do usuário
   * @param email Email do usuário
   * @param password Senha do usuário
   */
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      // TODO: Implementar lógica de autenticação
      // Por enquanto, vamos simular um login
      const mockUser: User = {
        id: '1',
        name: 'Usuário Teste',
        email: email,
        createdAt: new Date().toISOString()
      };
      
      await AsyncStorage.setItem('@Auth:user', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Realiza o cadastro de um novo usuário
   * @param name Nome do usuário
   * @param email Email do usuário
   * @param password Senha do usuário
   */
  const signUp = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      // TODO: Implementar lógica de cadastro
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        createdAt: new Date().toISOString()
      };

      await AsyncStorage.setItem('@Auth:user', JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      console.error('Erro no cadastro:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Realiza o logout do usuário
   */
  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('@Auth:user');
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  };

  /**
   * Inicia o processo de recuperação de senha
   * @param email Email do usuário
   */
  const forgotPassword = async (email: string) => {
    try {
      // TODO: Implementar lógica de recuperação de senha
      console.log('Recuperação de senha solicitada para:', email);
    } catch (error) {
      console.error('Erro na recuperação de senha:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        forgotPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook para acessar o contexto de autenticação
 * @returns Contexto de autenticação
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};