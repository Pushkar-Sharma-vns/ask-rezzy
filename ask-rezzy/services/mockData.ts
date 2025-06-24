// services/mockData.ts

import { Question, Flashcard, SearchSuggestion, ApiResponse } from '@/types';

export const mockQuestions: Question[] = [
  {
    id: '1',
    topic: 'Anatomy',
    subtopic: 'Skeletal System',
    question: 'A student has hip pain locked while yawning. Which of the following muscles is attached to the articular disc of the temporomandibular joint?',
    type: 'multiple_choice',
    options: ['Medial pterygoid', 'Temporalis', 'Masseter', 'Lateral pterygoid'],
    correct_answer: 'Lateral pterygoid',
    difficulty: 'medium',
    tags: ['jaw', 'muscles', 'temporomandibular']
  },
  {
    id: '2',
    topic: 'Anatomy',
    subtopic: 'Bone Structure',
    question: 'Which of these two are the Os vs trans polymer?',
    type: 'multiple_choice',
    options: ['Cis configuration', 'Trans configuration', 'Both are same', 'Neither exists'],
    correct_answer: 'Trans configuration',
    difficulty: 'hard',
    tags: ['bone', 'polymer', 'structure']
  },
  {
    id: '3',
    topic: 'Osteology',
    subtopic: 'Bone Formation',
    question: 'What is the primary function of the patella?',
    type: 'multiple_choice',
    options: ['Knee protection', 'Muscle attachment', 'Joint stability', 'All of the above'],
    correct_answer: 'All of the above',
    difficulty: 'easy',
    tags: ['patella', 'knee', 'function']
  },
  {
    id: '4',
    topic: 'Anatomy',
    subtopic: 'Pelvic Girdle',
    question: 'Which bones form the pelvic girdle?',
    type: 'short_answer',
    correct_answer: 'Ilium, Ischium, and Pubis',
    difficulty: 'medium',
    tags: ['pelvic', 'girdle', 'bones']
  },
  {
    id: '5',
    topic: 'Anatomy',
    subtopic: 'Bone Types',
    question: 'What are the major types of bone fractures?',
    type: 'short_answer',
    correct_answer: 'Simple, Compound, Greenstick, Comminuted',
    difficulty: 'medium',
    tags: ['fractures', 'bone', 'types']
  },
  {
    id: '6',
    topic: 'Anatomy',
    subtopic: 'Bone Density',
    question: 'How does osteoporosis affect bone density?',
    type: 'multiple_choice',
    options: ['Increases density', 'Decreases density', 'No effect', 'Varies by location'],
    correct_answer: 'Decreases density',
    difficulty: 'easy',
    tags: ['osteoporosis', 'density', 'bones']
  },
  {
    id: '7',
    topic: 'NEET-PG',
    subtopic: 'Osteology',
    question: 'Which test best serves the purpose of diagnosing osteoporosis?',
    type: 'multiple_choice',
    options: ['X-ray', 'DEXA scan', 'MRI', 'CT scan'],
    correct_answer: 'DEXA scan',
    difficulty: 'medium',
    tags: ['osteoporosis', 'diagnosis', 'DEXA']
  },
  {
    id: '8',
    topic: 'Anatomy',
    subtopic: 'Joint Structure',
    question: 'What type of joint is the temporomandibular joint?',
    type: 'multiple_choice',
    options: ['Hinge joint', 'Ball and socket', 'Condylar joint', 'Pivot joint'],
    correct_answer: 'Condylar joint',
    difficulty: 'medium',
    tags: ['TMJ', 'joint', 'anatomy']
  },
  {
    id: '9',
    topic: 'Osteology',
    subtopic: 'Bone Healing',
    question: 'What is the first stage of bone fracture healing?',
    type: 'multiple_choice',
    options: ['Callus formation', 'Hematoma formation', 'Remodeling', 'Union'],
    correct_answer: 'Hematoma formation',
    difficulty: 'easy',
    tags: ['fracture', 'healing', 'stages']
  },
  {
    id: '10',
    topic: 'Anatomy',
    subtopic: 'Muscle Attachment',
    question: 'Which muscle is NOT attached to the mandible?',
    type: 'multiple_choice',
    options: ['Masseter', 'Temporalis', 'Pterygoid', 'Sternocleidomastoid'],
    correct_answer: 'Sternocleidomastoid',
    difficulty: 'medium',
    tags: ['mandible', 'muscles', 'attachment']
  }
];

export const mockFlashcards: Flashcard[] = [
  {
    id: 'f1',
    topic: 'Anatomy',
    subtopic: 'Skeletal System',
    front: 'Which of these two are the Os vs trans polymer?',
    back: 'In bone matrix, collagen fibers can exist in different configurations. Trans polymers have a more stable, extended conformation compared to cis polymers.',
    difficulty: 'medium',
    tags: ['bones', 'polymer', 'structure']
  },
  {
    id: 'f2',
    topic: 'Osteology',
    subtopic: 'Bone Density',
    front: 'How does osteoporosis affect bone density?',
    back: 'Osteoporosis decreases bone mineral density, making bones more fragile and susceptible to fractures. It primarily affects trabecular bone.',
    difficulty: 'easy',
    tags: ['osteoporosis', 'density', 'bones']
  },
  {
    id: 'f3',
    topic: 'NEET-PG',
    subtopic: 'Anatomy',
    front: 'What topic is important to study for NEET-PG in Osteology?',
    back: 'Bone formation, bone remodeling, fracture healing, metabolic bone diseases, and joint anatomy are crucial topics for NEET-PG.',
    difficulty: 'medium',
    tags: ['NEET-PG', 'osteology', 'study']
  },
  {
    id: 'f4',
    topic: 'Anatomy',
    subtopic: 'Bone Structure',
    front: 'What are the main components of bone matrix?',
    back: 'Bone matrix consists of organic components (collagen fibers, proteoglycans) and inorganic components (hydroxyapatite crystals containing calcium and phosphate).',
    difficulty: 'medium',
    tags: ['bone', 'matrix', 'composition']
  },
  {
    id: 'f5',
    topic: 'Osteology',
    subtopic: 'Bone Cells',
    front: 'What are the three main types of bone cells?',
    back: 'Osteoblasts (bone-forming cells), Osteocytes (mature bone cells), and Osteoclasts (bone-resorbing cells).',
    difficulty: 'easy',
    tags: ['bone', 'cells', 'types']
  },
  {
    id: 'f6',
    topic: 'Anatomy',
    subtopic: 'Joint Classification',
    front: 'How are joints classified based on movement?',
    back: 'Joints are classified as: Synovial (freely movable), Cartilaginous (slightly movable), and Fibrous (immovable).',
    difficulty: 'medium',
    tags: ['joints', 'classification', 'movement']
  },
  {
    id: 'f7',
    topic: 'NEET-PG',
    subtopic: 'Fractures',
    front: 'What is a Colles fracture?',
    back: 'A Colles fracture is a fracture of the distal radius, typically occurring when falling on an outstretched hand. It causes characteristic "dinner fork" deformity.',
    difficulty: 'hard',
    tags: ['fracture', 'radius', 'Colles']
  },
  {
    id: 'f8',
    topic: 'Anatomy',
    subtopic: 'Muscle Physiology',
    front: 'What is the role of calcium in muscle contraction?',
    back: 'Calcium binds to troponin, causing conformational changes that expose myosin-binding sites on actin, allowing cross-bridge formation and muscle contraction.',
    difficulty: 'hard',
    tags: ['calcium', 'muscle', 'contraction']
  }
];

export const mockSearchSuggestions: SearchSuggestion[] = [
  {
    id: 's1',
    text: 'What bone articulates with the femur?',
    category: 'topic'
  },
  {
    id: 's2',
    text: 'What topic is important to study for NEET-PG in Osteology?',
    category: 'question'
  },
  {
    id: 's3',
    text: 'Which best serves the purpose of osteology?',
    category: 'flashcard'
  },
  {
    id: 's4',
    text: 'How does osteoporosis affect bone density?',
    category: 'topic'
  },
  {
    id: 's5',
    text: 'What are the major types of bone fractures?',
    category: 'question'
  },
  {
    id: 's6',
    text: 'Which bones form the pelvic girdle?',
    category: 'topic'
  },
  {
    id: 's7',
    text: 'Temporomandibular joint anatomy and function',
    category: 'flashcard'
  },
  {
    id: 's8',
    text: 'Bone healing process and stages',
    category: 'question'
  },
  {
    id: 's9',
    text: 'Difference between osteoblasts and osteoclasts',
    category: 'topic'
  },
  {
    id: 's10',
    text: 'Joint classification and types of movement',
    category: 'flashcard'
  }
];

// Helper functions for API simulation
export const getQuestionsByTopic = (topic: string): Question[] => {
  try {
    return mockQuestions.filter(question => 
      question.topic.toLowerCase().includes(topic.toLowerCase()) ||
      question.subtopic.toLowerCase().includes(topic.toLowerCase()) ||
      question.tags.some(tag => tag.toLowerCase().includes(topic.toLowerCase()))
    );
  } catch (error) {
    console.error('Error filtering questions by topic:', error);
    return [];
  }
};

export const getFlashcardsByTopic = (topic: string): Flashcard[] => {
  try {
    return mockFlashcards.filter(flashcard => 
      flashcard.topic.toLowerCase().includes(topic.toLowerCase()) ||
      flashcard.subtopic.toLowerCase().includes(topic.toLowerCase()) ||
      flashcard.tags.some(tag => tag.toLowerCase().includes(topic.toLowerCase()))
    );
  } catch (error) {
    console.error('Error filtering flashcards by topic:', error);
    return [];
  }
};

export const getQuestionsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): Question[] => {
  try {
    return mockQuestions.filter(question => question.difficulty === difficulty);
  } catch (error) {
    console.error('Error filtering questions by difficulty:', error);
    return [];
  }
};

export const getRandomQuestions = (count: number = 5): Question[] => {
  try {
    const shuffled = [...mockQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  } catch (error) {
    console.error('Error getting random questions:', error);
    return mockQuestions.slice(0, count);
  }
};

export const getRandomFlashcards = (count: number = 5): Flashcard[] => {
  try {
    const shuffled = [...mockFlashcards].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  } catch (error) {
    console.error('Error getting random flashcards:', error);
    return mockFlashcards.slice(0, count);
  }
};

export const searchContent = (query: string): { questions: Question[], flashcards: Flashcard[] } => {
  try {
    const lowerQuery = query.toLowerCase();
    
    const matchingQuestions = mockQuestions.filter(question =>
      question.question.toLowerCase().includes(lowerQuery) ||
      question.topic.toLowerCase().includes(lowerQuery) ||
      question.subtopic.toLowerCase().includes(lowerQuery) ||
      question.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );

    const matchingFlashcards = mockFlashcards.filter(flashcard =>
      flashcard.front.toLowerCase().includes(lowerQuery) ||
      flashcard.back.toLowerCase().includes(lowerQuery) ||
      flashcard.topic.toLowerCase().includes(lowerQuery) ||
      flashcard.subtopic.toLowerCase().includes(lowerQuery) ||
      flashcard.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );

    return {
      questions: matchingQuestions,
      flashcards: matchingFlashcards
    };
  } catch (error) {
    console.error('Error searching content:', error);
    return {
      questions: [],
      flashcards: []
    };
  }
};