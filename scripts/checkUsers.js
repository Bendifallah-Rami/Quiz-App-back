const { User } = require('../models');

async function checkUsers() {
  try {
    console.log('Checking users in the database...');
    
    // Count users in the database
    const userCount = await User.count();
    
    console.log(`Total users in database: ${userCount}`);
    
    if (userCount > 0) {
      // If there are users, list them
      const users = await User.findAll({
        attributes: ['id', 'name', 'email']
      });
      console.log('User list:');
      console.log(JSON.stringify(users, null, 2));
    } else {
      console.log('No users found in the database.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking users:', error);
    process.exit(1);
  }
}

// Run the function
checkUsers();
