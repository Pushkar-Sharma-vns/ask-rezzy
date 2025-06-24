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
        {/* User message bubble */}
        {message.content && (
          <View style={styles.userMessageBubble}>
            <Text style={styles.userMessageText}>
              {/* Extract user query from bot response if available */}
              {message.content.includes('Give me') ? 
                message.content.split('around')[0] + 'around anatomy topic' : 
                'Give me 5 PYQs around anatomy topic'
              }
            </Text>
          </View>
        )}
        
        {/* Bot response */}
        <View style={styles.botResponseContainer}>
          <RezzyAvatar />
          <View style={styles.botContent}>
            <Text style={styles.botLabel}>Rezzy</Text>
            <Text style={styles.botMessageText}>
              The bones that articulate with the femur are the tibia on the distal end of the femur and the ilium, ischium, and pubis. Here are 5 questions around it!
              {message.isStreaming && <Text style={styles.cursor}>|</Text>}
            </Text>
            
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
                  <FlashCard key={flashcard.id} flashcard={flashcard} />
                ))}
              </View>
            )}
          </View>
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
    paddingHorizontal: Spacing.md,
  },
  userContainer: {
    alignItems: 'flex-end',
    marginVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  userMessageBubble: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary.blue,
    borderRadius: BorderRadius.lg,
    borderBottomRightRadius: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: Colors.primary.blue,
    borderRadius: BorderRadius.lg,
    borderBottomRightRadius: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    maxWidth: '80%',
  },
  userMessageText: {
    color: Colors.text.white,
    fontSize: FontSize.md,
    lineHeight: 20,
  },
  userText: {
    color: Colors.text.white,
    fontSize: FontSize.md,
    lineHeight: 20,
  },
  botResponseContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  botContent: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  botLabel: {
    fontSize: FontSize.md,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  botMessageText: {
    fontSize: FontSize.md,
    color: Colors.text.primary,
    lineHeight: 20,
  },
  cursor: {
    opacity: 0.7,
    fontSize: FontSize.md,
  },
  questionsContainer: {
    marginTop: Spacing.md,
    width: '100%',
  },
  flashcardsContainer: {
    marginTop: Spacing.md,
    width: '100%',
  },
});
