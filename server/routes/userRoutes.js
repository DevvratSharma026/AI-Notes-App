const express = require('express');
const router = express.Router();
const User = require('../models/User');

//login, singup route
const {signup, login, sendOTP} = require('../controllers/Auth');
const {auth} = require('../middlewares/auth')

router.post('/sendOTP', sendOTP);
router.post('/login', login);
router.post('/signup', signup);

// Protected route to check authentication
router.get('/me', auth, async (req, res) => {
  try {
    console.log('ME route hit, user:', req.user); // Debug log
    // Fetch full user data from database
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('ME route error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
