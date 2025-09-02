const { User } = require('../models');

async function clearAllUsers() {
  try {
    console.log('Deleting all users from the database...');
    
    // Delete all users from the database
    const deletedCount = await User.destroy({
      where: {},  // Empty where clause means delete all records
      truncate: true, // This will reset auto-increment counters
      cascade: true   // This will delete associated records in related tables
    });
    
    console.log(`Successfully deleted all users. Affected rows: ${deletedCount}`);
    process.exit(0);
  } catch (error) {
    console.error('Error deleting users:', error);
    process.exit(1);
  }
}

// Run the function
clearAllUsers();
