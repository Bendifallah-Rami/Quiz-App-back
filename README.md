# Quiz App Backend

A RESTful API backend for a Quiz Application built with Express.js, Node.js, and PostgreSQL using Sequelize ORM.

## Features

- 🔐 User authentication and authorization (student, teacher, admin roles)
- 📝 Quiz creation, management, and taking
- 👤 User profile management with statistics
- 🏷️ Categories and tags for quiz organization
- 📊 Quiz attempts tracking and scoring
- 🔒 Security middleware (Helmet, CORS)
- 🎯 Comprehensive error handling
- 🌍 Environment-based configuration
- 🗃️ PostgreSQL database with Sequelize ORM

## Database Models

### Core Models:
- **Users** - User accounts with roles (student/teacher/admin)
- **UserStats** - User statistics (scores, streaks, activity)
- **Categories** - Quiz categories (Math, Science, etc.)
- **Quizzes** - Quiz definitions
- **Tags** - Tagging system for quizzes
- **Questions** - Quiz questions (single/multiple choice)
- **Options** - Answer options for questions
- **QuizAttempts** - User quiz attempts with scores
- **AttemptAnswers** - Individual question answers

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd quiz-app-back
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   Copy `.env` file and update the values:
   ```env
   NODE_ENV=development
   PORT=3000
   
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=quiz_app_dev
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_SSL=false
   
   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key
   ```

4. Setup PostgreSQL database:
   ```sql
   CREATE DATABASE quiz_app_dev;
   ```

5. Initialize the database with sample data:
   ```bash
   npm run db:init
   ```

6. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Sample Data

After running `npm run db:init`, you'll have:

**Login Credentials:**
- Admin: `admin@quizapp.com` / `admin123`
- Teacher: `teacher@quizapp.com` / `teacher123` 
- Student: `student@quizapp.com` / `student123`

**Sample Data:**
- 3 Categories (Mathematics, Science, History)
- 5 Tags (algebra, geometry, physics, chemistry, world-war)
- 1 Sample quiz with questions

## API Endpoints

### Health Check
- `GET /health` - Server health check

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user (admin only)
- `GET /api/users/:id/quizzes` - Get user's created quizzes
- `GET /api/users/:id/results` - Get user's quiz results

### Quizzes
- `GET /api/quizzes` - Get all quizzes
- `GET /api/quizzes/:id` - Get specific quiz
- `POST /api/quizzes` - Create new quiz
- `PUT /api/quizzes/:id` - Update quiz
- `DELETE /api/quizzes/:id` - Delete quiz
- `POST /api/quizzes/:id/submit` - Submit quiz answers

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get specific category
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Tags
- `GET /api/tags` - Get all tags
- `GET /api/tags/:id` - Get specific tag
- `POST /api/tags` - Create new tag
- `PUT /api/tags/:id` - Update tag
- `DELETE /api/tags/:id` - Delete tag

## Project Structure

```
quiz-app-back/
├── config/              # Database configuration
│   ├── connection.js    # Sequelize connection
│   └── database.js      # Database config
├── middleware/          # Custom middleware
│   └── auth.js         # Authentication middleware
├── models/             # Sequelize models
│   ├── index.js        # Model associations
│   ├── User.js         # User model
│   ├── UserStats.js    # User statistics
│   ├── Category.js     # Quiz categories
│   ├── Quiz.js         # Quiz model
│   ├── Tag.js          # Tags model
│   ├── QuizTag.js      # Quiz-Tag junction
│   ├── Question.js     # Questions model
│   ├── Option.js       # Answer options
│   ├── QuizAttempt.js  # Quiz attempts
│   └── AttemptAnswer.js # Individual answers
├── routes/             # API routes
│   ├── auth.js         # Authentication routes
│   ├── users.js        # User routes
│   ├── quizzes.js      # Quiz routes
│   ├── categories.js   # Category routes
│   └── tags.js         # Tag routes
├── scripts/            # Database scripts
│   └── initDatabase.js # Database initialization
├── .env                # Environment variables
├── .gitignore         # Git ignore rules
├── package.json       # Dependencies and scripts
├── server.js          # Main server file
└── README.md          # This file
```

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run db:init` - Initialize database with sample data
- `npm run db:reset` - Reset and reinitialize database

## Environment Variables

```env
NODE_ENV=development
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=quiz_app_dev
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_SSL=false

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key
```

## Database Schema

### Relationships:
- User → UserStats (1:1)
- User → Quizzes (1:many) as creator
- User → QuizAttempts (1:many)
- Category → Quizzes (1:many)
- Quiz → Questions (1:many)
- Quiz ↔ Tags (many:many through QuizTag)
- Question → Options (1:many)
- QuizAttempt → AttemptAnswers (1:many)

## Security Features

- Helmet.js for security headers
- CORS configuration
- Password hashing with bcrypt
- JWT authentication (ready for implementation)
- Input validation with Sequelize
- Environment variable protection

## Next Steps

### Immediate Implementation:
- [ ] Complete JWT authentication in routes
- [ ] Add input validation middleware
- [ ] Implement quiz submission logic
- [ ] Add pagination for list endpoints
- [ ] Add search and filtering

### Future Enhancements:
- [ ] Add rate limiting
- [ ] Implement email verification
- [ ] Add file upload for quiz images
- [ ] Add real-time quiz features with WebSockets
- [ ] Add analytics and reporting
- [ ] Add API documentation with Swagger
- [ ] Add comprehensive test suite
- [ ] Add Docker containerization

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.
