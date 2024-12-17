const Location = require('../models/Location');
const User = require('../models/User');
const Admin = require('../models/Admin');
const isAdmin = require('../middleware/authorizeAdmin');
const Event = require('../models/Event');


// Create a new event
exports.createEvent = async (req, res) => {

        try {
            const event = new Event(req.body);
            await event.save();

            // Optionally, update the location's events array
            await Location.findByIdAndUpdate(req.body.venue, { $push: { events: event._id } });

            res.status(201).json(event);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
};

exports.getSomeEvents = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        console.log(req.query);
        const events = await Event.find().skip((page - 1) * limit).limit(limit);
        console.log(events);
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateEvent = async (req, res) => {
        try {
            const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!event) return res.status(404).json({ message: 'Event not found' });
            res.status(200).json(event);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }

};

exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}



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

        try {
            const user = await User.findById(req.params.id);
            const newUsername = req.body.username;
            const newPassword = req.body.password;
            if (!user) return res.status(404).json({ message: 'User not found' });
            user.username = newUsername;
            user.password = newPassword;
            await user.save();
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
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
    const newUsername = req.body.username;
    const newPassword = req.body.password;

    try {
        const admin = await Admin.findById(id);

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        admin.password = newPassword;
        admin.username = newUsername;
        await admin.save();
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

