
import React, { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatMessage, Question, Flashcard } from '@/types/index';
import apiService from '@/services/api';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      try {
        const userMessage: ChatMessage = {
          id: Date.now().toString(),
          type: 'user',
          content: message,
          timestamp: new Date(),
        };

        // Add user message immediately
        setMessages(prev => [...prev, userMessage]);

        // Get bot response with questions/flashcards in one call
        setIsStreaming(true);
        
        const response = await apiService.sendChatMessage(message, chatSessionId || undefined);
        
        if (response.success && response.data) {
          const { chatMessage, sessionId, responseNumber } = response.data;
          
          // Update chat session ID if it's a new session or changed
          if (sessionId !== chatSessionId) {
            setChatSessionId(sessionId);
            await AsyncStorage.setItem('chat_session_id', sessionId);
          }
          
          setMessages(prev => [...prev, chatMessage]);
          setIsStreaming(false);
          return chatMessage;
        } else {
          setIsStreaming(false);
          throw new Error(response.error || 'Failed to get response');
        }
      } catch (error) {
        setIsStreaming(false);
        throw new Error(error instanceof Error ? error.message : 'Failed to send message');
      }
    },
    onError: (error) => {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }]);
    }
  });

  const sendMessage = useCallback(async (message: string) => {
    try {
      await sendMessageMutation.mutateAsync(message);
    } catch (error) {
      console.error('Send message error:', error);
    }
  }, [sendMessageMutation]);

  const clearChat = useCallback(async () => {
    setMessages([]);
    setChatSessionId(null);
    await AsyncStorage.removeItem('chat_session_id');
    queryClient.clear();
  }, [queryClient]);

  // Load chat session ID from storage on hook initialization
  const loadChatSession = useCallback(async () => {
    try {
      const storedSessionId = await AsyncStorage.getItem('chat_session_id');
      if (storedSessionId) {
        setChatSessionId(storedSessionId);
      }
    } catch (error) {
      console.error('Failed to load chat session:', error);
    }
  }, []);

  // Load session on first render
  React.useEffect(() => {
    loadChatSession();
  }, [loadChatSession]);

  return {
    messages,
    isLoading: sendMessageMutation.isPending || isStreaming,
    error: sendMessageMutation.error?.message || null,
    sendMessage,
    clearChat,
  };
};
