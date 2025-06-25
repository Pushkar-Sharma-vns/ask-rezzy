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