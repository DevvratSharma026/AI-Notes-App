const express = require('express');
const router = express.Router();

//login, singup route
const {signup, login, sendOTP} = require('../controllers/Auth');
const {auth} = require('../middlewares/auth')

router.post('/sendOTP', sendOTP);
router.post('/login', login);
router.post('/signup', signup);

// Protected route to check authentication
router.get('/me', auth, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

module.exports = router;
