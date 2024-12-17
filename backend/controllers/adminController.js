const Location = require('../models/Location');
const User = require('../models/User');

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next(); // Proceed if the user is admin
    } else {
        return res.status(403).json({ error: 'Access denied' }); // Deny access if not admin
    }
};

// Create a new location
exports.createLocation = async (req, res) => {
    isAdmin(req, res, async () => { // This should be handled in the route instead
        try {
            const location = new Location(req.body);
            await location.save();
            res.status(201).json(location);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });
};

// Get all locations
exports.getAllLocations = async (req, res) => {
    isAdmin(req, res, async () => {
        try {
            const locations = await Location.find();
            res.status(200).json(locations);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
};

// Update a location
exports.updateLocation = async (req, res) => {
    isAdmin(req, res, async () => {
        try {
            const location = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!location) return res.status(404).json({ message: 'Location not found' });
            res.status(200).json(location);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });
};

// Delete a location
exports.deleteLocation = async (req, res) => {
    isAdmin(req, res, async () => {
        try {
            const location = await Location.findByIdAndDelete(req.params.id);
            if (!location) return res.status(404).json({ message: 'Location not found' });
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
};

// Create a new user
exports.createUser = async (req, res) => {
    isAdmin(req, res, async () => {
        try {
            const user = new User(req.body);
            await user.save();
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });
};

// Get all users
exports.getAllUsers = async (req, res) => {
    isAdmin(req, res, async () => {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
};

// Update a user
exports.updateUser = async (req, res) => {
    isAdmin(req, res, async () => {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!user) return res.status(404).json({ message: 'User not found' });
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });
};

// Delete a user
exports.deleteUser = async (req, res) => {
    isAdmin(req, res, async () => {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            if (!user) return res.status(404).json({ message: 'User not found' });
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
};