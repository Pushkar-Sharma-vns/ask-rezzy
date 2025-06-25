
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChatMessage, Question, Flashcard } from '@/types/index';
import apiService from '@/services/api';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
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
        
        const response = await apiService.sendChatMessage(message);
        
        if (response.success && response.data) {
          setMessages(prev => [...prev, response.data]);
          setIsStreaming(false);
          return response.data;
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

  const clearChat = useCallback(() => {
    setMessages([]);
    queryClient.clear();
  }, [queryClient]);

  return {
    messages,
    isLoading: sendMessageMutation.isPending || isStreaming,
    error: sendMessageMutation.error?.message || null,
    sendMessage,
    clearChat,
  };
};
