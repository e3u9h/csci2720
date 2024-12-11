const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

const generateToken = (user, isAdmin) => {
    return jwt.sign(
        { id: user._id, username: user.username, isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

exports.register = async (req, res) => {
    const { username, password, role } = req.body;
    try {
        if (role === 'admin') {
            const admin = new Admin({ username, password });
            await admin.save();
            res.status(201).json({ message: 'Admin registered successfully' });
        } else {
            const user = new User({ username, password });
            await user.save();
            res.status(201).json({ message: 'User registered successfully' });
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    const { username, password, role } = req.body;
    try {
        let user;
        if (role === 'admin') {
            user = await Admin.findOne({ username });
        } else {
            user = await User.findOne({ username });
        }

        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = generateToken(user, role === 'admin');
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};