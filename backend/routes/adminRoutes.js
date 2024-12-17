const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticate = require('../middleware/authenticate');
const isAdmin = require('../middleware/authorizeAdmin');

// Apply authentication middleware for all admin routes
router.use(authenticate); // First, authenticate the user

// Admin actions routes for locations
router.post('/locations', isAdmin, adminController.createLocation);
router.get('/locations', isAdmin, adminController.getAllLocations);
router.put('/locations/:id', isAdmin, adminController.updateLocation);
router.delete('/locations/:id', isAdmin, adminController.deleteLocation);

// Admin actions routes for users
router.post('/users', isAdmin, adminController.createUser);
router.get('/users', isAdmin, adminController.getAllUsers);
router.put('/users/:id', isAdmin, adminController.updateUser);
router.delete('/users/:id', isAdmin, adminController.deleteUser); // Ensure this is present

// Admin actions routes for admins
router.post('/admins', isAdmin, adminController.createAdmin);
router.get('/admins', isAdmin, adminController.getAllAdmins);
router.put('/admins/:id', isAdmin, adminController.updateAdmin);
router.delete('/admins/:id', isAdmin, adminController.deleteAdmin); // Ensure this is present

// Add the route for creating events
router.post('/events', isAdmin, adminController.createEvent);

// Modify a user (admin or regular)
router.put('/users/:id', isAdmin, adminController.modifyUser); // Ensure this is present

module.exports = router;
