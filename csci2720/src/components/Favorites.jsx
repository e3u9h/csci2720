import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    Paper,
    Alert,
    CircularProgress
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { auth } = useContext(AuthContext);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get('/api/users/favorites', {
                    headers: { Authorization: `Bearer ${auth.token}` }
                });
                setFavorites(data);
            } catch (err) {
                setError('Failed to load favorites');
                console.error('Error fetching favorites:', err);
            } finally {
                setLoading(false);
            }
        };

        if (auth.token) {
            fetchFavorites();
        }
    }, [auth.token]);

    if (loading) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
        </Box>
    );

    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box sx={{ padding: 3, maxWidth: 800, margin: '0 auto' }}>
            <Typography variant="h4" gutterBottom>My Favorite Locations</Typography>
            <Paper sx={{ padding: 2 }}>
                {favorites.length > 0 ? (
                    <List>
                        {favorites.map(location => (
                            <ListItem
                                key={location._id}
                                component={Link}
                                to={`/locations/${location._id}`}
                                sx={{
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    '&:hover': {
                                        backgroundColor: 'action.hover'
                                    }
                                }}
                            >
                                <LocationOnIcon sx={{ mr: 2, color: 'primary.main' }} />
                                <ListItemText
                                    primary={location.name}
                                    secondary={`${location.events?.length || 0} upcoming events`}
                                />
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography color="text.secondary" align="center">
                        You haven't added any favorite locations yet
                    </Typography>
                )}
            </Paper>
        </Box>
    );
};

export default Favorites;