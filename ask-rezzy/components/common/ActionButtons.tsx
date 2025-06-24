
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize } from '@/constants/Colors';

interface ActionButtonsProps {
  onFindPYQs: () => void;
  onFlashcards: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onFindPYQs,
  onFlashcards,
}) => {
  const handleFindPYQs = () => {
    try {
      onFindPYQs();
    } catch (error) {
      console.error('Find PYQs error:', error);
    }
  };

  const handleFlashcards = () => {
    try {
      onFlashcards();
    } catch (error) {
      console.error('Flashcards error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleFindPYQs}>
        <View style={styles.iconContainer}>
          <Ionicons name="search-outline" size={24} color={Colors.text.secondary} />
        </View>
        <Text style={styles.buttonText}>Find PYQs</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={handleFlashcards}>
        <View style={styles.iconContainer}>
          <Ionicons name="library-outline" size={24} color={Colors.text.secondary} />
        </View>
        <Text style={styles.buttonText}>Flashcards</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
    marginVertical: Spacing.lg,
    gap: Spacing.lg,
  },
  button: {
    alignItems: 'center',
    minWidth: 80,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  buttonText: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
});
