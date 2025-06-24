
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize } from '@/constants/Colors';

interface QuizOptionProps {
  option: string;
  label: string;
  selected?: boolean;
  correct?: boolean;
  incorrect?: boolean;
  onPress: () => void;
  disabled?: boolean;
}

export const QuizOption: React.FC<QuizOptionProps> = ({
  option,
  label,
  selected = false,
  correct = false,
  incorrect = false,
  onPress,
  disabled = false,
}) => {
  const handlePress = () => {
    try {
      if (!disabled) {
        onPress();
      }
    } catch (error) {
      console.error('Quiz option press error:', error);
    }
  };

  const getOptionStyle = () => {
    if (correct) return [styles.option, styles.correctOption];
    if (incorrect) return [styles.option, styles.incorrectOption];
    if (selected) return [styles.option, styles.selectedOption];
    return styles.option;
  };

  const getTextStyle = () => {
    if (correct || incorrect) return [styles.optionText, styles.resultText];
    return styles.optionText;
  };

  const getIconName = () => {
    if (correct) return 'checkmark';
    if (incorrect) return 'close';
    return undefined;
  };

  const renderIcon = () => {
    const iconName = getIconName();
    if (!iconName) return null;
    
    return (
      <Ionicons 
        name={iconName} 
        size={20} 
        color={Colors.text.white} 
        style={styles.icon}
      />
    );
  };

  return (
    <TouchableOpacity
      style={getOptionStyle()}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={styles.optionContent}>
        <Text style={styles.optionLabel}>{label}</Text>
        <Text style={getTextStyle()}>{option}</Text>
      </View>
      {renderIcon()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    marginVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
    backgroundColor: Colors.background.primary,
  },
  selectedOption: {
    borderColor: Colors.primary.blue,
    backgroundColor: Colors.primary.lightBlue,
  },
  correctOption: {
    borderColor: Colors.quiz.correct,
    backgroundColor: Colors.quiz.correct,
  },
  incorrectOption: {
    borderColor: Colors.quiz.incorrect,
    backgroundColor: Colors.quiz.incorrect,
  },
  optionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionLabel: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text.primary,
    marginRight: Spacing.md,
    minWidth: 20,
  },
  optionText: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.text.primary,
  },
  resultText: {
    color: Colors.text.white,
  },
  icon: {
    marginLeft: Spacing.sm,
  },
});
