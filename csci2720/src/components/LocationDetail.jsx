import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import MapView from './MapView';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    Container,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    TextField,
    Typography,
    useTheme,
} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';

const LocationDetail = () => {
    const { id } = useParams();
    const { auth } = useContext(AuthContext);
    const [location, setLocation] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        const fetchLocation = async () => {
            const { data } = await API.get(`/locations/${id}`);
            setLocation(data);
        };
        const fetchComments = async () => {
            const { data } = await API.get(`/api/locations/${id}/comments`);
            console.log(data);
            setComments(data);
        };
        const checkFavorite = async () => {
            const { data } = await API.get('/api/favorites');
            setIsFavorite(data.some(fav => fav._id === id));
        };
        fetchLocation();
        fetchComments();
        if (!auth.isAdmin) {
            checkFavorite();
        }
    }, [id, auth]);

    const handleAddComment = async () => {
        if (!newComment) return;
        await API.post(`/api/locations/${id}/comments`, {
            text: newComment,
        });
        setNewComment('');
        // Refresh comments
        const { data } = await API.get(`/api/locations/${id}/comments`);
        setComments(data);
    };

    const handleFavoriteToggle = async () => {
        if (!auth) return;
        
        try {
            if (isFavorite) {
                await API.delete(`/api/favorites/${id}`);
            } else {
                await API.post(`/api/favorites/${id}`);
            }
            setIsFavorite(!isFavorite);
        } catch (err) {
            console.error('Error updating favorites:', err);
        }
    };

    if (!location) return <CircularProgress />;

    return (
        <Container maxWidth="md" sx={{ marginTop: '1vh' }}>
            <Card>
                <CardHeader
                    title={location.name}
                    action={
                        !auth.isAdmin && (< Button
                            variant="contained"
                            color="primary"
                            onClick={handleFavoriteToggle}
                            sx={{ borderRadius: '16px', display: 'flex', alignItems: 'center' }}
                        >
                            {isFavorite ? <Favorite color="dark" /> : <FavoriteBorder />}
                            <Box sx={{ ml: 1 }}>{isFavorite ? "Remove from Favorites" : "Add To Favorities"}</Box>
                        </Button>)
                    }
                />
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1">Latitude: {location.latitude}</Typography>
                            <Typography variant="body1">Longitude: {location.longitude}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ height: '30vh' }}>
                                <MapView locations={[location]} displayLink={false} />
                            </Box>
                        </Grid>
                    </Grid>
                    <Typography variant="h6" gutterBottom>
                        Events
                    </Typography>
                    <List>
                        {location.events.map(event => (
                            <ListItem key={event._id}>
                                <Box sx={{ backgroundColor: theme.palette.mode === 'light' ? '#f0f0f0' : '#303030', padding: 2, borderRadius: 1, width: '100%' }}>
                                    <ListItemText
                                        primary={event.title}
                                        secondary={event.dateTime}
                                    />
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                    <Typography variant="h6" gutterBottom>
                        Comments
                    </Typography>
                    <List>
                        {comments.map(comment => (
                            <ListItem key={comment._id}>
                                <Box sx={{ backgroundColor: theme.palette.mode === 'light' ? '#e0e0e0' : '#424242', padding: 2, borderRadius: 1, width: '100%' }}>
                                    <ListItemText
                                        primary={<strong>{comment.user.username}:</strong>}
                                        secondary={comment.text}
                                    />
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                    {!auth.isAdmin && (<><TextField
                        label="Add a comment"
                        multiline
                        fullWidth
                        rows={4}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        variant="outlined"
                        margin="normal"
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddComment}
                        disabled={!newComment}
                    >
                        Submit Comment
                        </Button></>)}
                </CardContent>
            </Card>
        </Container>
    );
};

export default LocationDetail;