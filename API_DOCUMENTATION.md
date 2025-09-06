# Quiz App Backend Documentation

## Overview
A RESTful API backend for a Quiz Application built with Node.js, Express.js, PostgreSQL, and Sequelize ORM. Supports user authentication (JWT & Google OAuth), quiz management, analytics, and role-based access.

---

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- PostgreSQL database
- npm (comes with Node.js)

### Installation
1. Clone the repository:
  ```powershell
  git clone https://github.com/Bendifallah-Rami/Quiz-App-back.git
  cd Quiz-App-back
  ```
2. Install dependencies:
  ```powershell
  npm install
  ```
3. Configure environment variables:
  - Copy `.env.example` to `.env` and fill in your database, JWT, and Google OAuth credentials.
4. Run database migrations:
  ```powershell
  npx sequelize-cli db:migrate
  ```
5. (Optional) Seed the database:
  ```powershell
  npx sequelize-cli db:seed:all
  ```
6. Start the server:
  ```powershell
  npm start
  ```

### Usage
1. Use Postman or any API client to interact with endpoints (see API documentation below).
2. Register and log in to obtain a JWT token (sent as a cookie).
3. For protected/admin routes, ensure your user has the correct role and the token is set.
4. For Google OAuth, configure credentials in `.env` and use `/api/auth/google`.

### Testing
Run automated tests:
```powershell
npm test
```

### Contribution
- Fork the repository and create a feature branch.
- Submit pull requests with clear descriptions.
- Follow code style and add tests for new features.

### Troubleshooting
- Check `.env` configuration for DB and JWT issues.
- Use `npm run dev` for development with auto-reload.
- Review error messages for details.

### Support
- For questions, open an issue on GitHub or contact the maintainer.

---

## Features
- User authentication (JWT, Google OAuth)
- Role-based access (student, teacher, admin)
- Quiz, question, option, category, tag management
- Quiz attempts, scoring, and streak tracking
- User statistics and analytics
- Admin analytics endpoints

---

## Main Files & Structure
- `server.js`: Express app setup, middleware, routes, error handling, server start
- `config/`: DB, passport, environment config
- `controllers/`: Business logic for resources
- `middleware/`: Auth and role-based access
- `models/`: Sequelize models
- `routes/`: Express route definitions
- `migrations/`: DB schema migrations
- `services/`: Utility services (e.g., email)
- `utils/`: Helper functions

---

## Database Models
- **User**: id, name, email, passwordHash, role, Google OAuth fields
- **UserStats**: userId, totalScore, quizzesTaken, quizzesPassed, currentStreak, longestStreak, lastActivityDate
- **Category**: id, name
- **Quiz**: id, title, description, categoryId, createdBy, difficulty, passingScore, status
- **Tag**: id, name
- **QuizTag**: id, quizId, tagId
- **Question**: id, quizId, text, type, points, explanation
- **Option**: id, questionId, text, isCorrect
- **QuizAttempt**: id, userId, quizId, score
- **AttemptAnswer**: id, quizAttemptId, questionId, selectedOptionIds, answer, isCorrect

---

## Authentication & Authorization
- JWT-based authentication, token sent via cookie
- Google OAuth via Passport.js
- Role-based access: `requireAdmin` and teacher also middleware for admin endpoints

---

## Routes & Endpoints

### Auth
- `POST /api/auth/register` — Register user `{ name, email, password }`
- `POST /api/auth/login` — Login `{ email, password }` → `{ token, user }`
- `GET /api/auth/confirm-email/:token` — Confirm email
- `POST /api/auth/resend-confirmation` — Resend confirmation `{ email }`
- `POST /api/auth/logout` — Logout (token required)
- `GET /api/auth/profile` — Get profile (token required)
- `GET /api/auth/google` — Google OAuth login
- `GET /api/auth/google/callback` — Google OAuth callback
- `POST /api/auth/register-admin` — Register admin `{ name, email, password }`

### Users
- `GET /api/users` — List users
- `POST /api/users` — Create user
- `GET /api/users/:id` — Get user by ID
- `PUT /api/users/:id` — Update user
- `DELETE /api/users/:id` — Delete user

