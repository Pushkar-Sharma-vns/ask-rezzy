
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSize } from '@/constants/Colors';

interface SearchSuggestion {
  id: string;
  text: string;
  category: 'topic' | 'question' | 'flashcard';
}

interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[];
  onSuggestionPress: (suggestion: string) => void;
  title?: string;
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  onSuggestionPress,
  title = "POPULAR SEARCHES",
}) => {
  const handleSuggestionPress = (suggestion: string) => {
    try {
      onSuggestionPress(suggestion);
    } catch (error) {
      console.error('Suggestion press error:', error);
    }
  };

  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        {suggestions.map((suggestion) => (
          <TouchableOpacity
            key={suggestion.id}
            style={styles.suggestionItem}
            onPress={() => handleSuggestionPress(suggestion.text)}
          >
            <View style={styles.suggestionContent}>
              <Text style={styles.suggestionText}>
                {suggestion.text}
              </Text>
              <View style={[
                styles.categoryBadge,
                styles[`${suggestion.category}Badge`]
              ]}>
                <Text style={[
                  styles.categoryText,
                  styles[`${suggestion.category}Text`]
                ]}>
                  {suggestion.category.toUpperCase()}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.text.secondary,
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  scrollView: {
    maxHeight: 300,
  },
  suggestionItem: {
    marginBottom: Spacing.sm,
  },
  suggestionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.background.lightGray,
    borderRadius: BorderRadius.md,
  },
  suggestionText: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.text.primary,
    marginRight: Spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  topicBadge: {
    backgroundColor: Colors.primary.lightBlue,
  },
  questionBadge: {
    backgroundColor: Colors.quiz.correct,
  },
  flashcardBadge: {
    backgroundColor: Colors.background.gray,
  },
  categoryText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  topicText: {
    color: Colors.primary.blue,
  },
  questionText: {
    color: Colors.text.white,
  },
  flashcardText: {
    color: Colors.text.secondary,
  },
});