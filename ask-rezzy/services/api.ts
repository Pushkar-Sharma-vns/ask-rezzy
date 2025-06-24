// services/api.ts

import { Question, Flashcard, ChatMessage, ApiResponse } from '@/types/index';
import { 
  mockQuestions, 
  mockFlashcards, 
  mockSearchSuggestions,
  getQuestionsByTopic,
  getFlashcardsByTopic,
  getRandomQuestions,
  getRandomFlashcards,
  searchContent
} from './mockData';

const API_BASE_URL = __DEV__ ? 'http://localhost:3000/api' : 'https://your-production-api.com/api';

class ApiService {
  private async fetchWithErrorHandling<T>(
    url: string, 
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

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
      // Use mock data with intelligent filtering
      let questions: Question[] = [];
      
      if (query.toLowerCase().includes('anatomy') || query.toLowerCase().includes('bone')) {
        questions = getQuestionsByTopic('anatomy');
      } else if (query.toLowerCase().includes('pyq') || query.toLowerCase().includes('question')) {
        questions = getRandomQuestions(5);
      } else if (query.toLowerCase().includes('osteology')) {
        questions = getQuestionsByTopic('osteology');
      } else if (query.toLowerCase().includes('fracture')) {
        questions = getQuestionsByTopic('fracture');
      } else if (query.toLowerCase().includes('joint') || query.toLowerCase().includes('tmj')) {
        questions = getQuestionsByTopic('joint');
      } else {
        // General search
        const searchResults = searchContent(query);
        questions = searchResults.questions.length > 0 ? searchResults.questions : getRandomQuestions(5);
      }

      // Limit to 5 questions max
      questions = questions.slice(0, 5);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
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
      // Use mock data with intelligent filtering
      let flashcards: Flashcard[] = [];
      
      if (query.toLowerCase().includes('anatomy') || query.toLowerCase().includes('bone')) {
        flashcards = getFlashcardsByTopic('anatomy');
      } else if (query.toLowerCase().includes('flashcard')) {
        flashcards = getRandomFlashcards(5);
      } else if (query.toLowerCase().includes('osteology')) {
        flashcards = getFlashcardsByTopic('osteology');
      } else if (query.toLowerCase().includes('joint')) {
        flashcards = getFlashcardsByTopic('joint');
      } else if (query.toLowerCase().includes('neet')) {
        flashcards = getFlashcardsByTopic('NEET-PG');
      } else {
        // General search
        const searchResults = searchContent(query);
        flashcards = searchResults.flashcards.length > 0 ? searchResults.flashcards : getRandomFlashcards(5);
      }

      // Limit to 5 flashcards max
      flashcards = flashcards.slice(0, 5);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
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
      // Mock streaming response with intelligent content
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Determine response type based on message content
      let responseContent = '';
      let questions: Question[] = [];
      let flashcards: Flashcard[] = [];

      if (message.toLowerCase().includes('pyq') || message.toLowerCase().includes('question')) {
        responseContent = 'The bones that articulate with the femur are the tibia on the distal end of the femur and the ilium, ischium, and pubis. Here are 5 questions around it!';
        const searchResult = await this.searchQuestions(message);
        questions = searchResult.success ? searchResult.data || [] : [];
      } else if (message.toLowerCase().includes('flashcard')) {
        responseContent = 'The bones that articulate with the femur are the tibia on the distal end of the femur and the ilium, ischium, and pubis. Here are 5 flashcards around it!';
        const searchResult = await this.searchFlashcards(message);
        flashcards = searchResult.success ? searchResult.data || [] : [];
      } else {
        // General query - provide both questions and flashcards
        responseContent = 'The bones that articulate with the femur are the tibia on the distal end of the femur and the ilium, ischium, and pubis. Here are some study materials!';
        const [questionsResult, flashcardsResult] = await Promise.all([
          this.searchQuestions(message),
          this.searchFlashcards(message)
        ]);
        questions = questionsResult.success ? questionsResult.data || [] : [];
        flashcards = flashcardsResult.success ? flashcardsResult.data || [] : [];
      }

      const botResponse: ChatMessage = {
        id: Date.now().toString(),
        type: 'bot',
        content: responseContent,
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

  // Simulate streaming response for real-time chat
  async *streamChatResponse(message: string): AsyncGenerator<string, void, unknown> {
    try {
      let response = '';
      
      // Generate contextual response based on message
      if (message.toLowerCase().includes('pyq') || message.toLowerCase().includes('question')) {
        response = 'The bones that articulate with the femur are the tibia on the distal end of the femur and the ilium, ischium, and pubis. Here are 5 questions around it!';
      } else if (message.toLowerCase().includes('flashcard')) {
        response = 'The bones that articulate with the femur are the tibia on the distal end of the femur and the ilium, ischium, and pubis. Here are 5 flashcards around it!';
      } else if (message.toLowerCase().includes('anatomy')) {
        response = 'Great! Let me help you with anatomy topics. The skeletal system is fundamental to understanding human anatomy.';
      } else if (message.toLowerCase().includes('osteology')) {
        response = 'Osteology is the study of bones. Key topics include bone formation, remodeling, and pathology.';
      } else if (message.toLowerCase().includes('neet')) {
        response = 'For NEET-PG preparation, focus on high-yield topics in anatomy, physiology, and pathology.';
      } else {
        response = `Here's what I found related to "${message}": The bones that articulate with the femur are the tibia on the distal end of the femur and the ilium, ischium, and pubis.`;
      }
      
      // Simulate streaming by yielding chunks
      const words = response.split(' ');
      for (let i = 0; i < words.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 50));
        yield words.slice(0, i + 1).join(' ');
      }
    } catch (error) {
      console.error('Streaming error:', error);
      throw new Error('Failed to stream response');
    }
  }

  // Get search suggestions
  async getSearchSuggestions(): Promise<ApiResponse<typeof mockSearchSuggestions>> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return {
        success: true,
        data: mockSearchSuggestions,
      };
    } catch (error) {
      console.error('Get search suggestions error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get search suggestions',
      };
    }
  }

  // Get questions by difficulty
  async getQuestionsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Promise<ApiResponse<Question[]>> {
    try {
      const filteredQuestions = mockQuestions.filter(q => q.difficulty === difficulty);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return {
        success: true,
        data: filteredQuestions,
      };
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
      const questions = getRandomQuestions(3);
      const flashcards = getRandomFlashcards(3);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      return {
        success: true,
        data: { questions, flashcards },
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