### Quizzes
- `GET /api/quizzes` — List quizzes
- `POST /api/quizzes` — Create quiz
- `GET /api/quizzes/:id` — Get quiz by ID
- `PUT /api/quizzes/:id` — Update quiz
- `DELETE /api/quizzes/:id` — Delete quiz

### Categories
- `GET /api/categories` — List categories
- `GET /api/categories/quiz/:id` — Get specific category with associated quiz
- `GET /api/categories/:id` — Get category by ID
- `POST /api/categories` — Create new category (admin only), body: `{ name }`
- `PUT /api/categories/:id` — Update category (admin only), body: `{ name }`
- `DELETE /api/categories/:id` — Delete category (admin only)

### Tags
- `GET /api/tags` — List tags
- `GET /api/tags/quiz/:id` — Get tag with associated quizzes
- `GET /api/tags/:id` — Get tag by ID
- `POST /api/tags` — Create tag (admin only), body: `{ name }`
- `PUT /api/tags/:id` — Update tag (admin only), body: `{ name }`
- `DELETE /api/tags/:id` — Delete tag (admin only)

### QuizTag
- `GET /api/quizeTag` — List quiz-tag relations (admin only)
- `POST /api/quizeTag` — Create quiz-tag relation (admin only), body: `{ quizId, tagId }`
- `GET /api/quizeTag/:id` — Get quiz-tag by ID (admin only)
- `PUT /api/quizeTag/:id` — Update quiz-tag by ID (admin only), body: `{ quizId?, tagId? }`
- `DELETE /api/quizeTag/:id` — Delete quiz-tag by ID (admin only)

### Options
- `GET /api/options` — List options
- `POST /api/options` — Create option (admin only), body: `{ questionId, text, isCorrect }`
- `GET /api/options/question/:questionId` — Get options for a question (admin only)
- `GET /api/options/:id` — Get option by ID (admin only)
- `PUT /api/options/:id` — Update option by ID (admin only), body: `{ text?, isCorrect? }`
- `DELETE /api/options/:id` — Delete option by ID (admin only)

### QuizAttempts
- `GET /api/quizAttempts` — List quiz attempts
- `POST /api/quizAttempts` — Create quiz attempt, body: `{ userId, quizId, answers }`
- `GET /api/quizAttempts/quiz/:quizId` — Get all attempts for a quiz
- `GET /api/quizAttempts/user/:userId` — Get all attempts for a user
- `GET /api/quizAttempts/:id` — Get attempt details

### UserStats
- `GET /api/userStats` — List user stats
- `GET /api/userStats/:userId` — Get stats for a user
- `PUT /api/userStats/:userId` — Update stats for a user, body: `{ quizzesTaken?, quizzesPassed?, totalScore?, currentStreak?, longestStreak?, lastActivityDate? }`
- `POST /api/userStats` — Create stats for a user, body: `{ userId, ... }`

### Admin Analytics (admin only)
- `GET /api/admin-analytics/overview` — `{ totalUsers, totalQuizzes, totalAttempts, avgScore }`
- `GET /api/admin-analytics/top-streaks` — Top users by streak
- `GET /api/admin-analytics/top-scores` — Top users by score
- `GET /api/admin-analytics/quiz-pass-rates` — Pass rates per quiz
- `GET /api/admin-analytics/daily-activity` — Attempts per day

---

## Example Requests

**Register User:**
```json
POST /api/auth/register
{
  "name": "Test User",
  "email": "testuser@example.com",
  "password": "password123"
}
```

**Login (Admin):**
```json
POST /api/auth/login
{
  "email": "admin@example.com",
  "password": "adminpassword"
}
```

**Create Quiz:**
```json
POST /api/quizzes
{
  "title": "Math Quiz",
  "description": "Test your math skills.",
  "categoryId": 1,
  "createdBy": 1,
  "difficulty": "medium",
  "passingScore": 60,
  "status": "published"
}
```

---

