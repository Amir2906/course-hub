// const Student = require('../models/Student')

const handleLogout = (req, res) => {
    // Clear the access token cookie
    res.clearCookie('accessToken');
    res.json({ message: 'Logged out successfully' });
  }

module.exports = { handleLogout }