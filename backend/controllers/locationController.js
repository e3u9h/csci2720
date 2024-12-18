/*

DU Fangzhou 1155173892
DING Yuzhou 1155173825
WEI YOUlin  1155157186

*/
const Location = require('../models/Location');
const User = require('../models/User');
const Event = require('../models/Event');
const seedrandom = require('seedrandom');
const dotenv = require('dotenv');
dotenv.config();

// Get all locations
exports.getAllLocations = async (req, res) => {
    try {
        const locations = await Location.find().populate('events');
        res.json(locations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Get ten random locations
exports.getTenRandomLocations = async (req, res) => {
    console.log('getTenRandomLocations');
    try {
        const locations = await Location.find({
            'events.2': { $exists: true } // find locations with at least 3 events
        }).populate('events');

        if (locations.length === 0) {
            console.log('No locations found with at least 3 events.');
            return res.status(404).json({ message: 'No locations found with at least 3 events.' });
        }

        // shuffle the locations and select 10 locations that are at least 1km apart
        const seed = process.env.RANDOM_SEED || 'randomseed'
        const shuffledLocations = shuffleArray(locations, seed);
        const selectedLocations = [];
        const minDistanceKm = 1;

        for (const loc of shuffledLocations) {
            let tooClose = false;
            for (const selected of selectedLocations) {
                const distance = getDistanceFromLatLonInKm(
                    loc.latitude,
                    loc.longitude,
                    selected.latitude,
                    selected.longitude
                );
                if (distance < minDistanceKm) {
                    tooClose = true;
                    break;
                }
            }
            if (!tooClose) {
                selectedLocations.push(loc);
                if (selectedLocations.length === 10) {
                    break;
                }
            }
        }

        res.json(selectedLocations);
    } catch (err) {
        console.error('Error fetching locations:', err);
        res.status(500).json({ error: err.message });
    }
};

// Create a new location (Admin only)
exports.createLocation = async (req, res) => {
    const { name, latitude, longitude } = req.body;
    try {
        const location = new Location({ name, latitude, longitude });
        await location.save();
        res.status(201).json(location);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Search locations by keyword
exports.searchLocations = async (req, res) => {
    try {
        console.log('searchLocations');
        const { keyword } = req.query;
        
        if (!keyword) {
            return res.status(400).json({ message: 'Search keyword is required' });
        }

        const searchRegex = new RegExp(keyword, 'i');
        const locations = await Location.find({
            $or: [
                { name: searchRegex },
                { address: searchRegex },
                { description: searchRegex }
            ]
        });

        res.json(locations);
    } catch (error) {
        console.error('Error searching locations:', error);
        res.status(500).json({ message: 'Error searching locations' });
    }
};

// Get location by ID
exports.getLocationById = async (req, res) => {
    try {
        const location = await Location.findById(req.params.id).populate('events');
        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }
        res.json(location);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Helper function for distance calculation
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Helper function for array shuffling
function shuffleArray(array, seed) {
    const rng = seedrandom(seed);
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}