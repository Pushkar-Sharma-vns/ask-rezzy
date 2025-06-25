import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ChatMessage as ChatMessageType } from '@/types/index';
import { Colors, Spacing, BorderRadius, FontSize } from '@/constants/Colors';
import { RezzyAvatar } from '@/components/common/RezzyAvatar';
import { QuizCard } from './QuizCard';
import { FlashCard } from './FlashCard';

interface ChatMessageProps {
  message: ChatMessageType;
  onStartQuiz?: (questions: any[]) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onStartQuiz }) => {
  const isBot = message.type === 'bot';

  if (isBot) {
    return (
      <View style={styles.botMessageContainer}>
        {/* Rezzy Header - stays at top with avatar */}
        <View style={styles.botHeaderContainer}>
          <RezzyAvatar />
          <Text style={styles.botLabel}>Rezzy</Text>
        </View>
        
        {/* Bot response content - centered to full screen */}
        <View style={styles.botContentContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.botMessageText}>
              {message.content.replace(/\n\n/g, ' ')}
              {message.isStreaming && <Text style={styles.cursor}>|</Text>}
            </Text>
          </View>
          
          {/* Render questions if available */}
          {message.questions && message.questions.length > 0 && (
            <View style={styles.questionsContainer}>
              <QuizCard 
                questions={message.questions} 
                onStartQuiz={onStartQuiz}
                interactive={true}
              />
            </View>
          )}
          
          {/* Render flashcards if available */}
          {message.flashcards && message.flashcards.length > 0 && (
            <View style={styles.flashcardsContainer}>
              {message.flashcards.map((flashcard, index) => (
                <FlashCard key={index} flashcard={flashcard} />
              ))}
            </View>
          )}
        </View>
      </View>
    );
  }

  // User message only
  return (
    <View style={styles.userContainer}>
      <View style={styles.userBubble}>
        <Text style={styles.userText}>{message.content}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  botMessageContainer: {
    marginVertical: Spacing.md,
    width: '100%',
  },
  userContainer: {
    alignItems: 'flex-end',
    marginVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  userBubble: {
    backgroundColor: Colors.primary.blue,
    borderRadius: BorderRadius.lg,
    borderBottomRightRadius: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    maxWidth: '80%',
  },
  userText: {
    color: Colors.text.white,
    fontSize: FontSize.md,
    lineHeight: 20,
  },
  botHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  botContentContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  textContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  botLabel: {
    fontSize: FontSize.md,
    fontWeight: '500',
    color: Colors.text.primary,
    marginLeft: Spacing.sm,
  },
  botMessageText: {
    fontSize: FontSize.md,
    color: Colors.text.primary,
    lineHeight: 20,
    textAlign: 'left',
    width: '100%',
  },
  cursor: {
    opacity: 0.7,
    fontSize: FontSize.md,
  },
  questionsContainer: {
    marginTop: Spacing.md,
    width: '100%',
    alignItems: 'center',
  },
  flashcardsContainer: {
    marginTop: Spacing.md,
    width: '100%',
    alignItems: 'center',
  },
});
