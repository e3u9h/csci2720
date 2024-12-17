const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticate = require('../middleware/authenticate'); // Ensure this is the correct path
const isAdmin = require('../middleware/authorizeAdmin'); // Import your isAdmin check

// Apply authentication and admin check middleware for all admin routes
router.use(authenticate); // First, authenticate the user

// Admin actions routes
router.post('/locations', isAdmin, adminController.createLocation); // Create a new location
router.get('/locations', isAdmin, adminController.getAllLocations); // Get all locations
router.put('/locations/:id', isAdmin, adminController.updateLocation); // Update a specific location
router.delete('/locations/:id', isAdmin, adminController.deleteLocation); // Delete a specific location

router.post('/users', isAdmin, adminController.createUser); // Create a new user
router.get('/users', isAdmin, adminController.getAllUsers); // Get all users
router.put('/users/:id', isAdmin, adminController.updateUser); // Update a specific user
router.delete('/users/:id', isAdmin, adminController.deleteUser); // Delete a specific user

module.exports = router;