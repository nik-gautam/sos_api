const express = require('express');
const router = express.Router();

const locationController = require('../controllers/location')

router.post('/postlatlong', locationController.postLatLong);
router.get('/nearby', locationController.getNearby);

module.exports = router;