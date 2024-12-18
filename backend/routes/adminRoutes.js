/*

DU Fangzhou 1155173892
DING Yuzhou 1155173825
WEI YOUlin  1155157186

*/
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticate = require('../middleware/authenticate');
const isAdmin = require('../middleware/authorizeAdmin');

// Apply authentication middleware for all admin routes
router.use(authenticate); // First, authenticate the user

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
router.get('/events', isAdmin, adminController.getAllEvents);
router.put('/events/:id', isAdmin, adminController.updateEvent);
router.delete('/events/:id', isAdmin, adminController.deleteEvent);



module.exports = router;
