
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ImageBackground,
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
import { ChatSession } from '@/types/index';
import apiService from '@/services/api';


export default function HomeScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);
  const { messages, isLoading, error, sendMessage, clearChat } = useChat();
  const { startQuiz } = useQuiz();

  // Load chat sessions for popular searches
  useEffect(() => {
    loadPopularSearches();
  }, []);

  const loadPopularSearches = async () => {
    try {
      setSuggestionsLoading(true);
      const response = await apiService.getChatSessions(1, 10);
      
      if (response.success && response.data) {
        // Sort by response count (descending) and take top 3
        const sortedSessions = response.data.chat_sessions
          .sort((a, b) => b.response_count - a.response_count)
          .slice(0, 3);
        
        setChatSessions(sortedSessions);
      }
    } catch (error) {
      console.error('Failed to load popular searches:', error);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  // Convert chat sessions to suggestions format
  const getPopularSuggestions = () => {
    if (suggestionsLoading || chatSessions.length === 0) {
      return [];
    }
    
    return chatSessions.map((session, index) => ({
      id: session.chat_session_id,
      text: session.title,
      category: 'topic' as const, // Default to topic category
    }));
  };

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
      // Check if this is a chat session title from our popular searches
      const matchingSession = chatSessions.find(session => session.title === suggestion);
      
      if (matchingSession) {
        // Navigate to the existing chat session
        router.push(`/(chat)/${matchingSession.chat_session_id}`);
      } else {
        // If not a chat session, send as a new message
        handleSendMessage(suggestion);
      }
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

  // Use background image for welcome screen, gradient for chat
  const BackgroundComponent = showWelcomeMessage ? ImageBackground : LinearGradient;
  const backgroundProps = showWelcomeMessage 
    ? { 
        source: require('@/assets/background.png'), 
        style: styles.container,
        resizeMode: 'cover',
        imageStyle: styles.backgroundImage
      }
    : { colors: ['rgba(22, 122, 223, 0.01)', 'rgba(22, 122, 223, 0.05)'], style: styles.container };

  return (
    <BackgroundComponent {...backgroundProps}>
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
                suggestions={getPopularSuggestions()}
                onSuggestionPress={handleSuggestionPress}
                title="POPULAR SEARCHES"
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
    </BackgroundComponent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
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
