const express = require('express');
const { registerUser, loginUser, resetPassword } = require('../controllers/authController');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/reset-password', verifyToken, resetPassword);

module.exports = router;
