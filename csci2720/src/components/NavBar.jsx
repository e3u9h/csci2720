// src/components/NavBar.jsx

import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import { Brightness4, Brightness7, Home, Search, AdminPanelSettings, Login, PersonAdd, List } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Favorite } from '@mui/icons-material';

const NavBar = ({ toggleTheme, mode }) => {
    const navigate = useNavigate();
    const { auth, logout } = useContext(AuthContext);

    const handleThemeToggle = () => {
        toggleTheme();
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Button color="inherit" component={Link} to="/" startIcon={<Home />}>
                        CSCI2720 Project
                    </Button>
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {auth.token ? (
                        <>
                            <Button color="inherit" component={Link} to="/locations" startIcon={<List />}>
                                Locations
                            </Button>
                            {!auth.isAdmin && (
                                <Button color="inherit" component={Link} to="/favorites" startIcon={<Favorite />}>
                                    Favorites
                                </Button>
                            )}
                            <Button color="inherit" component={Link} to="/map" startIcon={<MapIcon />}>
                                Map
                            </Button>
                            <Button color="inherit" component={Link} to="/search" startIcon={<Search />}>
                                Search
                            </Button>
                            {auth.isAdmin && (
                                <Button color="inherit" component={Link} to="/admin" startIcon={<AdminPanelSettings />}>
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
                                <Button color="inherit" component={Link} to="/login" startIcon={<Login />}>
                                Login
                            </Button>
                                <Button color="inherit" component={Link} to="/register" startIcon={<PersonAdd />}>
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