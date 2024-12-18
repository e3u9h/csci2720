/*

DU Fangzhou 1155173892
DING Yuzhou 1155173825
WEI YOUlin  1155157186

*/
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.getFavorites = async (req, res) => {
    try {
        const userID = req.user.id;
        console.log('userID', userID);
        const user = await User.findById(userID).populate({
            path: 'favorites',
            populate: {
                path: 'events'
            }
        });
        console.log('user', user);
        res.json(user.favorites);
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ message: 'Error fetching favorites' });
    }
};

exports.addToFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const locationId = req.params.locationId;

        // Check if location already in favorites
        if (user.favorites.includes(locationId)) {
            return res.status(400).json({ message: 'Location already in favorites' });
        }

        user.favorites.push(locationId);
        await user.save();

        res.status(200).json({ message: 'Added to favorites' });
    } catch (error) {
        console.error('Error adding to favorites:', error);
        res.status(500).json({ message: 'Error adding to favorites' });
    }
};

exports.removeFromFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const locationId = req.params.locationId;

        user.favorites = user.favorites.filter(id => id.toString() !== locationId);
        await user.save();

        res.status(200).json({ message: 'Removed from favorites' });
    } catch (error) {
        console.error('Error removing from favorites:', error);
        res.status(500).json({ message: 'Error removing from favorites' });
    }
};