const express = require('express');
const router = express.Router();
const { getLocationComments, addComment } = require('../controllers/commentController');
const authenticate = require('../middleware/authenticate');

// Get comments for a specific location
router.get('/locations/:locationId/comments', authenticate, getLocationComments);

// Add a comment to a location
router.post('/locations/:locationId/comments', authenticate, addComment);

module.exports = router;
