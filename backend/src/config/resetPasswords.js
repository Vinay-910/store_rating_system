// resetPasswords.js
const bcrypt = require('bcryptjs');
const pool = require('./database'); // adjust path if needed

const usersToReset = [
  { email: 'aarav@storehub.com', password: 'Aarav@123' },
  { email: 'neha@retailworld.com', password: 'Neha@123' },
  { email: 'kiran@lifestylehub.com', password: 'Kiran@123' },
  { email: 'ravi@techworld.com', password: 'Ravi@123' }
];

const resetPasswords = async () => {
  try {
    for (const user of usersToReset) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await pool.query(
        'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE email = $2',
        [hashedPassword, user.email]
      );
      console.log(`Password reset for ${user.email}`);
    }
    console.log('All passwords reset successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error resetting passwords:', err.message);
    process.exit(1);
  }
};

resetPasswords();
