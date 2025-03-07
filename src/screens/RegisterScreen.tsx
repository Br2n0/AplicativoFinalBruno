import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
  Dimensions
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { CustomInput } from '../components/CustomInput';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../contexts/ThemeContext';

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const { width, height } = Dimensions.get('window');

export const RegisterScreen = () => {
  // Estados para os campos do formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Estados para mensagens de erro
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  const { signUp, loading } = useAuth();
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { theme } = useTheme();

  /**
   * Valida o formulário antes de enviar
   * @returns true se o formulário for válido, false caso contrário
   */
  const validateForm = (): boolean => {
    let isValid = true;
    
    // Validação de nome (apenas letras e espaços)
    if (!name) {
      setNameError('Nome é obrigatório');
      isValid = false;
    } else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(name)) {
      setNameError('Nome deve conter apenas letras');
      isValid = false;
    } else {
      setNameError('');
    }
    
    // Validação de email (formato padrão)
    if (!email) {
      setEmailError('Email é obrigatório');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Formato de email inválido');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    // Validação de senha (mínimo 4 caracteres)
    if (!password) {
      setPasswordError('Senha é obrigatória');
      isValid = false;
    } else if (password.length < 4) {
      setPasswordError('Senha deve ter pelo menos 4 caracteres');
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    // Validação de confirmação de senha
    if (!confirmPassword) {
      setConfirmPasswordError('Confirmação de senha é obrigatória');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('As senhas não coincidem');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }
    
    return isValid;
  };

  /**
   * Manipula o processo de cadastro
   */
  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      await signUp(name, email, password);
      // Navegação será feita automaticamente pelo AuthNavigator
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível realizar o cadastro. Tente novamente.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Fundo estilizado com cor roxa fixa */}
      <View style={[styles.backgroundTop, { backgroundColor: '#B497D0' }]} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <View style={styles.logoBackground}>
              <Image 
                source={require('../../assets/images/icone-casaroxa.jpeg')} 
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={[styles.logoText, { color: '#673AB7' }]}>
              Home
            </Text>
            <Text style={[styles.logoSubText, { color: '#673AB7' }]}>
              Hive
            </Text>
          </View>
          
          <Text style={[styles.title, { color: '#673AB7' }]}>
            Criar Conta
          </Text>
          <Text style={[styles.subtitle, { color: '#673AB7' }]}>
            Preencha seus dados para começar
          </Text>

          {/* Formulário com fundo claro */}
          <View style={styles.formContainer}>
            <CustomInput
              placeholder="Nome completo"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (nameError) setNameError('');
              }}
              autoCapitalize="words"
              error={nameError}
            />

            <CustomInput
              placeholder="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) setEmailError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              error={emailError}
            />

            <CustomInput
              placeholder="Senha"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (passwordError) setPasswordError('');
              }}
              secureTextEntry
              error={passwordError}
            />

            <CustomInput
              placeholder="Confirmar senha"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (confirmPasswordError) setConfirmPasswordError('');
              }}
              secureTextEntry
              error={confirmPasswordError}
            />

            <TouchableOpacity
              style={[styles.registerButton, { backgroundColor: '#673AB7' }]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.registerButtonText}>
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: '#673AB7' }]}>
              Já tem uma conta? 
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.loginLink, { color: '#673AB7' }]}>
                Faça login
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
  backgroundTop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: height * 0.25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    opacity: 0.8,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
    opacity: 0.8,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  registerButton: {
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 16,
  },
  loginLink: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
    textDecorationLine: 'underline',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logoBackground: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: '#B497D0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  logoImage: {
    width: 40,
    height: 40,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  logoSubText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});