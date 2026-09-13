const express = require('express');
const router = express.Router();
const waitController = require('../controllers/waitRequestController');

router.post('/', waitController.createWaitRequest);
router.post('/respond', waitController.respondToWaitRequest);

module.exports = router;
