const express = require('express');
const router = express.Router();
const {
    getAllLocations,
    getTenRandomLocations,
    createLocation,
    // other controllers
} = require('../controllers/locationController');
const authenticate = require('../middleware/authenticate');
const authorizeAdmin = require('../middleware/authorizeAdmin');

router.get('/', authenticate, getAllLocations);
router.post('/', authenticate, authorizeAdmin, createLocation);
router.get('/tenrandom', authenticate, getTenRandomLocations);
// Additional routes for update, delete

module.exports = router;