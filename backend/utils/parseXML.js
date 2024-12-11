const fs = require('fs');
const xml2js = require('xml2js');
const mongoose = require('mongoose');
const axios = require('axios');
const dotenv = require('dotenv');

const Location = require('../models/Location');
const Event = require('../models/Event');
const Admin = require('../models/Admin');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yourdatabase';
const VENUES_XML_PATH = 'data/venues.xml';
const EVENTS_XML_PATH = 'data/events.xml';
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Validate API Key
if (!GOOGLE_MAPS_API_KEY) {
    console.error('Error: GOOGLE_MAPS_API_KEY is not set in the environment variables.');
    process.exit(1);
}

// Connect to MongoDB
mongoose
    .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB Connected');
        parseData();
    })
    .catch((err) => {
        console.error('MongoDB Connection Error:', err);
    });

/**
 * Function to get geocode using venue name
 * @param {string} venueName - Name of the venue in English
 * @returns {object|null} - { address, latitude, longitude } or null if failed
 */
const getGeocode = async (venueName) => {
    try {
        const encodedAddress = encodeURIComponent(venueName);
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${GOOGLE_MAPS_API_KEY}`;
        const response = await axios.get(url);
        const data = response.data;

        if (data.status === 'OK') {
            const result = data.results[0];
            const address = result.formatted_address;
            const latitude = result.geometry.location.lat;
            const longitude = result.geometry.location.lng;

            return { address, latitude, longitude };
        } else {
            console.warn(`Geocoding API Error for "${venueName}": ${data.status}`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching geocode for "${venueName}":`, error.message);
        return null;
    }
};

/**
 * Function to parse venues.xml
 * @returns {object} - Mapping of venueId to venue details
 */
const parseVenues = async () => {
    try {
        const xmlData = fs.readFileSync(VENUES_XML_PATH, 'utf-8');
        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(xmlData);

        const venues = result.venues.venue;
        console.log(`Total Venues Found: ${venues.length}`);

        const venueMap = {};

        for (const venue of venues) {
            const venueId = venue.$.id.trim();
            const nameE = venue.venuee ? venue.venuee[0].trim() : '';
            let latitude = venue.latitude && venue.latitude[0].trim() ? parseFloat(venue.latitude[0].trim()) : null;
            let longitude = venue.longitude && venue.longitude[0].trim() ? parseFloat(venue.longitude[0].trim()) : null;

            if (!latitude || !longitude) {
                // Fetch geocode using English name
                console.log(`Fetching geocode for venue "${nameE}" (ID: ${venueId})`);
                const geocode = await getGeocode(nameE);
                if (geocode) {
                    latitude = geocode.latitude;
                    longitude = geocode.longitude;
                    venueMap[venueId] = {
                        name: nameE,
                        address: geocode.address,
                        latitude,
                        longitude,
                    };
                    console.log(`Geocode fetched for "${nameE}": (${latitude}, ${longitude})`);
                } else {
                    console.warn(`Failed to fetch geocode for venue "${nameE}" (ID: ${venueId}). Skipping this venue.`);
                    continue; // Skip venues without coordinates
                }
            } else {
                venueMap[venueId] = {
                    name: nameE,
                    address: '', // Address not provided in venues.xml
                    latitude,
                    longitude,
                };
            }
        }

        console.log(`Total Eligible Venues with Coordinates: ${Object.keys(venueMap).length}`);
        return venueMap;
    } catch (err) {
        console.error('Error Parsing venues.xml:', err);
        return {};
    }
};

/**
 * Function to parse events.xml and associate with venues
 * @param {object} venueMap - Mapping of venueId to venue details
 */
const parseEvents = async (venueMap) => {
    try {
        const xmlData = fs.readFileSync(EVENTS_XML_PATH, 'utf-8');
        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(xmlData);

        const events = result.events.event;
        console.log(`Total Events Found: ${events.length}`);

        // Group events by venueId
        const venueEventMap = {};

        for (const event of events) {
            const venueId = event.venueid ? event.venueid[0].trim() : null;
            if (!venueId) {
                console.warn(`Event ID ${event.$.id} has no venueId. Skipping.`);
                continue;
            }
            if (!venueEventMap[venueId]) {
                venueEventMap[venueId] = [];
            }
            venueEventMap[venueId].push(event);
        }

        // Iterate through venueEventMap and insert data
        for (const [venueId, eventsList] of Object.entries(venueEventMap)) {
            if (!venueMap[venueId]) {
                console.warn(`Venue ID "${venueId}" not found in venues.xml or missing coordinates. Skipping associated events.`);
                continue;
            }

            const venueDetails = venueMap[venueId];

            // Check if location already exists in DB
            let location = await Location.findOne({ venueId });
            if (!location) {
                // Create Location Document
                location = new Location({
                    name: venueDetails.name,
                    venueId,
                    address: venueDetails.address,
                    latitude: venueDetails.latitude,
                    longitude: venueDetails.longitude,
                });
                await location.save();
                console.log(`Location Saved: ${venueDetails.name} (ID: ${venueId})`);
            }

            // Iterate through events and create Event Documents
            for (const event of eventsList) {
                const title = event.titlee ? event.titlee[0].trim() : 'No Title';
                const dateTimeStr = event.predateE ? event.predateE[0].trim() : '';
                const description = (event.desce && event.desce[0].trim() !== "") ? event.desce[0].trim() : 'No Description';
                const presenter = (event.presenterorgc && event.presenterorgc[0].trim() !== '')
                    ? event.presenterorgc[0].trim()
                    : 'No Presenter';

                // Directly assign the date string without parsing
                const dateTime = dateTimeStr;

                // Check if event already exists to prevent duplicates
                const existingEvent = await Event.findOne({ title, dateTime, venue: location._id });
                if (existingEvent) {
                    console.log(`Event "${title}" already exists. Skipping.`);
                    continue;
                }
                console.log(`Processing Event: "${title}", description: "${description}"`);
                // Create Event Document
                const eventDoc = new Event({
                    title,
                    dateTime, // Stored as string
                    description,
                    presenter,
                    venue: location._id,
                });

                await eventDoc.save();
                console.log(`Event Saved: "${title}"`);

                // Add event to location's events array if not already present
                if (!location.events.includes(eventDoc._id)) {
                    location.events.push(eventDoc._id);
                }
            }

            // Save updated Location with events
            await location.save();
            console.log(`Location Updated with Events: ${venueDetails.name} (ID: ${venueId})`);
        }

        console.log('Data Preprocessing Completed');
        const admin = await Admin.findOne({ username: 'admin' });
        console.log('Checking for default admin user', admin);
        if (!admin) {
            console.log('Creating default admin user: admin');
            const newAdmin = new Admin({
                username: 'admin',
                password: 'admin',
            });
            await newAdmin.save();
            console.log('Default admin user created with password: admin');
        }
        mongoose.connection.close();
    } catch (err) {
        console.error('Error Parsing events.xml:', err);
        mongoose.connection.close();
    }
};

/**
 * Main function to orchestrate parsing
 */
const parseData = async () => {
    const venueMap = await parseVenues();
    if (Object.keys(venueMap).length === 0) {
        console.error('No venues to process. Exiting.');
        mongoose.connection.close();
        return;
    }

    await parseEvents(venueMap);
};