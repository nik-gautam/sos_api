const express = require('express');
const router = express.Router();

// Import Controllers
const userController = require('../controllers/users');

router.post('/signup', userController.postSignUp);
router.get('/get', userController.listUsers);

module.exports = router;