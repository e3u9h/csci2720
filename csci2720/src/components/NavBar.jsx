// src/components/NavBar.jsx

import React, { useContext, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const NavBar = ({ toggleTheme }) => {
    const navigate = useNavigate();
    const { auth, logout } = useContext(AuthContext);

    const [mode, setMode] = useState('light');

    const handleThemeToggle = () => {
        toggleTheme();
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Button color="inherit" component={Link} to="/">
                        MyApp
                    </Button>
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {auth.token ? (
                        <>
                            <Button color="inherit" component={Link} to="/locations">
                                Locations
                            </Button>
                            <Button color="inherit" component={Link} to="/favorites">
                                Favorites
                            </Button>
                            <Button color="inherit" component={Link} to="/map" startIcon={<MapIcon />}>
                                Map
                            </Button>
                            <Button color="inherit" component={Link} to="/search ">
                                Search
                            </Button>
                            {auth.isAdmin && (
                                <Button color="inherit" component={Link} to="/admin">
                                    Admin Dashboard
                                </Button>
                            )}
                            <Typography variant="body1" sx={{ marginLeft: 2, marginRight: 2 }}>
                                Welcome, {auth.username}!
                            </Typography>
                            <IconButton color="inherit" onClick={handleThemeToggle}>
                                {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
                            </IconButton>
                            <Button color="inherit" onClick={handleLogout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" component={Link} to="/login">
                                Login
                            </Button>
                            <Button color="inherit" component={Link} to="/register">
                                Register
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;