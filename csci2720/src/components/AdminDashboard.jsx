import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Grid,
    Paper,
    TextField,
    Checkbox,
    FormControlLabel,
    Button,
    List,
    ListItem,
    ListItemText,
    Snackbar,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
} from '@mui/material';
import API from '../services/api';

const AdminDashboard = () => {
    const [newUser, setNewUser] = useState({ username: '', password: '', isAdmin: false });
    const [users, setUsers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const [selectedRole, setSelectedRole] = useState('user');
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        fetchUsersAndAdmins();
    }, []);

    const fetchUsersAndAdmins = async () => {
        try {
            const userResponse = await API.get('/api/users');
            const adminResponse = await API.get('/api/admins');
            setUsers(userResponse.data);
            setAdmins(adminResponse.data);
        } catch (error) {
            setFeedback({ message: 'Error fetching users or admins', type: 'error' });
            setSnackbarOpen(true);
        }
    };

    const handleCreateUser = async () => {
        try {
            const endpoint = newUser.isAdmin ? '/api/admins' : '/api/users';
            await API.post(endpoint, {
                username: newUser.username,
                password: newUser.password,
            });
            setFeedback({ message: 'User created successfully!', type: 'success' });
            setSnackbarOpen(true);
            setNewUser({ username: '', password: '', isAdmin: false });
            fetchUsersAndAdmins();
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred';
            setFeedback({ message: 'Error creating user: ' + errorMessage, type: 'error' });
            setSnackbarOpen(true);
        }
    };

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setSelectedRole('user');
        setNewUser({ username: user.username, password: '', isAdmin: false });
    };

    const handleSelectAdmin = (admin) => {
        setSelectedUser(admin);
        setSelectedRole('admin');
        setNewUser({ username: admin.username, password: '', isAdmin: true });
    };

    const handleModifyUser = async () => {
        try {
            const endpoint = selectedRole === 'admin' ? '/api/admins' : '/api/users';
            await API.put(`${endpoint}/${selectedUser._id}`, {
                username: newUser.username,
                password: newUser.password,
            });

            setFeedback({ message: 'User updated successfully!', type: 'success' });
            setSnackbarOpen(true);
            setSelectedUser(null);
            setNewUser({ username: '', password: '', isAdmin: false });
            fetchUsersAndAdmins();
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred';
            setFeedback({ message: 'Error updating user: ' + errorMessage, type: 'error' });
            setSnackbarOpen(true);
        }
    };

    const handleDeleteUser = async () => {
        try {
            if (!selectedUser) {
                setFeedback({ message: 'No user selected for deletion.', type: 'error' });
                setSnackbarOpen(true);
                return;
            }

            const userType = selectedRole === 'admin' ? 'admins' : 'users';
            await API.delete(`/api/${userType}/${selectedUser._id}`);

            setFeedback({ message: 'User deleted successfully!', type: 'success' });
            setSnackbarOpen(true);
            setSelectedUser(null);
            setNewUser({ username: '', password: '', isAdmin: false });
            fetchUsersAndAdmins();
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred';
            setFeedback({ message: 'Error deleting user: ' + errorMessage, type: 'error' });
            setSnackbarOpen(true);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const getListItemStyles = (isSelected) => ({
        borderRadius: 2,
        backgroundColor: isSelected ? '#d3d3d3' : 'inherit',
        fontWeight: isSelected ? 'bold' : 'normal',
        transition: 'background-color 0.3s ease, font-weight 0.3s ease',
        '&:hover': {
            backgroundColor: isSelected ? '#a9a9a9' : 'grey.300',
            transition: 'background-color 0.3s ease',
        },
        '& .MuiListItemText-primary': {
            fontWeight: isSelected ? 'bold' : 'normal',
        },
    });

    // events
    const [newEvent, setNewEvent] = useState({ title: '', description: '' });
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [eventsPerPage] = useState(10);
    const [venues, setVenues] = useState([]);
    const [newnewEvent, setNewnewEvent] = useState({ title: '', description: '', dateTime: '', presenter: '', venue: '' });

    useEffect(() => {
        fetchEvents(currentPage, eventsPerPage);
        fetchVenues();

    }, [currentPage, eventsPerPage]);

    const fetchEvents = async (page, limit) => {
        try {
            const response = await API.get('/api/events');
            console.log(response.data);
            setEvents(response.data);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            setFeedback({ message: 'Error fetching events', type: 'error' });
            setSnackbarOpen(true);
        }
    };

    const fetchVenues = async () => {
        try {
            const response = await API.get('/locations');
            setVenues(response.data);
        } catch (error) {
            setFeedback({ message: 'Error fetching venues', type: 'error' });
            setSnackbarOpen(true);
        }
    };

    const handleCreateEvent = async () => {
        try {
            await API.post('/api/events', {
                title: newnewEvent.title,
                description: newnewEvent.description,
                dateTime: newnewEvent.dateTime,
                presenter: newnewEvent.presenter,
                venue: newnewEvent.venue,
            });
            setFeedback({ message: 'Event created successfully!', type: 'success' });
            setSnackbarOpen(true);
            setNewEvent({ title: '', description: '' });
            fetchEvents();
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
            setFeedback({ message: `Error creating event: ${errorMessage}`, type: 'error' });
            setSnackbarOpen(true);
        }
    };

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setNewEvent({ title: event.title, description: event.description, dateTime: event.dateTime, presenter: event.presenter, venue: event.venue._id, _id: event._id });
    };

    const handleModifyEvent = async () => {
        try {
            await API.put(`/api/events/${selectedEvent._id}`, {
                title: newEvent.title,
                description: newEvent.description,
                dateTime: newEvent.dateTime,
                presenter: newEvent.presenter,
                venue: newEvent.venue,
            });
            setFeedback({ message: 'Event updated successfully!', type: 'success' });
            setSnackbarOpen(true);
            setSelectedEvent(null);
            setNewEvent({ title: '', description: '' });
            fetchEvents();
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
            setFeedback({ message: `Error updating event: ${errorMessage}`, type: 'error' });
            setSnackbarOpen(true);
        }
    };

    const handleDeleteEvent = async () => {
        try {
            if (!selectedEvent) {
                setFeedback({ message: 'No event selected for deletion.', type: 'error' });
                setSnackbarOpen(true);
                return;
            }

            await API.delete(`/api/events/${selectedEvent._id}`);
            setFeedback({ message: 'Event deleted successfully!', type: 'success' });
            setSnackbarOpen(true);
            setSelectedEvent(null);
            setNewEvent({ title: '', description: '' });
            fetchEvents();
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
            setFeedback({ message: `Error deleting event: ${errorMessage}`, type: 'error' });
            setSnackbarOpen(true);
        }
    };
    const handleChangePage = (event, value) => {
        setCurrentPage(value);
    };


    return (
        <Container maxWidth="md" style={{ marginTop: '2rem' }}>
            <Typography variant="h4" gutterBottom>
                Admin Dashboard
            </Typography>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={1000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={feedback.type} sx={{ width: '100%' }}>
                    {feedback.message}
                </Alert>
            </Snackbar>

            <Paper elevation={3} style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <Typography variant="h6" gutterBottom>
                    Create User
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Username"
                            variant="outlined"
                            fullWidth
                            value={newUser.username}
                            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={newUser.isAdmin}
                                    onChange={() => setNewUser((prev) => ({ ...prev, isAdmin: !prev.isAdmin }))}
                                />
                            }
                            label="Admin User"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" onClick={handleCreateUser}>
                            Create User
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} style={{ padding: '1rem' }}>
                        <Typography variant="h6" gutterBottom>
                            User List
                        </Typography>
                        <List>
                            {users.map((user) => {
                                const isSelected = selectedUser?._id === user._id && selectedRole === 'user';
                                return (
                                    <ListItem
                                        button
                                        key={user._id}
                                        onClick={() => handleSelectUser(user)}
                                        selected={isSelected}
                                        sx={getListItemStyles(isSelected)}
                                    >
                                        <ListItemText primary={`${user.username} (User)`} />
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} style={{ padding: '1rem' }}>
                        <Typography variant="h6" gutterBottom>
                            Admin List
                        </Typography>
                        <List>
                            {admins.map((admin) => {
                                const isSelected = selectedUser?._id === admin._id && selectedRole === 'admin';
                                return (
                                    <ListItem
                                        button
                                        key={admin._id}
                                        onClick={() => handleSelectAdmin(admin)}
                                        selected={isSelected}
                                        sx={getListItemStyles(isSelected)}
                                    >
                                        <ListItemText primary={`${admin.username} (Admin)`} />
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Paper>
                </Grid>
            </Grid>

            {selectedUser && (
                <Paper elevation={3} style={{ padding: '1.5rem', marginTop: '2rem' }}>
                    <Typography variant="h6" gutterBottom>
                        Modify {selectedRole === 'user' ? 'User' : 'Admin'}
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Username"
                                variant="outlined"
                                fullWidth
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="New Password"
                        type="password"
                                variant="outlined"
                                fullWidth
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Button variant="contained" color="primary" onClick={handleModifyUser} fullWidth>
                                Update User
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Button variant="outlined" color="secondary" onClick={handleDeleteUser} fullWidth>
                                Delete User
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            )}
            <Paper elevation={3} style={{ padding: '1.5rem', marginTop: '2rem' }}>
                <Typography variant="h6" gutterBottom>
                    Manage Events
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Title"
                            variant="outlined"
                            fullWidth
                            value={newnewEvent.title}
                            onChange={(e) => setNewnewEvent({ ...newnewEvent, title: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Date & Time"
                            type="datetime-local"
                            variant="outlined"
                            fullWidth
                            value={newnewEvent.dateTime}
                            onChange={(e) => setNewnewEvent({ ...newnewEvent, dateTime: e.target.value })}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Description"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={3}
                            value={newnewEvent.description}
                            onChange={(e) => setNewnewEvent({ ...newnewEvent, description: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Presenter"
                            variant="outlined"
                            fullWidth
                            value={newnewEvent.presenter}
                            onChange={(e) => setNewnewEvent({ ...newnewEvent, presenter: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl variant="outlined" fullWidth>
                            <InputLabel>Venue</InputLabel>
                            <Select
                                value={newnewEvent.venue}
                                label="Venue"
                                onChange={(e) => setNewnewEvent({ ...newnewEvent, venue: e.target.value })}
                            >
                                {venues.map((venue) => (
                                    <MenuItem key={venue._id} value={venue._id}>
                                        {venue.name}
                                    </MenuItem>
                                ))}

                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" onClick={handleCreateEvent} fullWidth>
                            Create Event
                        </Button>
                    </Grid>
                </Grid>

                <Typography variant="h6" gutterBottom style={{ marginTop: '2rem' }}>
                    Event List
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', margin: '1rem', overflowY: 'auto', height: '40vh' }}>
                <List>
                    {events.map((event) => {
                        const isSelected = selectedEvent?._id === event._id;
                        return (
                            <ListItem
                                button
                                key={event._id}
                                onClick={() => handleSelectEvent(event)}
                                selected={isSelected}
                                style={getListItemStyles(isSelected)}
                            >
                                <ListItemText primary={`${event.title}`} secondary={event.dateTime} primaryTypographyProps={{
                                    style: { fontWeight: isSelected ? 'bold' : 'normal' }
                                }} />
                            </ListItem>
                        );
                    })}
                </List>
                </Box>

                {selectedEvent && (
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Title"
                                variant="outlined"
                                fullWidth
                                value={newEvent.title}
                                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Date & Time"
                                variant="outlined"
                                fullWidth
                                value={newEvent.dateTime}
                                onChange={(e) => setNewEvent({ ...newEvent, dateTime: e.target.value })}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Description"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={3}
                                value={newEvent.description}
                                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Presenter"
                                variant="outlined"
                                fullWidth
                                value={newEvent.presenter}
                                onChange={(e) => setNewEvent({ ...newEvent, presenter: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel>Venue</InputLabel>
                                <Select
                                    value={newEvent.venue}
                                    label="Venue"
                                    onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                                >
                                    {venues.map((venue) => (
                                        <MenuItem key={venue._id} value={venue._id}>
                                            {venue.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" onClick={handleModifyEvent} fullWidth>
                                Update Event
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleDeleteEvent} fullWidth>
                                Delete Event
                            </Button>
                        </Grid>
                    </Grid>
                )}
            </Paper>

        </Container >

    );
};

export default AdminDashboard;
