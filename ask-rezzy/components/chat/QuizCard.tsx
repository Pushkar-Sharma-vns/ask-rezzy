
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Question } from '@/types/index';
import { Colors, Spacing, BorderRadius, FontSize } from '@/constants/Colors';
import { Card } from '@/components/ui/Card';
// import { QuizOption } from '@/components/chat/QuizOption';
import { QuizOption } from './QuizOption';

interface QuizCardProps {
  questions: Question[];
  onStartQuiz?: (questions: Question[]) => void;
  interactive?: boolean;
}

export const QuizCard: React.FC<QuizCardProps> = ({ 
  questions, 
  onStartQuiz,
  interactive = false 
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState<Record<string, boolean>>({});

  const currentQuestion = questions[currentQuestionIndex];

  const handleStartQuiz = () => {
    try {
      if (onStartQuiz && questions.length > 0) {
        onStartQuiz(questions);
      }
    } catch (error) {
      console.error('Start quiz error:', error);
    }
  };

  const handleOptionSelect = (questionId: string, option: string) => {
    try {
      if (showResults[questionId]) return;
      
      setSelectedAnswers(prev => ({
        ...prev,
        [questionId]: option
      }));
      
      // Show result after 500ms
      setTimeout(() => {
        setShowResults(prev => ({
          ...prev,
          [questionId]: true
        }));
      }, 500);
    } catch (error) {
      console.error('Option select error:', error);
    }
  };

  const handleNavigation = (direction: 'next' | 'previous') => {
    try {
      if (direction === 'next' && currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else if (direction === 'previous' && currentQuestionIndex > 0) {
        setCurrentQuestionIndex(prev => prev - 1);
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  if (!interactive) {
    return (
      <Card style={styles.container}>
        <View style={styles.header}>
          <View style={styles.quizBadge}>
            <Text style={styles.quizIcon}>❓</Text>
            <Text style={styles.quizTitle}>Quiz</Text>
          </View>
          <Text style={styles.questionCount}>{questions.length} Questions</Text>
        </View>
        
        {questions.slice(0, 1).map((question, index) => (
          <View key={question.id} style={styles.questionPreview}>
            <Text style={styles.questionText}>
              {question.question}
            </Text>
          </View>
        ))}
        
        {questions.length > 1 && (
          <Text style={styles.moreQuestions}>
            +{questions.length - 1} more questions
          </Text>
        )}
      </Card>
    );
  }

  return (
    <Card style={styles.interactiveContainer}>
      <View style={styles.header}>
        <View style={styles.quizBadge}>
          <Text style={styles.quizIcon}>❓</Text>
          <Text style={styles.quizTitle}>Quiz</Text>
        </View>
        <Text style={styles.questionCount}>{questions.length} Questions</Text>
      </View>
      
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>
          {currentQuestion.question}
        </Text>
        
        {currentQuestion.options && (
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => {
              const label = String.fromCharCode(65 + index); // A, B, C, D
              const isSelected = selectedAnswers[currentQuestion.id] === option;
              const isCorrect = showResults[currentQuestion.id] && option === currentQuestion.correct_answer;
              const isIncorrect = showResults[currentQuestion.id] && isSelected && option !== currentQuestion.correct_answer;
              
              return (
                <QuizOption
                  key={index}
                  option={option}
                  label={label}
                  selected={isSelected}
                  correct={isCorrect}
                  incorrect={isIncorrect}
                  onPress={() => handleOptionSelect(currentQuestion.id, option)}
                  disabled={showResults[currentQuestion.id]}
                />
              );
            })}
          </View>
        )}
      </View>
      
      <View style={styles.navigation}>
        <TouchableOpacity 
          style={[styles.navButton, currentQuestionIndex === 0 && styles.navButtonDisabled]}
          onPress={() => handleNavigation('previous')}
          disabled={currentQuestionIndex === 0}
        >
          <Text style={[styles.navText, currentQuestionIndex === 0 && styles.navTextDisabled]}>
            PREVIOUS
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navButton, currentQuestionIndex === questions.length - 1 && styles.navButtonDisabled]}
          onPress={() => handleNavigation('next')}
          disabled={currentQuestionIndex === questions.length - 1}
        >
          <Text style={[styles.navText, currentQuestionIndex === questions.length - 1 && styles.navTextDisabled]}>
            NEXT
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.sm,
  },
  interactiveContainer: {
    marginTop: Spacing.sm,
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  quizBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quizIcon: {
    fontSize: FontSize.md,
    marginRight: Spacing.xs,
  },
  quizTitle: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  questionCount: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
  },
  questionContainer: {
    marginBottom: Spacing.lg,
  },
  questionPreview: {
    marginBottom: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  questionText: {
    fontSize: FontSize.md,
    color: Colors.text.primary,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  optionsContainer: {
    marginTop: Spacing.md,
  },
  moreQuestions: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    fontStyle: 'italic',
    marginBottom: Spacing.md,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.lg,
  },
  navButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background.lightGray,
    minWidth: 100,
    alignItems: 'center',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.text.secondary,
    letterSpacing: 1,
  },
  navTextDisabled: {
    color: Colors.text.placeholder,
  },
});
