import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Category } from '../types';
import { CategoryService } from '../services/CategoryService';
import { useTheme } from '../contexts/ThemeContext';

interface CategoryPickerProps {
  selectedId: string | null;
  onSelect: (categoryId: string) => void;
}

export const CategoryPicker = ({ selectedId, onSelect }: CategoryPickerProps) => {
  const { theme } = useTheme();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const loadedCategories = await CategoryService.getCategories();
      setCategories(loadedCategories);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={[
        styles.container,
        { backgroundColor: theme.colors.background }
      ]}
    >
      {categories.map(category => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryButton,
            { 
              backgroundColor: selectedId === category.id 
                ? theme.colors.primary 
                : theme.colors.surface 
            }
          ]}
          onPress={() => onSelect(category.id)}
        >
          <Text style={styles.categoryIcon}>{category.icon}</Text>
          <Text style={[
            styles.categoryName,
            { color: theme.colors.text.primary }
          ]}>
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  categoryButton: {
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    alignItems: 'center',
    minWidth: 80,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 12,
    textAlign: 'center',
  },
});