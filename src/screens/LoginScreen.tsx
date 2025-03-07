import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import CustomInput from '../components/CustomInput';
import ThemeToggleButton from '../components/ThemeToggleButton';

/**
 * Tela de login
 * 
 * Permite que o usuário faça login com email e senha
 * Também oferece opção para navegar para a tela de cadastro
 */
const LoginScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { signIn } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Valida os campos do formulário
  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '' };

    // Validação de email
    if (!email) {
      newErrors.email = 'Email é obrigatório';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
      isValid = false;
    }

    // Validação de senha
    if (!password) {
      newErrors.password = 'Senha é obrigatória';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Trata o envio do formulário
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      await signIn(email, password);
      // O redirecionamento é feito automaticamente pelo AuthContext
    } catch (error) {
      Alert.alert(
        'Erro ao fazer login',
        'Verifique suas credenciais e tente novamente.'
      );
      console.error('Erro no login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Navega para a tela de cadastro
  const navigateToRegister = () => {
    // @ts-ignore - Navegação tipada corretamente no arquivo de navegação
    navigation.navigate('Register');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.themeButtonContainer}>
        <ThemeToggleButton />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/logo.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />
          <Text style={[styles.appName, { color: theme.colors.primary }]}>
            HomeHive
          </Text>
          <Text style={[styles.tagline, { color: theme.colors.text }]}>
            Organize suas tarefas domésticas
          </Text>
        </View>

        <View style={[styles.formContainer, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.formTitle, { color: theme.colors.text }]}>
            Entrar
          </Text>

          <CustomInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            keyboardType="email-address"
            error={errors.email}
          />

          <CustomInput
            label="Senha"
            value={password}
            onChangeText={setPassword}
            placeholder="Sua senha"
            secureTextEntry
            error={errors.password}
          />

          <TouchableOpacity 
            style={[styles.loginButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <Text style={styles.loginButtonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={[styles.registerText, { color: theme.colors.text }]}>
              Não tem uma conta?
            </Text>
            <TouchableOpacity onPress={navigateToRegister}>
              <Text style={[styles.registerLink, { color: theme.colors.primary }]}>
                Cadastre-se
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  themeButtonContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    opacity: 0.8,
  },
  formContainer: {
    borderRadius: 16,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  loginButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  registerText: {
    marginRight: 4,
  },
  registerLink: {
    fontWeight: 'bold',
  },
});

export default LoginScreen;