## Error Handling
- 404 for unknown routes
- 500 for server errors
- Detailed error messages in development

---

## How to Use
1. Start server: `npm start`
2. Use Postman to authenticate and test endpoints
3. For protected routes, set the `token` cookie with your JWT
4. Refer to this documentation for request/response formats

---

## Notes
- All admin analytics endpoints require admin authentication
- Google OAuth endpoints require proper Google credentials in `.env`
- For full API details, see controllers and models for validation and business logic

---

# FULL ROUTES & ENDPOINTS DOCUMENTATION

## 1. Auth (`/api/auth`)
- **POST `/register`**  
  Register a user.  
  **Input:** `{ name, email, password }`  
  **Output:** `{ user, message }`

- **POST `/login`**  
  Login user (admin, teacher, student).  
  **Input:** `{ email, password }`  
  **Output:** `{ token, user }`

- **GET `/confirm-email/:token`**  
  Confirm user email.  
  **Output:** `{ message }`

- **POST `/resend-confirmation`**  
  Resend confirmation email.  
  **Input:** `{ email }`  
  **Output:** `{ message }`

- **POST `/logout`**  
  Logout user.  
  **Header:** `Cookie: token=JWT_TOKEN`  
  **Output:** `{ message }`

- **GET `/profile`**  
  Get authenticated user's profile.  
  **Header:** `Cookie: token=JWT_TOKEN`  
  **Output:** `{ user }`

- **GET `/google`**  
  Start Google OAuth login.

- **GET `/google/callback`**  
  Google OAuth callback.  
  **Output:** `{ token, user }` (on success)

- **POST `/register-admin`**  
  Register an admin user.  
  **Input:** `{ name, email, password }`  
  **Output:** `{ user, message }`

---

## 2. Users (`/api/users`)
- **GET `/`**  
  List all users.  
  **Output:** `[user, ...]`

- **GET `/:id`**  
  Get user by ID.  
  **Output:** `{ user }`

- **PUT `/:id`**  
  Update user.  
  **Input:** `{ name?, email?, password?, role? }`  
  **Output:** `{ user, message }`

- **DELETE `/:id`**  
  Delete user.  
  **Output:** `{ message }`

---

## 3. Quizzes (`/api/quizzes`)
- **POST `/`**  
  Create quiz (teacher/admin only).  
  **Input:** `{ title, description, categoryId, createdBy, difficulty, passingScore, status }`  
  **Output:** `{ quiz, message }`

- **POST `/:quizId/questions`**  
  Add question to quiz (teacher/admin only).  
  **Input:** `{ text, type, points, explanation, options }`  
  **Output:** `{ question, message }`

- **GET `/:quizId/confirmation`**  
  Get quiz confirmation (teacher/admin only).  
  **Output:** `{ quiz, confirmation }`

- **PATCH `/:quizId/status`**  
  Update quiz status (teacher/admin only).  
  **Input:** `{ status }`  
  **Output:** `{ quiz, message }`

- **DELETE `/:quizId`**  
  Delete draft quiz (teacher/admin only).  
  **Output:** `{ message }`

- **GET `/`**  
  Get all quizzes (admin only).  
  **Output:** `[quiz, ...]`

- **GET `/:quizId`**  
  Get quiz by ID (admin only).  
  **Output:** `{ quiz }`

- **PUT `/:quizId`**  
  Update quiz by ID (admin only).  
  **Input:** `{ title?, description?, ... }`  
  **Output:** `{ quiz, message }`

---

## 4. Categories (`/api/categories`)
- **GET `/`**  
  List all categories.  
  **Output:** `[category, ...]`

- **GET `/quiz/:id`**  
  Get category with associated quiz.  
  **Output:** `{ category, quizzes }`

- **GET `/:id`**  
  Get category by ID.  
  **Output:** `{ category }`

- **POST `/`**  
  Create category (admin only).  
  **Input:** `{ name }`  
  **Output:** `{ category, message }`

- **PUT `/:id`**  
  Update category (admin only).  
  **Input:** `{ name }`  
  **Output:** `{ category, message }`

