
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '@/components/common/Header';
import { MenuModal } from '@/components/common/MenuModal';
import { Card } from '@/components/ui/Card';
import { Colors, Spacing, FontSize } from '@/constants/Colors';
import { router } from 'expo-router';

// Mock chat history - replace with actual data
const mockChatHistory = [
  {
    id: '1',
    title: 'What bones articulates with the femur?',
    lastMessage: 'The bones that articulate with the femur are the...',
    timestamp: '6 June, 2025',
    questionsCount: 5,
  },
  {
    id: '2',
    title: 'What topic is important to study for NEET-PG in Osteology?',
    lastMessage: 'Important topics include bone formation, remodeling...',
    timestamp: '5 June, 2025',
    questionsCount: 3,
  },
  {
    id: '3',
    title: 'What is the primary function of the patella?',
    lastMessage: 'The patella serves multiple functions including...',
    timestamp: '4 June, 2025',
    questionsCount: 2,
  },
  {
    id: '4',
    title: 'Which bones form the pelvic girdle?',
    lastMessage: 'The pelvic girdle is formed by the ilium...',
    timestamp: '3 June, 2025',
    questionsCount: 4,
  },
  {
    id: '5',
    title: 'What are the major types of bone fractures?',
    lastMessage: 'Major types include simple, compound...',
    timestamp: '2 June, 2025',
    questionsCount: 6,
  },
  {
    id: '6',
    title: 'How does osteoporosis affect bone density?',
    lastMessage: 'Osteoporosis significantly reduces bone mineral...',
    timestamp: '1 June, 2025',
    questionsCount: 3,
  },
];

export default function ChatHistoryScreen() {
  const [chatHistory, setChatHistory] = useState(mockChatHistory);
  const [showMenu, setShowMenu] = useState(false);

  const handleChatPress = (chatId: string) => {
    try {
      // Navigate to specific chat or load chat history
      Alert.alert('Chat Selected', `Loading chat: ${chatId}`);
    } catch (error) {
      console.error('Chat press error:', error);
      Alert.alert('Error', 'Failed to load chat. Please try again.');
    }
  };

  const handleDeleteChat = (chatId: string) => {
    try {
      Alert.alert(
        'Delete Chat',
        'Are you sure you want to delete this chat?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
            },
          },
        ]
      );
    } catch (error) {
      console.error('Delete chat error:', error);
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
      router.push('/(tabs)');
      setShowMenu(false);
    } catch (error) {
      console.error('Start new chat error:', error);
    }
  };

  const handleViewPastChats = () => {
    try {
      setShowMenu(false);
    } catch (error) {
      console.error('View past chats error:', error);
    }
  };

  return (
    <LinearGradient
      colors={['rgba(22, 122, 223, 0.01)', 'rgba(22, 122, 223, 0.05)']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <Header 
          title="Past Chats" 
          onMenuPress={handleMenuPress}
        />
        
        <MenuModal
          visible={showMenu}
          onClose={() => setShowMenu(false)}
          onStartNewChat={handleStartNewChat}
          onViewPastChats={handleViewPastChats}
        />
        
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
        {chatHistory.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons 
              name="chatbubbles-outline" 
              size={64} 
              color={Colors.text.placeholder} 
            />
            <Text style={styles.emptyTitle}>No chat history</Text>
            <Text style={styles.emptySubtitle}>
              Start a conversation with Rezzy to see your chat history here
            </Text>
          </View>
        ) : (
          <View style={styles.chatList}>
            {chatHistory.map((chat) => (
              <TouchableOpacity
                key={chat.id}
                onPress={() => handleChatPress(chat.id)}
                style={styles.chatItem}
              >
                <Card style={styles.chatCard}>
                  <View style={styles.chatHeader}>
                    <Text style={styles.chatTitle} numberOfLines={2}>
                      {chat.title}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleDeleteChat(chat.id)}
                      style={styles.deleteButton}
                    >
                      <Ionicons 
                        name="trash-outline" 
                        size={18} 
                        color={Colors.text.secondary} 
                      />
                    </TouchableOpacity>
                  </View>
                  
                  <Text style={styles.lastMessage} numberOfLines={2}>
                    {chat.lastMessage}
                  </Text>
                  
                  <View style={styles.chatFooter}>
                    <Text style={styles.timestamp}>{chat.timestamp}</Text>
                    <Text style={styles.questionCount}>
                      {chat.questionsCount} questions
                    </Text>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
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
    paddingHorizontal: Spacing.md,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl * 2,
  },
  emptyTitle: {
    fontSize: FontSize.xl,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: FontSize.md,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  chatList: {
    paddingVertical: Spacing.md,
  },
  chatItem: {
    marginBottom: Spacing.md,
  },
  chatCard: {
    padding: Spacing.md,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  chatTitle: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text.primary,
    marginRight: Spacing.sm,
    lineHeight: 20,
  },
  deleteButton: {
    padding: Spacing.xs,
    marginTop: -Spacing.xs,
    marginRight: -Spacing.xs,
  },
  lastMessage: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: FontSize.xs,
    color: Colors.text.placeholder,
  },
  questionCount: {
    fontSize: FontSize.xs,
    color: Colors.primary.blue,
    fontWeight: '500',
  },
});