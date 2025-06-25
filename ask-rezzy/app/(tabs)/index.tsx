
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from '@/components/common/Header';
import { SearchSuggestions } from '@/components/common/SearchSuggestions';
import { ActionButtons } from '@/components/common/ActionButtons';
import { RezzyAvatar } from '@/components/common/RezzyAvatar';
import { MenuModal } from '@/components/common/MenuModal';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { useChat } from '@/hooks/useChat';
import { useQuiz } from '@/hooks/useQuiz'; 
import { Colors, Spacing } from '@/constants/Colors';
import { router } from 'expo-router';

// Mock suggestions - replace with your actual data
const mockSuggestions = [
  { id: '1', text: 'What bone articulates with the femur?', category: 'topic' as const },
  { id: '2', text: 'What topic is important to study for NEET-PG in Osteology?', category: 'question' as const },
  { id: '3', text: 'Which best serves the purpose of osteology?', category: 'flashcard' as const },
];

export default function HomeScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [showMenu, setShowMenu] = useState(false);
  const { messages, isLoading, error, sendMessage, clearChat } = useChat();
  const { startQuiz } = useQuiz();

  const handleSendMessage = async (message: string) => {
    try {
      await sendMessage(message);
      // Scroll to bottom after sending message
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    try {
      handleSendMessage(suggestion);
    } catch (error) {
      console.error('Suggestion press error:', error);
    }
  };

  const handleStartQuiz = (questions: any[]) => {
    try {
      startQuiz(questions);
      // Navigate to quiz screen or show quiz modal
      Alert.alert('Quiz Started', `Starting quiz with ${questions.length} questions`);
    } catch (error) {
      Alert.alert('Error', 'Failed to start quiz. Please try again.');
    }
  };

  const handleMenuPress = () => {
    try {
      setShowMenu(true);
    } catch (error) {
      console.error('Menu press error:', error);
    }
  };

  const handleStartNewChat = () => {
    try {
      clearChat();
    } catch (error) {
      console.error('Start new chat error:', error);
    }
  };

  const handleViewPastChats = () => {
    try {
      router.push('/(tabs)/chat');
    } catch (error) {
      console.error('View past chats error:', error);
    }
  };

  const handleFindPYQs = () => {
    try {
      handleSendMessage('Give me 5 PYQs about anatomy');
    } catch (error) {
      console.error('Find PYQs error:', error);
    }
  };

  const handleFlashcards = () => {
    try {
      handleSendMessage('Give me 5 flashcards about anatomy');
    } catch (error) {
      console.error('Flashcards error:', error);
    }
  };

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const showWelcomeMessage = messages.length === 0;

  return (
    <LinearGradient
      colors={['rgba(22, 122, 223, 0.01)', 'rgba(22, 122, 223, 0.05)']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <Header 
          title="Ask Rezzy" 
          onMenuPress={handleMenuPress}
        />
        
        <MenuModal
          visible={showMenu}
          onClose={() => setShowMenu(false)}
          onStartNewChat={handleStartNewChat}
          onViewPastChats={handleViewPastChats}
        />
        
        <KeyboardAvoidingView 
          style={styles.content}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {showWelcomeMessage && (
            <View style={styles.welcomeContainer}>
              <View style={styles.welcomeHeader}>
                <RezzyAvatar />
                <Text style={styles.welcomeTitle}>Rezzy</Text>
              </View>
              
              <View style={styles.greetingContainer}>
                <Text style={styles.greetingText}>Hey Dr. Vibhu 👋</Text>
                <Text style={styles.greetingSubtext}>How can I help?</Text>
              </View>
              
              <ActionButtons
                onFindPYQs={handleFindPYQs}
                onFlashcards={handleFlashcards}
              />
              
              <SearchSuggestions
                suggestions={mockSuggestions}
                onSuggestionPress={handleSuggestionPress}
              />
            </View>
          )}
          
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onStartQuiz={handleStartQuiz}
            />
          ))}
        </ScrollView>
        
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isLoading}
          placeholder={isLoading ? "Rezzy is thinking..." : "Ask anything..."}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    flexGrow: 1,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
  },
  welcomeHeader: {
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  welcomeTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
    marginTop: Spacing.sm,
  },
  greetingContainer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xl,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  greetingSubtext: {
    fontSize: 20,
    color: Colors.text.secondary,
  },
});
