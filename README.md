# Quiz App

## Features Implemented

### 1. User Authentication
- Users can register, log in, and log out.
- Secure user authentication using JWT tokens.
- Sessions are managed through cookies.

### 2. State Management with Redux
- The app uses Redux to manage global state.
- Ensures consistency across the app for user data, quiz progress, and results.

### 3. Quiz with Three Formats:
   - **Blitz Format**: Time-limited quizzes with rapid-fire questions.
   - **Bullet Format**: A multiple-choice question format with bullet-point answers.
   - **Classical Format**: Traditional quiz format with a detailed, step-by-step approach to answering.

### 4. Detailed Summary at the End of the Quiz
- After completing a quiz, users get a detailed summary of their performance.
- The summary includes:
  - The number of correct and incorrect answers.
  - Time spent on the quiz.
  - A list of all the answers with detailed explanations for each question.
  
## Tech Stack
- **Frontend**: React, Vite
- **Backend**: Node.js, Express
- **State Management**: Redux
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)


