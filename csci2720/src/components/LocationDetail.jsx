import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const LocationDetail = () => {
    const { id } = useParams();
    const { auth } = useContext(AuthContext);
    const [location, setLocation] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const fetchLocation = async () => {
            const { data } = await axios.get(`http://localhost:5000/api/locations/${id}`);
            setLocation(data);
        };
        const fetchComments = async () => {
            const { data } = await axios.get(`http://localhost:5000/api/locations/${id}/comments`);
            setComments(data);
        };
        const checkFavorite = async () => {
            const { data } = await axios.get('http://localhost:5000/api/users/favorites');
            setIsFavorite(data.some(fav => fav._id === id));
        };
        fetchLocation();
        fetchComments();
        if (auth) {
            checkFavorite();
        }
    }, [id, auth]);

    const handleAddComment = async () => {
        if (!newComment) return;
        await axios.post(`http://localhost:5000/api/locations/${id}/comments`, {
            text: newComment,
        });
        setNewComment('');
        // Refresh comments
        const { data } = await axios.get(`http://localhost:5000/api/locations/${id}/comments`);
        setComments(data);
    };

    const handleFavoriteToggle = async () => {
        if (!auth) return;
        
        try {
            if (isFavorite) {
                await axios.delete(`http://localhost:5000/api/users/favorites/${id}`);
            } else {
                await axios.post(`http://localhost:5000/api/users/favorites/${id}`);
            }
            setIsFavorite(!isFavorite);
        } catch (err) {
            console.error('Error updating favorites:', err);
        }
    };

    if (!location) return <div>Loading...</div>;

    return (
        <div>
            <h2>{location.name}</h2>
            {auth && (
                <button onClick={handleFavoriteToggle}>
                    {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
            )}
            {/* Map Integration would go here */}
            <p>Latitude: {location.latitude}</p>
            <p>Longitude: {location.longitude}</p>
            <h3>Events</h3>
            <ul>
                {location.events.map(event => (
                    <li key={event._id}>{event.title} - {new Date(event.datetime).toLocaleString()}</li>
                ))}
            </ul>
            <h3>Comments</h3>
            <ul>
                {comments.map(comment => (
                    <li key={comment._id}><strong>{comment.user.username}:</strong> {comment.text}</li>
                ))}
            </ul>
            <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment"
            ></textarea>
            <br />
            <button onClick={handleAddComment}>Submit Comment</button>
        </div>
    );
};

export default LocationDetail;