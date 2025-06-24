
import { useState, useCallback } from 'react';
import { Question, QuizSession } from '@/types/index';

export const useQuiz = () => {
  const [currentQuiz, setCurrentQuiz] = useState<QuizSession | null>(null);

  const startQuiz = useCallback((questions: Question[]) => {
    try {
      if (!questions || questions.length === 0) {
        throw new Error('No questions provided for quiz');
      }

      const newQuiz: QuizSession = {
        id: Date.now().toString(),
        questions,
        currentQuestionIndex: 0,
        answers: {},
        completed: false,
      };

      setCurrentQuiz(newQuiz);
    } catch (error) {
      console.error('Start quiz error:', error);
    }
  }, []);

  const submitAnswer = useCallback((questionId: string, answer: string) => {
    try {
      if (!currentQuiz) {
        throw new Error('No active quiz session');
      }

      setCurrentQuiz(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          answers: {
            ...prev.answers,
            [questionId]: answer,
          },
        };
      });
    } catch (error) {
      console.error('Submit answer error:', error);
    }
  }, [currentQuiz]);

  const nextQuestion = useCallback(() => {
    try {
      if (!currentQuiz) {
        throw new Error('No active quiz session');
      }

      setCurrentQuiz(prev => {
        if (!prev) return null;
        
        const nextIndex = prev.currentQuestionIndex + 1;
        
        return {
          ...prev,
          currentQuestionIndex: nextIndex,
          completed: nextIndex >= prev.questions.length,
        };
      });
    } catch (error) {
      console.error('Next question error:', error);
    }
  }, [currentQuiz]);

  const finishQuiz = useCallback(() => {
    try {
      if (!currentQuiz) {
        throw new Error('No active quiz session');
      }

      // Calculate score
      let correctAnswers = 0;
      currentQuiz.questions.forEach(question => {
        if (currentQuiz.answers[question.id] === question.correct_answer) {
          correctAnswers++;
        }
      });

      const score = Math.round((correctAnswers / currentQuiz.questions.length) * 100);

      setCurrentQuiz(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          score,
          completed: true,
        };
      });
    } catch (error) {
      console.error('Finish quiz error:', error);
    }
  }, [currentQuiz]);

  const resetQuiz = useCallback(() => {
    setCurrentQuiz(null);
  }, []);

  return {
    currentQuiz,
    startQuiz,
    submitAnswer,
    nextQuestion,
    finishQuiz,
    resetQuiz,
  };
};