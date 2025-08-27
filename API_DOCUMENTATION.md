# Quiz Platform API Documentation

## Enhanced Quiz Submission Functionality

### POST /api/results
**Description**: Submit a completed quiz and get results

**Authentication**: Required (JWT Token)

**Request Body**:
```json
{
  "quizId": "string", // MongoDB ObjectId of the quiz
  "answers": [
    {
      "questionId": "string", // MongoDB ObjectId of the question
      "selectedOptionIds": ["string"] // Array of MongoDB ObjectIds of selected options
    }
  ],
  "timeTaken": "number" // Time taken in seconds
}
```

**Response**:
```json
{
  "result": {
    "_id": "string", // MongoDB ObjectId of the result
    "user": "string", // MongoDB ObjectId of the user
    "quiz": "string", // MongoDB ObjectId of the quiz
    "score": "number", // Points earned
    "totalPoints": "number", // Total possible points
    "answers": [
      {
        "question": "string", // MongoDB ObjectId of the question
        "selectedOptions": ["string"], // Array of MongoDB ObjectIds of selected options
        "isCorrect": "boolean", // Whether the answer is correct
        "pointsEarned": "number" // Points earned for this question
      }
    ],
    "timeTaken": "number", // Time taken in seconds
    "completedAt": "date" // Date when the quiz was completed
  },
  "userStats": {
    "completedQuizzes": "number", // Number of quizzes completed
    "averageScore": "number", // Average score percentage
    "totalPoints": "number", // Total points earned
    "ranking": "number" // User ranking
  },
  "correctAnswers": [
    {
      "questionId": "string", // MongoDB ObjectId of the question
      "correctOptionIds": ["string"] // Array of MongoDB ObjectIds of correct options
    }
  ]
}
```

**Error Responses**:
- 400 Bad Request: Invalid input data
- 401 Unauthorized: User not authenticated
- 404 Not Found: Quiz not found
- 500 Internal Server Error: Server error

### GET /api/results/stats/:userId
**Description**: Get user statistics

**Authentication**: Required (JWT Token)

**Parameters**:
- userId: MongoDB ObjectId of the user

**Response**:
```json
{
  "completedQuizzes": "number", // Number of quizzes completed
  "averageScore": "number", // Average score percentage
  "totalPoints": "number", // Total points earned
  "ranking": "number" // User ranking
}
```

**Error Responses**:
- 401 Unauthorized: User not authenticated
- 403 Forbidden: User not authorized to view these stats
- 404 Not Found: User not found
- 500 Internal Server Error: Server error

## Authentication API

### POST /api/auth/register
**Description**: Register a new user

**Request Body**:
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response**:
```json
{
  "_id": "string", // MongoDB ObjectId of the user
  "name": "string",
  "email": "string",
  "role": "string", // "user" or "admin"
  "stats": {
    "completedQuizzes": "number", // Number of quizzes completed
    "averageScore": "number", // Average score percentage
    "totalPoints": "number", // Total points earned
    "ranking": "number", // User ranking
    "lastUpdated": "date" // Date when stats were last updated
  },
  "token": "string" // JWT token
}
```

### POST /api/auth/login
**Description**: Login a user

**Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```

**Response**:
```json
{
  "_id": "string", // MongoDB ObjectId of the user
  "name": "string",
  "email": "string",
  "role": "string", // "user" or "admin"
  "stats": {
    "completedQuizzes": "number", // Number of quizzes completed
    "averageScore": "number", // Average score percentage
    "totalPoints": "number", // Total points earned
    "ranking": "number", // User ranking
    "lastUpdated": "date" // Date when stats were last updated
  },
  "token": "string" // JWT token
}
```

### GET /api/auth/profile
**Description**: Get user profile

**Authentication**: Required (JWT Token)

**Response**:
```json
{
  "_id": "string", // MongoDB ObjectId of the user
  "name": "string",
  "email": "string",
  "role": "string", // "user" or "admin"
  "stats": {
    "completedQuizzes": "number", // Number of quizzes completed
    "averageScore": "number", // Average score percentage
    "totalPoints": "number", // Total points earned
    "ranking": "number", // User ranking
    "lastUpdated": "date" // Date when stats were last updated
  }
}
```

## Key Enhancements

1. **Robust Validation**: Input validation for quiz submissions to ensure data integrity
2. **Accurate Score Calculation**: Enhanced logic for comparing answers and calculating scores
3. **Atomic Database Operations**: Transactions ensure consistent database state
4. **User Statistics**: Comprehensive tracking of user performance metrics
5. **Structured Response**: Detailed response with results, statistics, and correct answers
6. **Error Handling**: Improved error handling with descriptive messages
7. **Leaderboard Calculations**: Accurate ranking based on points and quiz completion
8. **Performance Metrics**: Tracking of completed quizzes, average scores, and total points