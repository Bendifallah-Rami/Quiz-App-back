// User model placeholder
// TODO: Implement with your chosen database (MongoDB, PostgreSQL, etc.)

class User {
  constructor(userData) {
    this.id = userData.id;
    this.username = userData.username;
    this.email = userData.email;
    this.password = userData.password; // Should be hashed
    this.role = userData.role || 'user'; // 'user' or 'admin'
    this.createdAt = userData.createdAt || new Date();
    this.updatedAt = userData.updatedAt || new Date();
  }

  // Static methods for database operations
  static async findById(id) {
    // TODO: Implement database query to find user by ID
    throw new Error('Database integration not implemented');
  }

  static async findByEmail(email) {
    // TODO: Implement database query to find user by email
    throw new Error('Database integration not implemented');
  }

  static async create(userData) {
    // TODO: Implement database query to create new user
    throw new Error('Database integration not implemented');
  }

  static async update(id, updateData) {
    // TODO: Implement database query to update user
    throw new Error('Database integration not implemented');
  }

  static async delete(id) {
    // TODO: Implement database query to delete user
    throw new Error('Database integration not implemented');
  }

  static async findAll(options = {}) {
    // TODO: Implement database query to find all users with pagination
    throw new Error('Database integration not implemented');
  }

  // Instance methods
  async save() {
    // TODO: Implement save method
    throw new Error('Database integration not implemented');
  }

  toJSON() {
    // Return user data without sensitive information
    const { password, ...userData } = this;
    return userData;
  }
}

module.exports = User;
