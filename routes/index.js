const express = require('express');
const router = express.Router();

// Import Controllers
const indexController = require('../controllers/index');

/* GET home page. */
router.get('/', indexController.getIndex);

module.exports = router;