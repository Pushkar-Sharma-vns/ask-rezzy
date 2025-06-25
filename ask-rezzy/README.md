# Ask Rezzy

A React Native mobile application for interactive learning with AI-powered chat, flashcards, and quizzes.

## Tech Stack

- **React Native** - Mobile development framework
- **Expo** - Development platform and tools
- **TypeScript** - Type-safe JavaScript
- **Expo Router** - File-based navigation
- **React Query** - Data fetching and caching
- **AsyncStorage** - Local data persistence

## Features

- AI-powered chat interface
- Interactive flashcards
- Quiz functionality
- Chat session history
- Popular searches based on chat history
- Dynamic background themes

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI

### Setup

1. Clone the repository
```bash
git clone <repository-url>
cd ask-rezzy
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Run on device/simulator
```bash
# For development and testing on web(Recommended)
npx expo start --web
```

## Project Structure

```
app/
├── (tabs)/           # Tab navigation screens
│   ├── index.tsx     # Home screen
│   └── chat.tsx      # Chat history screen
├── (chat)/           # Chat session screens
│   └── [sessionId].tsx
components/
├── chat/             # Chat-related components
├── common/           # Shared components
└── ui/               # UI components
services/
└── api.ts            # API integration
types/
└── index.ts          # TypeScript definitions
```

## API Integration

### Base URL
- **Development**: `http://localhost:8000`
- **Production**: NA

### Endpoints

#### Process Query
Send chat messages and get AI responses.

**Request:**
```typescript
POST /process_query
Content-Type: application/json

{
  "question": "What bone articulates with the femur?",
  "chat_session_id": "session-123" // Optional
}
```

**Response:**
```typescript
{
  "response": [
    {
      "response": "The femur articulates with several bones...",
      "fact": "Additional fact about the femur",
      "front": "Question text",     // For flashcards
      "back": "Answer text",        // For flashcards
      "options": ["A", "B", "C"],   // For quiz questions
      "correct_option": "A"         // For quiz questions
    }
  ],
  "chat_session_id": "session-123",
  "response_number": 1
}
```

#### Get Chat Sessions
Retrieve paginated list of chat sessions.

**Request:**
```typescript
GET /chat_sessions?page=1&limit=10
```

**Response:**
```typescript
{
  "chat_sessions": [
    {
      "chat_session_id": "session-123",
      "title": "Anatomy Questions",
      "created_at": "2024-01-01T00:00:00Z",
      "response_count": 5
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 3,
    "has_next": true
  }
}
```

#### Get Chat Session Detail
Retrieve specific chat session with conversation history.

**Request:**
```typescript
GET /chat_sessions?chat_session_id=session-123
```

**Response:**
```typescript
{
  "chat_session_id": "session-123",
  "title": "Anatomy Questions",
  "created_at": "2024-01-01T00:00:00Z",
  "conversations": [
    {
      "What bone articulates with the femur?": [
        {
          "response": "The femur articulates with...",
          "fact": "Additional information"
        }
      ]
    }
  ]
}
```

## Configuration

Update API base URL in `services/api.ts`:
```typescript
const API_BASE_URL = __DEV__ ? 'http://localhost:8000' : 'https://your-production-api.com';
```

## Development

The app uses Expo Router for navigation with a tab-based structure. Chat sessions are managed with React Query for efficient data fetching and caching. Local storage is handled through AsyncStorage for chat session persistence.