- **DELETE `/:id`**  
  Delete category (admin only).  
  **Output:** `{ message }`

---

## 5. Tags (`/api/tags`)
- **GET `/`**  
  List all tags.  
  **Output:** `[tag, ...]`

- **GET `/quiz/:id`**  
  Get tag with associated quizzes.  
  **Output:** `{ tag, quizzes }`

- **GET `/:id`**  
  Get tag by ID.  
  **Output:** `{ tag }`

- **POST `/`**  
  Create tag (admin only).  
  **Input:** `{ name }`  
  **Output:** `{ tag, message }`

- **PUT `/:id`**  
  Update tag (admin only).  
  **Input:** `{ name }`  
  **Output:** `{ tag, message }`

- **DELETE `/:id`**  
  Delete tag (admin only).  
  **Output:** `{ message }`

---

## 6. QuizTag (`/api/quizeTag`)
- **POST `/`**  
  Create quiz-tag relation (admin only).  
  **Input:** `{ quizId, tagId }`  
  **Output:** `{ quizTag, message }`

- **GET `/`**  
  List all quiz-tag relations (admin only).  
  **Output:** `[quizTag, ...]`

- **GET `/:id`**  
  Get quiz-tag by ID (admin only).  
  **Output:** `{ quizTag }`

- **PUT `/:id`**  
  Update quiz-tag by ID (admin only).  
  **Input:** `{ quizId?, tagId? }`  
  **Output:** `{ quizTag, message }`

- **DELETE `/:id`**  
  Delete quiz-tag by ID (admin only).  
  **Output:** `{ message }`

---

## 7. Options (`/api/options`)
- **POST `/`**  
  Create option (admin only).  
  **Input:** `{ questionId, text, isCorrect }`  
  **Output:** `{ option, message }`

- **GET `/question/:questionId`**  
  Get options for a question (admin only).  
  **Output:** `[option, ...]`

- **GET `/:id`**  
  Get option by ID (admin only).  
  **Output:** `{ option }`

- **PUT `/:id`**  
  Update option by ID (admin only).  
  **Input:** `{ text?, isCorrect? }`  
  **Output:** `{ option, message }`

- **DELETE `/:id`**  
  Delete option by ID (admin only).  
  **Output:** `{ message }`

---

## 8. QuizAttempts (`/api/quizAttempts`)
- **POST `/`**  
  Create quiz attempt.  
  **Input:** `{ userId, quizId, answers }`  
  **Output:** `{ attemptId, score }`

- **GET `/quiz/:quizId`**  
  Get all attempts for a quiz.  
  **Output:** `[attempt, ...]`

- **GET `/user/:userId`**  
  Get all attempts for a user.  
  **Output:** `[attempt, ...]`

- **GET `/:id`**  
  Get attempt details.  
  **Output:** `{ attempt }`

---

## 9. UserStats (`/api/userStats`)
- **GET `/:userId`**  
  Get stats for a user.  
  **Output:** `{ userStats }`

- **PUT `/:userId`**  
  Update stats for a user.  
  **Input:** `{ quizzesTaken?, quizzesPassed?, totalScore?, currentStreak?, longestStreak?, lastActivityDate? }`  
  **Output:** `{ userStats, message }`

- **POST `/`**  
  Create stats for a user.  
  **Input:** `{ userId, ... }`  
  **Output:** `{ userStats, message }`

---

## 10. Admin Analytics (`/api/admin-analytics`)
- **GET `/overview`**  
  Get overall statistics.  
  **Output:** `{ totalUsers, totalQuizzes, totalAttempts, avgScore }`

- **GET `/top-streaks`**  
  Get top users by streak.  
  **Output:** `[userStats, ...]`

- **GET `/top-scores`**  
  Get top users by score.  
  **Output:** `[userStats, ...]`

- **GET `/quiz-pass-rates`**  
  Get quiz pass rates.  
  **Output:** `[ { quizId, title, passRate }, ... ]`

