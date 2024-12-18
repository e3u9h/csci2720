const express = require('express');
const router = express.Router();
const {
    getAllLocations,
    getTenRandomLocations,
    createLocation,
    getLocationById,
    getFilteredLocations,
    // other controllers
} = require('../controllers/locationController');
const authenticate = require('../middleware/authenticate');
const authorizeAdmin = require('../middleware/authorizeAdmin');
const { searchLocations } = require('../controllers/locationController');

router.get('/tenrandom', authenticate, getTenRandomLocations);
router.get('/search', authenticate, searchLocations);
router.get('/', authenticate, getAllLocations);
router.post('/', authenticate, authorizeAdmin, createLocation);
router.get('/:id', authenticate, getLocationById);
// Additional routes for update, delete

module.exports = router;