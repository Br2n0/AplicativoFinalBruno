import React from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text 
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
}

export const SearchBar = ({ value, onChangeText, onClear }: SearchBarProps) => {
  const { theme } = useTheme();

  return (
    <View style={[
      styles.container,
      { backgroundColor: theme.colors.surface }
    ]}>
      <TextInput
        style={[
          styles.input,
          { color: theme.colors.text.primary }
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder="Pesquisar tarefas..."
        placeholderTextColor={theme.colors.text.disabled}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onClear} style={styles.clearButton}>
          <Text style={[
            styles.clearButtonText,
            { color: theme.colors.text.primary }
          ]}>
            ✕
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});