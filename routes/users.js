const express = require('express');
const router = express.Router();

// Import Controllers
const userController = require('../controllers/users');

/* GET users listing. */
router.get('/signup', userController.addUsers);

module.exports = router;