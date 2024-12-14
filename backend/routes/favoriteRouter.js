const express = require('express');
const router = express.Router();
const { addToFavorites, removeFromFavorites, getFavorites } = require('../controllers/favoriteController');
const authenticate = require('../middleware/authenticate');

// Get user's favorite locations
router.get('/favorites', authenticate, getFavorites);

// Add a location to favorites
router.post('/favorites/:locationId', authenticate, addToFavorites);

// Remove a location from favorites
router.delete('/favorites/:locationId', authenticate, removeFromFavorites);

module.exports = router;