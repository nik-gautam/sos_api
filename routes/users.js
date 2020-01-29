const express = require('express');
const router = express.Router();

// Import Controllers
const userController = require('../controllers/users');

router.get('/get', userController.listUsers);
router.get('/getone', userController.getUser);
router.get('/postemergencylist', userController.postEmergencyList)

module.exports = router;