export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
    error: string;
    success: string;
    warning: string;
    info: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  fontSizes: {
    small: number;
    medium: number;
    large: number;
    xlarge: number;
  };
  borderRadius: {
    small: number;
    medium: number;
    large: number;
  };
}

export const darkTheme: Theme = {
  colors: {
    primary: '#673AB7',    // Roxo principal
    secondary: '#B497D0',  // Roxo claro
    background: '#121212', // Fundo escuro
    card: '#1E1E1E',       // Cartões um pouco mais claros que o fundo
    text: '#FFFFFF',       // Texto branco
    border: '#2C2C2C',     // Bordas sutis
    notification: '#FF9800', // Notificações em laranja
    error: '#CF6679',      // Erro em vermelho rosado
    success: '#4CAF50',    // Sucesso em verde
    warning: '#FF9800',    // Aviso em laranja
    info: '#2196F3',       // Informação em azul
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  fontSizes: {
    small: 12,
    medium: 16,
    large: 20,
    xlarge: 24,
  },
  borderRadius: {
    small: 4,
    medium: 8,
    large: 16,
  },
};

export const lightTheme: Theme = {
  colors: {
    primary: '#673AB7',    // Roxo principal (mesmo do dark)
    secondary: '#B497D0',  // Roxo claro (mesmo do dark)
    background: '#F5F5F5', // Fundo claro
    card: '#FFFFFF',       // Cartões brancos
    text: '#212121',       // Texto quase preto
    border: '#E0E0E0',     // Bordas sutis
    notification: '#FF9800', // Notificações em laranja
    error: '#B00020',      // Erro em vermelho
    success: '#4CAF50',    // Sucesso em verde
    warning: '#FF9800',    // Aviso em laranja
    info: '#2196F3',       // Informação em azul
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  fontSizes: {
    small: 12,
    medium: 16,
    large: 20,
    xlarge: 24,
  },
  borderRadius: {
    small: 4,
    medium: 8,
    large: 16,
  },
};