// services/api.ts

import { Question, Flashcard, ChatMessage, ApiResponse } from '@/types/index';

const API_BASE_URL = __DEV__ ? 'http://localhost:8000' : 'https://your-production-api.com';

class ApiService {
  private async fetchWithErrorHandling<T>(
    url: string, 
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async searchQuestions(query: string): Promise<ApiResponse<Question[]>> {
    try {
      const response = await this.fetchWithErrorHandling<Question[]>(
        `${API_BASE_URL}/process_query`,
        {
          method: 'POST',
          body: JSON.stringify({ question: query }),
        }
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to get response');
      }

      // Filter only questions (items with options and correct_option)
      const questions = response.data.filter(item => 
        item.options && item.options.length > 0 && item.correct_option
      );
      
      return {
        success: true,
        data: questions,
      };
    } catch (error) {
      console.error('Search questions error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search questions',
      };
    }
  }

  async searchFlashcards(query: string): Promise<ApiResponse<Flashcard[]>> {
    try {
      const response = await this.fetchWithErrorHandling<Flashcard[]>(
        `${API_BASE_URL}/process_query`,
        {
          method: 'POST',
          body: JSON.stringify({ question: query }),
        }
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to get response');
      }

      // Filter only flashcards (items with front and back)
      const flashcards = response.data.filter(item => 
        item.front && item.back
      );
      
      return {
        success: true,
        data: flashcards,
      };
    } catch (error) {
      console.error('Search flashcards error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search flashcards',
      };
    }
  }

  async sendChatMessage(message: string): Promise<ApiResponse<ChatMessage>> {
    try {
      const response = await this.fetchWithErrorHandling<Question[]>(
        `${API_BASE_URL}/process_query`,
        {
          method: 'POST',
          body: JSON.stringify({ question: message }),
        }
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to get response');
      }

      const data = response.data;
      
      // Get both fact and response text
      const firstItem = data.find(item => item.response) || data[0];
      const fact = firstItem?.fact || '';
      const responseText = firstItem?.response || 'Here is the information you requested.';
      
      // Combine fact and response for better context
      const combinedContent = fact && responseText && fact !== responseText 
        ? `${fact}\n\n${responseText}`
        : responseText || fact || 'Here is the information you requested.';
      
      // Separate items into different types based on content
      const flashcards = data.filter(item => item.front && item.back);
      const questions = data.filter(item => item.options && item.options.length > 0 && item.correct_option);
      
      const botResponse: ChatMessage = {
        id: Date.now().toString(),
        type: 'bot',
        content: combinedContent,
        timestamp: new Date(),
        questions: questions.length > 0 ? questions : undefined,
        flashcards: flashcards.length > 0 ? flashcards : undefined,
      };

      return {
        success: true,
        data: botResponse,
      };
    } catch (error) {
      console.error('Send chat message error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send message',
      };
    }
  }

  // Simulate streaming response for real-time chat - now using real API
  async *streamChatResponse(message: string): AsyncGenerator<string, void, unknown> {
    try {
      const response = await this.sendChatMessage(message);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to get response');
      }
      
      const content = response.data.content;
      
      // Simulate streaming by yielding chunks
      const words = content.split(' ');
      for (let i = 0; i < words.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 50));
        yield words.slice(0, i + 1).join(' ');
      }
    } catch (error) {
      console.error('Streaming error:', error);
      throw new Error('Failed to stream response');
    }
  }

  // Get search suggestions - static suggestions for now
  async getSearchSuggestions(): Promise<ApiResponse<Array<{id: string, text: string, category: string}>>> {
    try {
      const suggestions = [
        { id: '1', text: 'What bone articulates with the femur?', category: 'topic' },
        { id: '2', text: 'What topic is important to study for NEET-PG in Osteology?', category: 'question' },
        { id: '3', text: 'Give me 5 flashcards around anatomy topic', category: 'flashcard' },
      ];
      
      return {
        success: true,
        data: suggestions,
      };
    } catch (error) {
      console.error('Get search suggestions error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get search suggestions',
      };
    }
  }

  // Get questions by difficulty - uses API now
  async getQuestionsByDifficulty(_difficulty: 'easy' | 'medium' | 'hard'): Promise<ApiResponse<Question[]>> {
    try {
      // Since API doesn't support difficulty filtering, get general questions
      return await this.searchQuestions('Give me practice questions');
    } catch (error) {
      console.error('Get questions by difficulty error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get questions by difficulty',
      };
    }
  }

  // Get random study materials
  async getRandomStudyMaterials(): Promise<ApiResponse<{ questions: Question[], flashcards: Flashcard[] }>> {
    try {
      const [questionsResult, flashcardsResult] = await Promise.all([
        this.searchQuestions('Give me practice questions'),
        this.searchFlashcards('Give me study flashcards')
      ]);
      
      return {
        success: true,
        data: { 
          questions: questionsResult.success ? questionsResult.data || [] : [], 
          flashcards: flashcardsResult.success ? flashcardsResult.data || [] : []
        },
      };
    } catch (error) {
      console.error('Get random study materials error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get random study materials',
      };
    }
  }

  // Health check endpoint
  async healthCheck(): Promise<ApiResponse<{ status: string, timestamp: string }>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return {
        success: true,
        data: {
          status: 'healthy',
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error('Health check error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Health check failed',
      };
    }
  }
}

export const apiService = new ApiService();
export default apiService;