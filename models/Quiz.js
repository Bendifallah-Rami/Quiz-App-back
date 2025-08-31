// Quiz model placeholder
// TODO: Implement with your chosen database (MongoDB, PostgreSQL, etc.)

class Quiz {
  constructor(quizData) {
    this.id = quizData.id;
    this.title = quizData.title;
    this.description = quizData.description;
    this.category = quizData.category;
    this.difficulty = quizData.difficulty; // 'Easy', 'Medium', 'Hard'
    this.questions = quizData.questions || [];
    this.createdBy = quizData.createdBy; // User ID
    this.isPublic = quizData.isPublic !== undefined ? quizData.isPublic : true;
    this.timeLimit = quizData.timeLimit; // Time limit in minutes (optional)
    this.createdAt = quizData.createdAt || new Date();
    this.updatedAt = quizData.updatedAt || new Date();
  }

  // Static methods for database operations
  static async findById(id) {
    // TODO: Implement database query to find quiz by ID
    throw new Error('Database integration not implemented');
  }

  static async findAll(options = {}) {
    // TODO: Implement database query to find all quizzes with filtering and pagination
    // Options might include: category, difficulty, createdBy, isPublic, page, limit
    throw new Error('Database integration not implemented');
  }

  static async findByCreator(userId, options = {}) {
    // TODO: Implement database query to find quizzes created by a specific user
    throw new Error('Database integration not implemented');
  }

  static async create(quizData) {
    // TODO: Implement database query to create new quiz
    throw new Error('Database integration not implemented');
  }

  static async update(id, updateData) {
    // TODO: Implement database query to update quiz
    throw new Error('Database integration not implemented');
  }

  static async delete(id) {
    // TODO: Implement database query to delete quiz
    throw new Error('Database integration not implemented');
  }

  static async search(searchTerm, options = {}) {
    // TODO: Implement search functionality for quizzes
    throw new Error('Database integration not implemented');
  }

  // Instance methods
  async save() {
    // TODO: Implement save method
    throw new Error('Database integration not implemented');
  }

  addQuestion(question) {
    // Validate question structure
    if (!question.question || !question.options || !Array.isArray(question.options)) {
      throw new Error('Invalid question format');
    }
    
    if (question.options.length < 2) {
      throw new Error('Question must have at least 2 options');
    }

    this.questions.push(question);
  }

  removeQuestion(questionId) {
    this.questions = this.questions.filter(q => q.id !== questionId);
  }

  getQuestionCount() {
    return this.questions.length;
  }

  // Get quiz without correct answers (for quiz takers)
  getPublicView() {
    const questionsWithoutAnswers = this.questions.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options
      // Exclude correctAnswer
    }));

    return {
      id: this.id,
      title: this.title,
      description: this.description,
      category: this.category,
      difficulty: this.difficulty,
      questions: questionsWithoutAnswers,
      timeLimit: this.timeLimit,
      questionCount: this.getQuestionCount()
    };
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      category: this.category,
      difficulty: this.difficulty,
      questions: this.questions,
      createdBy: this.createdBy,
      isPublic: this.isPublic,
      timeLimit: this.timeLimit,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Quiz;
