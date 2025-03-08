import { PostgrestError } from '@supabase/supabase-js';

/**
 * Serviço para tratamento padronizado de erros
 */
export class ErrorService {
  /**
   * Trata erros do Supabase e retorna uma mensagem amigável
   */
  static handleSupabaseError(error: PostgrestError | Error | unknown): string {
    // Se for um erro do Supabase
    if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
      const pgError = error as PostgrestError;
      
      // Mapear códigos de erro comuns para mensagens amigáveis
      switch (pgError.code) {
        case '23505': // Unique violation
          return 'Este item já existe no banco de dados.';
        case '23503': // Foreign key violation
          return 'Este item está relacionado a outros registros e não pode ser modificado.';
        case '42P01': // Undefined table
          return 'Erro de configuração: tabela não encontrada.';
        case '42501': // Insufficient privilege
          return 'Você não tem permissão para realizar esta operação.';
        case '22P02': // Invalid text representation
          return 'Formato de dados inválido.';
        default:
          return pgError.message || 'Ocorreu um erro no banco de dados.';
      }
    }
    
    // Se for um erro genérico
    if (error instanceof Error) {
      // Erros de rede
      if (error.message.includes('network') || error.message.includes('connection')) {
        return 'Erro de conexão. Verifique sua internet e tente novamente.';
      }
      
      // Erros de autenticação
      if (error.message.includes('auth') || error.message.includes('login') || error.message.includes('password')) {
        return 'Erro de autenticação. Verifique suas credenciais.';
      }
      
      return error.message;
    }
    
    // Fallback para outros tipos de erro
    return 'Ocorreu um erro inesperado.';
  }
  
  /**
   * Registra erros no console com informações adicionais
   */
  static logError(context: string, error: unknown): void {
    console.error(`[${context}] Erro:`, error);
    
    // Aqui você poderia adicionar integração com serviços de monitoramento
    // como Sentry, Firebase Crashlytics, etc.
  }
}