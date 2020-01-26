const express = require('express');
const router = express.Router();

// Import Controllers
const userController = require('../controllers/users');

router.get('/signup', userController.addUsers);
router.get('/get', userController.listUsers);

module.exports = router;