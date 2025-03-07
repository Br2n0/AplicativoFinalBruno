import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { TaskDetailsScreen } from '../screens/TaskDetailsScreen';
import { TaskFormScreen } from '../screens/TaskFormScreen';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#121212',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: '#121212',
          }
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            title: 'Tarefas Domésticas'
          }}
        />
        <Stack.Screen 
          name="TaskDetails" 
          component={TaskDetailsScreen}
          options={{
            title: 'Detalhes da Tarefa'
          }}
        />
        <Stack.Screen 
          name="TaskForm" 
          component={TaskFormScreen}
          options={({ route }: any) => ({
            title: route.params?.taskId ? 'Editar Tarefa' : 'Nova Tarefa'
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};