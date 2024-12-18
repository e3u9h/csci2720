const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    venueId: { type: String, required: true, unique: true },
    address: { type: String, default: '' },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    categories: { type: [String], required: true },
});

module.exports = mongoose.model('Location', locationSchema);