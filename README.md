# Quiz App Backend

A RESTful API backend for a Quiz Application built with Express.js and Node.js.

## Features

- User authentication and authorization
- Quiz creation, management, and taking
- User profile management
- RESTful API endpoints
- Security middleware (Helmet, CORS)
- Error handling
- Environment configuration

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A database (MongoDB, PostgreSQL, or your preferred choice)

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
   - Copy `.env` file and update the values
   - Set your database connection string
   - Generate a secure JWT secret

4. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Production

To run in production:
```bash
npm start
```

## API Endpoints

### Health Check
- `GET /health` - Server health check

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Quizzes
- `GET /api/quizzes` - Get all quizzes
- `GET /api/quizzes/:id` - Get specific quiz
- `POST /api/quizzes` - Create new quiz
- `PUT /api/quizzes/:id` - Update quiz
- `DELETE /api/quizzes/:id` - Delete quiz
- `POST /api/quizzes/:id/submit` - Submit quiz answers

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user (admin only)
- `GET /api/users/:id/quizzes` - Get user's created quizzes
- `GET /api/users/:id/results` - Get user's quiz results

## Project Structure

```
quiz-app-back/
├── middleware/          # Custom middleware
│   └── auth.js         # Authentication middleware
├── models/             # Data models
│   ├── User.js         # User model
│   └── Quiz.js         # Quiz model
├── routes/             # API routes
│   ├── auth.js         # Authentication routes
│   ├── quizzes.js      # Quiz routes
│   └── users.js        # User routes
├── .env                # Environment variables
├── package.json        # Dependencies and scripts
├── server.js           # Main server file
└── README.md           # This file
```

## Environment Variables

Create a `.env` file with the following variables:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_super_secret_jwt_key
```

## Database Integration

This project comes with model placeholders. To integrate with a database:

1. Choose your database (MongoDB, PostgreSQL, MySQL, etc.)
2. Install the appropriate database driver/ORM
3. Implement the model methods in the `models/` directory
4. Update the route handlers to use the models

### For MongoDB with Mongoose:
```bash
npm install mongoose
```

### For PostgreSQL with Sequelize:
```bash
npm install sequelize pg pg-hstore
```

## Security Features

- Helmet.js for security headers
- CORS configuration
- Environment variable protection
- JWT authentication (to be implemented)
- Input validation (to be implemented)

## TODO

- [ ] Implement database integration
- [ ] Add JWT authentication logic
- [ ] Add input validation middleware
- [ ] Add rate limiting
- [ ] Add unit tests
- [ ] Add API documentation (Swagger)
- [ ] Add password hashing
- [ ] Add email verification
- [ ] Add quiz result tracking
- [ ] Add quiz categories and difficulty filtering

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.
