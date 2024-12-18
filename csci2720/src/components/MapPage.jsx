import MapView
    from "./MapView";
import React, { useEffect, useState } from "react";
import { Box, FormControl, MenuItem, Select, Slider, Typography } from "@mui/material";

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const MapPage = ({ locations }) => {
    const [locationsDist, setLocationsDist] = useState(locations.map((location) => ({
        ...location,
        distance: null
    })));
    const [distance, setDistance] = useState(50);
    const [category, setCategory] = useState('all');
    const [userLocation, setUserLocation] = useState(null);
    const [dataLoading, setDataLoading] = useState(true);
    const [filteredLocations, setFilteredLocations] = useState(locations);

    const categories = [
        { value: 'Library', label: 'Library' },
        { value: 'Lecture Room', label: 'Lecture Room' },
        { value: 'Function Room', label: 'Function Room' },
        { value: 'Auditorium', label: 'Auditorium' },
        { value: 'Others', label: 'Others' }
    ];
    console.log("hello");

    useEffect(() => {
        setDataLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    const locationsWithdistance = locations.map((location) => ({
                        ...location,
                        distance: calculateDistance(
                            position.coords.latitude,
                            position.coords.longitude,
                            location.latitude,
                            location.longitude
                        )
                    }));
                    console.log(locationsWithdistance);
                    setLocationsDist(locationsWithdistance);
                },
                (error) => {
                    console.warn("Location error:", error);
                }
            );
        }
        setDataLoading(false);
    }, [locations]);

    useEffect(() => {
        if (userLocation) {
            const filtered = locationsDist.filter((location) => {
                if (category !== 'all' && location.categories.indexOf(category) === -1) {
                    return false;
                }
                return location.distance <= distance;
            });
            setFilteredLocations(filtered);
        }
    }, [distance, category, locationsDist, userLocation]);

    return (
        <Box sx={{
            height: 'calc(100vh - 64px)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
        }}>
            <Box sx={{
                p: 3,
                borderBottom: 1,
                borderColor: 'divider'
            }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Typography variant="h4" sx={{ fontWeight: 500 }}>Map</Typography>

                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        backgroundColor: 'background.paper',
                        p: 2,
                        borderRadius: 1,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                        width: 'auto',
                        position: 'relative'
                    }}>

                        <Typography sx={{ minWidth: 'auto', whiteSpace: 'nowrap' }}>
                            Distance: {distance}km
                        </Typography>
                        <Slider
                            value={distance}
                            onChange={(_, newValue) => setDistance(newValue)}
                            min={0}
                            max={50}
                            size="small"
                            sx={{ width: 200 }}
                        />
                        <FormControl sx={{ minWidth: 150 }}>
                            <Select
                                value={category}
                                size="small"
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
                    </Box>
                </Box>
            </Box>
            <MapView locations={filteredLocations} displayLink={true} />
        </Box>

    );
}

export default MapPage;