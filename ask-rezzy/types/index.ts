// types/index.ts

export interface Question {
  fact: string;
  response: string;
  question: string;
  options: string[];
  correct_option: string;
  front: string;
  back: string;
  subject: string;
  topic: string;
}

export interface Flashcard {
  fact: string;
  response: string;
  question: string;
  options: string[];
  correct_option: string;
  front: string;
  back: string;
  subject: string;
  topic: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  questions?: Question[];
  flashcards?: Flashcard[];
  isStreaming?: boolean;
}

export interface QuizSession {
  id: string;
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<string, string>;
  score?: number;
  completed: boolean;
}

export interface SearchSuggestion {
  id: string;
  text: string;
  category: 'topic' | 'question' | 'flashcard';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ChatApiResponse {
  response: Question[];
  chat_session_id: string;
  response_number: number;
}

export interface ChatSession {
  chat_session_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  response_count: number;
}

export interface ChatSessionDetail {
  chat_session_id: string;
  title: string;
  conversations: Record<string, any>[];
  summary: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatSessionsPaginatedResponse {
  chat_sessions: ChatSession[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    limit: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export type ChatContext = {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<void>;
  clearChat: () => void;
};

export type QuizContext = {
  currentQuiz: QuizSession | null;
  startQuiz: (questions: Question[]) => void;
  submitAnswer: (questionId: string, answer: string) => void;
  nextQuestion: () => void;
  finishQuiz: () => void;
  resetQuiz: () => void;
};