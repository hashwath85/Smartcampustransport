const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');

router.post('/start', tripController.startTrip);
router.post('/end', tripController.endTrip);

module.exports = router;
