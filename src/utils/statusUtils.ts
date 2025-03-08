import { Task } from '../types';

/**
 * Retorna a cor correspondente ao status da tarefa
 * 
 * @param status Status da tarefa
 * @returns Cor correspondente ao status
 */
export const getStatusColor = (status: Task['status']): string => {
  switch(status) {
    case 'pending': return '#FF6B6B'; // Vermelho
    case 'in_progress': return '#FFD166'; // Amarelo
    case 'completed': return '#06D6A0'; // Verde
    default: return '#CCCCCC';
  }
};

/**
 * Retorna o texto correspondente ao status da tarefa
 * 
 * @param status Status da tarefa
 * @returns Texto correspondente ao status
 */
export const getStatusText = (status: Task['status']): string => {
  switch(status) {
    case 'pending': return 'Pendente';
    case 'in_progress': return 'Em Andamento';
    case 'completed': return 'Concluída';
    default: return '';
  }
};