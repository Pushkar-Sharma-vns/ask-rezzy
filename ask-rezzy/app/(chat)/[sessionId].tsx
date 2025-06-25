import React, { useState, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '@/components/common/Header';
import { MenuModal } from '@/components/common/MenuModal';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { useQuiz } from '@/hooks/useQuiz';
import { Colors, Spacing, FontSize } from '@/constants/Colors';
import { apiService } from '@/services/api';
import { ChatMessage as ChatMessageType, Question } from '@/types/index';

export default function ChatSessionScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const scrollViewRef = useRef<ScrollView>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { startQuiz } = useQuiz();

  useEffect(() => {
    if (sessionId) {
      loadChatSession();
    }
  }, [sessionId]);

  const loadChatSession = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getChatSessionDetail(sessionId!);
      
      if (response.success && response.data) {
        const sessionData = response.data;
        const chatMessages: ChatMessageType[] = [];
        
        // Convert conversations to chat messages
        sessionData.conversations.forEach((conversation, index) => {
          // Each conversation contains user question and bot response
          const userQuestion = Object.keys(conversation)[0];
          const botResponse = conversation[userQuestion];
          
          // Add user message
          chatMessages.push({
            id: `user-${index}`,
            type: 'user',
            content: userQuestion,
            timestamp: new Date(sessionData.created_at),
          });
          
          // Parse bot response to extract content, questions, and flashcards
          const responseItems = Array.isArray(botResponse) ? botResponse : [botResponse];
          const firstItem = responseItems.find(item => item.response) || responseItems[0];
          const fact = firstItem?.fact || '';
          const responseText = firstItem?.response || 'Here is the information you requested.';
          
          const combinedContent = fact && responseText && fact !== responseText 
            ? `${fact} ${responseText}`
            : responseText || fact || 'Here is the information you requested.';
          
          const flashcards = responseItems.filter(item => item.front && item.back);
          const questions = responseItems.filter(item => item.options && item.options.length > 0 && item.correct_option);
          
          // Add bot message
          chatMessages.push({
            id: `bot-${index}`,
            type: 'bot',
            content: combinedContent,
            timestamp: new Date(sessionData.created_at),
            questions: questions.length > 0 ? questions : undefined,
            flashcards: flashcards.length > 0 ? flashcards : undefined,
          });
        });
        
        setMessages(chatMessages);
      } else {
        setError(response.error || 'Failed to load chat session');
      }
    } catch (error) {
      console.error('Load chat session error:', error);
      setError('Failed to load chat session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    try {
      setIsLoading(true);
      
      const userMessage: ChatMessageType = {
        id: Date.now().toString(),
        type: 'user',
        content: message,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);

      const response = await apiService.sendChatMessage(message, sessionId);
      
      if (response.success && response.data) {
        const { chatMessage } = response.data;
        setMessages(prev => [...prev, chatMessage]);
        
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      } else {
        throw new Error(response.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Send message error:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartQuiz = (questions: Question[]) => {
    try {
      startQuiz(questions);
      Alert.alert('Quiz Started', `Starting quiz with ${questions.length} questions`);
    } catch (error) {
      Alert.alert('Error', 'Failed to start quiz. Please try again.');
    }
  };

  const handleMenuPress = () => {
    setShowMenu(true);
  };

  const handleStartNewChat = async () => {
    try {
      // Clear the current chat session ID from storage
      await AsyncStorage.removeItem('chat_session_id');
      // Navigate to home screen with cleared session
      router.push('/(tabs)');
      setShowMenu(false);
    } catch (error) {
      console.error('Failed to start new chat:', error);
      // Still navigate even if clearing storage fails
      router.push('/(tabs)');
      setShowMenu(false);
    }
  };

  const handleViewPastChats = () => {
    router.push('/(tabs)/chat');
    setShowMenu(false);
  };

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <LinearGradient colors={['rgba(22, 122, 223, 0.01)', 'rgba(22, 122, 223, 0.05)']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary.blue} />
            <Text style={styles.loadingText}>Loading chat session...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient colors={['rgba(22, 122, 223, 0.01)', 'rgba(22, 122, 223, 0.05)']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={64} color={Colors.status.error} />
            <Text style={styles.errorTitle}>Failed to load chat</Text>
            <Text style={styles.errorSubtitle}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadChatSession}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              <Text style={styles.backButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient 
      colors={['rgba(22, 122, 223, 0.01)', 'rgba(22, 122, 223, 0.05)']} 
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.customHeader}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="chevron-back" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <View style={styles.chatIconContainer}>
              <Ionicons name="chatbubble" size={20} color="white" />
            </View>
          </View>
          
          <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
            <Ionicons name="menu" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>
        
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
            placeholder={isLoading ? "Rezzy is thinking..." : "Continue the conversation..."}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    minHeight: 56,
  },
  backButton: {
    padding: Spacing.xs,
    marginLeft: -Spacing.xs,
  },
  menuButton: {
    padding: Spacing.xs,
    marginRight: -Spacing.xs,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: Spacing.md,
  },
  chatIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    flexGrow: 1,
    paddingVertical: Spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  loadingText: {
    fontSize: FontSize.md,
    color: Colors.text.secondary,
    marginTop: Spacing.md,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl * 2,
  },
  errorTitle: {
    fontSize: FontSize.xl,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  errorSubtitle: {
    fontSize: FontSize.md,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  retryButton: {
    backgroundColor: Colors.primary.blue,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    marginBottom: Spacing.md,
  },
  retryButtonText: {
    color: Colors.text.inverse,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
});