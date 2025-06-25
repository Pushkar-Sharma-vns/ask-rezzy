
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ImageBackground,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '@/components/common/Header';
import { MenuModal } from '@/components/common/MenuModal';
import { Card } from '@/components/ui/Card';
import { Colors, Spacing, FontSize } from '@/constants/Colors';
import { router } from 'expo-router';
import { apiService } from '@/services/api';
import { ChatSession } from '@/types/index';


export default function ChatHistoryScreen() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    console.log('ChatHistoryScreen: useEffect - Initial load');
    loadChatSessions();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      console.log('ChatHistoryScreen: useFocusEffect - Screen focused');
      loadChatSessions();
    }, [])
  );

  const loadChatSessions = async (page: number = 1, isRefresh: boolean = false) => {
    try {
      console.log('ChatHistoryScreen: loadChatSessions called', { page, isRefresh });
      if (isRefresh) {
        setRefreshing(true);
        setCurrentPage(1);
      } else if (page === 1) {
        setLoading(true);
      }
      
      setError(null);
      
      console.log('ChatHistoryScreen: Calling apiService.getChatSessions');
      const response = await apiService.getChatSessions(page, 10);
      console.log('ChatHistoryScreen: API response received', response);
      
      if (response.success && response.data) {
        if (isRefresh || page === 1) {
          setChatSessions(response.data.chat_sessions);
        } else {
          setChatSessions(prev => [...prev, ...response.data!.chat_sessions]);
        }
        setHasMore(response.data.pagination.has_next);
        setCurrentPage(page);
      } else {
        setError(response.error || 'Failed to load chat sessions');
      }
    } catch (error) {
      console.error('Load chat sessions error:', error);
      setError('Failed to load chat sessions. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadChatSessions(1, true);
  };

  const handleChatPress = (chatSessionId: string) => {
    try {
      router.push(`/(chat)/${chatSessionId}`);
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
              setChatSessions(prev => prev.filter(chat => chat.chat_session_id !== chatId));
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
    <ImageBackground
      source={require('@/assets/background.png')}
      style={styles.container}
      resizeMode="cover"
      imageStyle={styles.backgroundImage}
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
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary.blue} />
            <Text style={styles.loadingText}>Loading chat history...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons 
              name="alert-circle-outline" 
              size={64} 
              color={Colors.status.error} 
            />
            <Text style={styles.errorTitle}>Failed to load chat history</Text>
            <Text style={styles.errorSubtitle}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => loadChatSessions(1)}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[Colors.primary.blue]}
                tintColor={Colors.primary.blue}
              />
            }
          >
            {chatSessions.length === 0 ? (
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
                {chatSessions.map((chat) => (
                  <TouchableOpacity
                    key={chat.chat_session_id}
                    onPress={() => handleChatPress(chat.chat_session_id)}
                    style={styles.chatItem}
                  >
                    <Card style={styles.chatCard}>
                      <View style={styles.chatHeader}>
                        <Text style={styles.chatTitle} numberOfLines={2}>
                          {chat.title}
                        </Text>
                        <TouchableOpacity
                          onPress={() => handleDeleteChat(chat.chat_session_id)}
                          style={styles.deleteButton}
                        >
                          <Ionicons 
                            name="trash-outline" 
                            size={18} 
                            color={Colors.text.secondary} 
                          />
                        </TouchableOpacity>
                      </View>
                      
                      <View style={styles.chatFooter}>
                        <Text style={styles.timestamp}>
                          {new Date(chat.created_at).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </Text>
                        <Text style={styles.questionCount}>
                          {chat.response_count} responses
                        </Text>
                      </View>
                    </Card>
                  </TouchableOpacity>
                ))}
                
                {hasMore && (
                  <TouchableOpacity
                    style={styles.loadMoreButton}
                    onPress={() => loadChatSessions(currentPage + 1)}
                  >
                    <Text style={styles.loadMoreText}>Load More</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </ScrollView>
        )}
    </SafeAreaView>
    </ImageBackground>
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
  },
  retryButtonText: {
    color: Colors.text.inverse,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  loadMoreButton: {
    backgroundColor: Colors.background.secondary,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  loadMoreText: {
    color: Colors.primary.blue,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
});