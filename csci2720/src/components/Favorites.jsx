import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            const { data } = await axios.get('http://localhost:5000/api/users/favorites');
            setFavorites(data);
        };
        fetchFavorites();
    }, []);

    return (
        <div>
            <h2>My Favorites</h2>
            <ul>
                {favorites.map(location => (
                    <li key={location._id}>
                        <Link to={`/locations/${location._id}`}>{location.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Favorites;