# Design Documentation

## Component Breakdown

### Main Screens

#### Home Screen (`app/(tabs)/index.tsx`)
- **Purpose**: Main landing page with chat interface and popular searches
- **Features**:
  - Dynamic background (ImageBackground for welcome, LinearGradient for chat)
  - Popular searches based on chat session history (top 3 by response count)
  - Action buttons for PYQs and flashcards
  - Real-time chat interface
- **Key Components**: RezzyAvatar, SearchSuggestions, ActionButtons, ChatMessage, ChatInput

#### Chat History Screen (`app/(tabs)/chat.tsx`)
- **Purpose**: Display paginated list of past chat sessions
- **Features**:
  - Pull-to-refresh functionality
  - Load more pagination
  - Delete chat sessions
  - Navigate to specific chat sessions
- **Key Components**: Header, MenuModal, Card

#### Chat Session Screen (`app/(chat)/[sessionId].tsx`)
- **Purpose**: Individual chat session with conversation history
- **Features**:
  - Load existing conversation history
  - Continue conversation in existing session
  - Custom header with back navigation
  - Menu modal for actions
- **Key Components**: ChatMessage, ChatInput, MenuModal

### Chat Components (`components/chat/`)

#### ChatMessage (`ChatMessage.tsx`)
- **Purpose**: Display individual chat messages (user/bot)
- **Features**:
  - Bot messages with Rezzy avatar
  - Render questions and flashcards
  - User message bubbles
- **Props**: `message`, `onStartQuiz`

#### ChatInput (`ChatInput.tsx`)
- **Purpose**: Input field for sending messages
- **Features**:
  - Send button with icon
  - Disabled state during loading
  - Dynamic placeholder text
- **Props**: `onSendMessage`, `disabled`, `placeholder`

#### FlashCard (`FlashCard.tsx`)
- **Purpose**: Interactive flashcard component
- **Features**:
  - Flip functionality (show back below front)
  - Dynamic count display
  - Front/Back labels
  - One-time reveal (button hides after flip)
- **Props**: `flashcard`, `currentIndex`, `totalCount`

#### QuizCard (`QuizCard.tsx`)
- **Purpose**: Display quiz questions with options
- **Features**:
  - Multiple choice options
  - Start quiz functionality
  - Interactive question display
- **Props**: `questions`, `onStartQuiz`, `interactive`

#### QuizOption (`QuizOption.tsx`)
- **Purpose**: Individual quiz option component
- **Features**:
  - Selectable options
  - Visual feedback for selection
- **Props**: `option`, `isSelected`, `onSelect`

### Common Components (`components/common/`)

#### Header (`Header.tsx`)
- **Purpose**: Standard app header with title and menu
- **Features**:
  - Dynamic title
  - Menu button integration
- **Props**: `title`, `onMenuPress`

#### MenuModal (`MenuModal.tsx`)
- **Purpose**: Modal with navigation options
- **Features**:
  - Start new chat
  - View past chats
  - Modal overlay with backdrop
- **Props**: `visible`, `onClose`, `onStartNewChat`, `onViewPastChats`

#### SearchSuggestions (`SearchSuggestions.tsx`)
- **Purpose**: Display popular/suggested searches
- **Features**:
  - Category badges (topic, question, flashcard)
  - Scrollable list
  - Dynamic suggestions from chat history
- **Props**: `suggestions`, `onSuggestionPress`, `title`

#### ActionButtons (`ActionButtons.tsx`)
- **Purpose**: Quick action buttons for common tasks
- **Features**:
  - Find PYQs button
  - Flashcards button
- **Props**: `onFindPYQs`, `onFlashcards`

#### RezzyAvatar (`RezzyAvatar.tsx`)
- **Purpose**: AI assistant avatar component
- **Features**:
  - Consistent branding
  - Reusable across chat interfaces

### UI Components (`components/ui/`)

#### Card (`Card.tsx`)
- **Purpose**: Reusable card container with consistent styling
- **Props**: `style`, `children`

#### Button (`Button.tsx`)
- **Purpose**: Standardized button component
- **Props**: `title`, `onPress`, `style`, `disabled`

#### Input (`Input.tsx`)
- **Purpose**: Text input with consistent styling
- **Props**: `value`, `onChangeText`, `placeholder`, `style`

### Hooks

#### useChat (`hooks/useChat.ts`)
- **Purpose**: Manage chat state and API interactions
- **Features**:
  - Send messages with session management
  - Message state management
  - Loading and error handling
  - Session persistence with AsyncStorage
  - Clear chat functionality
- **Returns**: `messages`, `isLoading`, `error`, `sendMessage`, `clearChat`

#### useQuiz (`hooks/useQuiz.ts`)
- **Purpose**: Manage quiz functionality and state
- **Features**:
  - Start quiz with questions
  - Quiz state management
- **Returns**: `startQuiz`, quiz state

### Express Routes (API Endpoints)

#### POST `/process_query`
- **Purpose**: Process chat messages and return AI responses
- **Features**:
  - Handle new chat sessions
  - Continue existing sessions
  - Return mixed content (text, flashcards, questions)
- **Input**: `question`, `chat_session_id` (optional)
- **Output**: `response[]`, `chat_session_id`, `response_number`

#### GET `/chat_sessions`
- **Purpose**: Retrieve paginated chat sessions or specific session details
- **Query Params**:
  - `page`, `limit` - For pagination
  - `chat_session_id` - For specific session details
- **Output**: Chat sessions list with pagination or session detail with conversations

### Vector Search Utilities

Based on the API structure, the backend likely implements:

#### Semantic Search
- **Purpose**: Find relevant content based on question similarity
- **Implementation**: Vector embeddings for questions and responses
- **Usage**: Matching user queries to existing knowledge base

#### Content Classification
- **Purpose**: Categorize responses into flashcards, questions, or text
- **Features**:
  - Detect flashcard content (front/back pairs)
  - Identify quiz questions (options/correct_option)
  - Extract factual information

#### Session Context Management
- **Purpose**: Maintain conversation context across messages
- **Features**:
  - Link related questions in same session
  - Build conversation history
  - Generate session titles from content