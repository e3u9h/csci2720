import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Stack,
} from '@mui/material';
import { ArrowUpward, ArrowDownward, FilterList } from '@mui/icons-material';

const LocationsList = ({ locations }) => {
    const [sortAsc, setSortAsc] = useState(true);
    const [filterOpen, setFilterOpen] = useState(false);
    const [category, setCategory] = useState('all');
    const [distance, setDistance] = useState('');
    const [userLocation, setUserLocation] = useState(null);
    const [filteredLocations, setFilteredLocations] = useState(locations);

    // Categories from the events.xml file
    const categories = [
        { value: 'inc4', label: 'Sports & Recreation' },
        { value: 'inc7', label: 'Library Activities' },
        // Add more categories as needed
    ];

    useEffect(() => {
        // Get user's location when component mounts
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        }
    }, []);

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    };

    const applyFilters = () => {
        let filtered = [...locations];

        // Filter by category
        if (category !== 'all') {
            filtered = filtered.filter(location => 
                location.events.some(event => event.category === category)
            );
        }

        // Filter by distance if user location and distance are available
        if (userLocation && distance) {
            filtered = filtered.filter(location => {
                const dist = calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    location.latitude,
                    location.longitude
                );
                return dist <= parseFloat(distance);
            });
        }

        setFilteredLocations(filtered);
        setFilterOpen(false);
    };

    const sortedLocations = [...filteredLocations].sort((a, b) => {
        if (sortAsc) return a.events.length - b.events.length;
        return b.events.length - a.events.length;
    });

    const handleFilterOpen = () => setFilterOpen(true);
    const handleFilterClose = () => setFilterOpen(false);

    const toggleSort = () => setSortAsc(!sortAsc);

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                Locations
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={toggleSort}
                    startIcon={sortAsc ? <ArrowUpward /> : <ArrowDownward />}
                >
                    Sort by Number of Events ({sortAsc ? 'Ascending' : 'Descending'})
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<FilterList />}
                    onClick={handleFilterOpen}
                >
                    Filter
                </Button>
            </Box>

            <Dialog open={filterOpen} onClose={handleFilterClose}>
                <DialogTitle>Filter Locations</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ minWidth: 300, mt: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={category}
                                label="Category"
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <MenuItem value="all">All Categories</MenuItem>
                                {categories.map((cat) => (
                                    <MenuItem key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            type="number"
                            label="Distance (km)"
                            value={distance}
                            onChange={(e) => setDistance(e.target.value)}
                            InputProps={{ inputProps: { min: 0 } }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleFilterClose}>Cancel</Button>
                    <Button onClick={applyFilters} variant="contained">
                        Apply Filters
                    </Button>
                </DialogActions>
            </Dialog>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><Typography variant="h6">Name</Typography></TableCell>
                            <TableCell><Typography variant="h6">Number of Events</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedLocations.map(location => (
                            <TableRow key={location._id}>
                                <TableCell>
                                    <Link to={`/locations/${location._id}`} style={{ textDecoration: 'none', color: '#1976d2' }}>
                                        {location.name}
                                    </Link>
                                </TableCell>
                                <TableCell>{location.events.length}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default LocationsList;