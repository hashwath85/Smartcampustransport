const express = require('express');
const router = express.Router();
const gpsController = require('../controllers/gpsController');

router.post('/update-location', gpsController.updateLocation);

module.exports = router;