- **GET `/daily-activity`**  
  Get daily activity.  
  **Output:** `{ YYYY-MM-DD: count, ... }`

---

# EXPLICIT ROUTES REFERENCE

## /api/categories
- GET /api/categories — Get all categories (public)
- GET /api/categories/quiz/:id — Get specific category with associated quiz (public)
- GET /api/categories/:id — Get category by ID (public)
- POST /api/categories — Create new category (admin only)
  Input: { name }
- PUT /api/categories/:id — Update category (admin only)
  Input: { name }
- DELETE /api/categories/:id — Delete category (admin only)

## /api/tags
- GET /api/tags — Get all tags (public)
- GET /api/tags/quiz/:id — Get specific tag with quizzes (public)
- GET /api/tags/:id — Get tag by ID (public)
- POST /api/tags — Create new tag (admin only)
  Input: { name }
- PUT /api/tags/:id — Update tag (admin only)
  Input: { name }
- DELETE /api/tags/:id — Delete tag (admin only)

## /api/users
- GET /api/users — Get all users
- GET /api/users/:id — Get user by ID
- PUT /api/users/:id — Update user
  Input: { name?, email?, password?, role? }
- DELETE /api/users/:id — Delete user

## /api/quizzes
- POST /api/quizzes — Create quiz (teacher/admin only)
  Input: { title, description, categoryId, createdBy, difficulty, passingScore, status }
- POST /api/quizzes/:quizId/questions — Add question to quiz (teacher/admin only)
  Input: { text, type, points, explanation, options }
- GET /api/quizzes/:quizId/confirmation — Get quiz confirmation (teacher/admin only)
- PATCH /api/quizzes/:quizId/status — Update quiz status (teacher/admin only)
  Input: { status }
- DELETE /api/quizzes/:quizId — Delete draft quiz (teacher/admin only)
- GET /api/quizzes — Get all quizzes (admin only)
- GET /api/quizzes/:quizId — Get quiz by ID (admin only)
- PUT /api/quizzes/:quizId — Update quiz by ID (admin only)
  Input: { title?, description?, ... }

## /api/quizeTag
- POST /api/quizeTag — Create quiz-tag relation (admin only)
  Input: { quizId, tagId }
- GET /api/quizeTag — List all quiz-tag relations (admin only)
- GET /api/quizeTag/:id — Get quiz-tag by ID (admin only)
- PUT /api/quizeTag/:id — Update quiz-tag by ID (admin only)
  Input: { quizId?, tagId? }
- DELETE /api/quizeTag/:id — Delete quiz-tag by ID (admin only)

## /api/options
- POST /api/options — Create option (admin only)
  Input: { questionId, text, isCorrect }
- GET /api/options/question/:questionId — Get options for a question (admin only)
- GET /api/options/:id — Get option by ID (admin only)
- PUT /api/options/:id — Update option by ID (admin only)
  Input: { text?, isCorrect? }
- DELETE /api/options/:id — Delete option by ID (admin only)

## /api/quizAttempts
- POST /api/quizAttempts — Create quiz attempt
  Input: { userId, quizId, answers }
- GET /api/quizAttempts/quiz/:quizId — Get all attempts for a quiz
- GET /api/quizAttempts/user/:userId — Get all attempts for a user
- GET /api/quizAttempts/:id — Get attempt details

## /api/userStats
- GET /api/userStats/:userId — Get stats for a user
- PUT /api/userStats/:userId — Update stats for a user
  Input: { quizzesTaken?, quizzesPassed?, totalScore?, currentStreak?, longestStreak?, lastActivityDate? }
- POST /api/userStats — Create stats for a user
  Input: { userId, ... }

## /api/admin-analytics
- GET /api/admin-analytics/overview — Get overall statistics (admin only)
- GET /api/admin-analytics/top-streaks — Get top users by streak (admin only)
- GET /api/admin-analytics/top-scores — Get top users by score (admin only)
- GET /api/admin-analytics/quiz-pass-rates — Get quiz pass rates (admin only)
- GET /api/admin-analytics/daily-activity — Get daily activity (admin only)
