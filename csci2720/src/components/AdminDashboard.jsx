import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [locations, setLocations] = useState([]);
    const [newLocation, setNewLocation] = useState({ name: '', latitude: '', longitude: '' });

    useEffect(() => {
        const fetchLocations = async () => {
            const { data } = await axios.get('http://localhost:5000/api/locations');
            setLocations(data);
        };
        fetchLocations();
    }, []);

    const handleAddLocation = async () => {
        await axios.post('http://localhost:5000/api/locations', newLocation);
        setNewLocation({ name: '', latitude: '', longitude: '' });
        // Refresh locations
        const { data } = await axios.get('http://localhost:5000/api/locations');
        setLocations(data);
    };

    // Implement update and delete functionality similarly

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <h3>Add New Location</h3>
            <input
                placeholder="Name"
                value={newLocation.name}
                onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
            />
            <input
                placeholder="Latitude"
                value={newLocation.latitude}
                onChange={(e) => setNewLocation({ ...newLocation, latitude: e.target.value })}
            />
            <input
                placeholder="Longitude"
                value={newLocation.longitude}
                onChange={(e) => setNewLocation({ ...newLocation, longitude: e.target.value })}
            />
            <button onClick={handleAddLocation}>Add Location</button>
            <h3>Existing Locations</h3>
            <ul>
                {locations.map(location => (
                    <li key={location._id}>
                        {location.name}
                        {/* Add buttons for Edit and Delete */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminDashboard;