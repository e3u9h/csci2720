const Location = require('../models/Location');
const User = require('../models/User');
const Admin = require('../models/Admin');

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next(); // Proceed if the user is admin
    } else {
        return res.status(403).json({ error: 'Access denied' }); // Deny access if not admin
    }
};
// Create a new event
exports.createEvent = async (req, res) => {
    isAdmin(req, res, async () => {
        try {
            const event = new Event(req.body);
            await event.save();

            // Optionally, update the location's events array
            await Location.findByIdAndUpdate(req.body.venue, { $push: { events: event._id } });

            res.status(201).json(event);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });
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
    const { username, password, isAdmin } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        if (isAdmin) {
            const newAdmin = new Admin({ username, password });
            await newAdmin.save();
            return res.status(201).json(newAdmin);
        } else {
            const newUser = new User({ username, password });
            await newUser.save();
            return res.status(201).json(newUser);
        }
    } catch (error) {
        console.error('Error creating user or admin:', error);
        res.status(500).json({ message: error.message || 'Error creating user' });
    }
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
    const { id } = req.params;

    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(204).send(); // No content
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: error.message || 'Error deleting user' });
    }
};

// Create a new admin
exports.createAdmin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const newAdmin = new Admin({ username, password });
        await newAdmin.save();
        return res.status(201).json(newAdmin);
    } catch (error) {
        console.error('Error creating admin:', error);
        res.status(500).json({ message: error.message || 'Error creating admin' });
    }
};

// Get all admins
exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find();
        res.status(200).json(admins);
    } catch (error) {
        console.error('Error retrieving admins:', error);
        res.status(500).json({ message: error.message || 'Error retrieving admins' });
    }
};

// Update a specific admin
exports.updateAdmin = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const admin = await Admin.findByIdAndUpdate(id, updates, { new: true });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.status(200).json(admin);
    } catch (error) {
        console.error('Error updating admin:', error);
        res.status(500).json({ message: error.message || 'Error updating admin' });
    }
};

// Delete a specific admin
exports.deleteAdmin = async (req, res) => {
    const { id } = req.params;

    try {
        const admin = await Admin.findByIdAndDelete(id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.status(204).send(); // No content
    } catch (error) {
        console.error('Error deleting admin:', error);
        res.status(500).json({ message: error.message || 'Error deleting admin' });
    }
};
// Modify a user (admin or regular)
exports.modifyUser = async (req, res) => {
    const { id } = req.params;
    const { username, password, isAdmin } = req.body;

    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    try {
        let updatedUser;

        // Check if the user is an admin or regular user based on the ID
        if (isAdmin) {
            updatedUser = await Admin.findByIdAndUpdate(id, { username, password }, { new: true });
        } else {
            updatedUser = await User.findByIdAndUpdate(id, { username, password }, { new: true });
        }

        // Hash the password if it has been changed
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updatedUser.password = await bcrypt.hash(password, salt);
            await updatedUser.save();
        }

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error modifying user:', error);
        res.status(500).json({ message: error.message || 'Error modifying user' });
    }
};
