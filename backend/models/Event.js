const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    dateTime: { type: String, required: true }, // Changed from Date to String
    description: { type: String, required: true },
    presenter: { type: String, required: true },
    venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
});

module.exports = mongoose.model('Event', eventSchema);