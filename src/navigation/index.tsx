import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { TaskFormScreen } from '../screens/TaskFormScreen';
import { TaskDetailsScreen } from '../screens/TaskDetailsScreen';
import { AuthNavigator } from './AuthNavigator';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../types/navigation';
import { HomeHeader } from '../components/HomeHeader';
import { useTheme } from '../contexts/ThemeContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Componente principal de navegação
 * 
 * Gerencia as rotas do aplicativo com base no estado de autenticação
 * Exibe telas de autenticação ou telas principais dependendo se o usuário está logado
 */
export const Navigation = () => {
  const { user } = useAuth();
  const { theme } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          // Configurações de estilo para o cabeçalho
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.text.primary,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {!user ? (
          // Rotas para usuários não autenticados
          <Stack.Screen
            name="Auth"
            component={AuthNavigator}
            options={{ headerShown: false }}
          />
        ) : (
          // Rotas para usuários autenticados
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                header: () => <HomeHeader />,
              }}
            />
            <Stack.Screen
              name="TaskForm"
              component={TaskFormScreen}
              options={{ title: 'Nova Tarefa' }}
            />
            <Stack.Screen
              name="TaskDetails"
              component={TaskDetailsScreen}
              options={{ title: 'Detalhes da Tarefa' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};