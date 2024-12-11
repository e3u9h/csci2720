// src/components/MapView.jsx

import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { Box, CircularProgress, Typography, Paper, Link as MUILink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const PoiMarkers = ({ pois, onMarkerClick }) => {
    return (
        <>
            {pois.map((poi) => (
                <AdvancedMarker
                    key={poi.key}
                    position={poi.location}
                    onClick={() => onMarkerClick(poi)}
                >
                    <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
                </AdvancedMarker>
            ))}
        </>
    );
};

const MapView = ({ locations }) => {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [poi, setPoi] = useState([]);
    const [center, setCenter] = useState({ lat: 22.28552, lng: 114.15769 });

    useEffect(() => {
        const poi_ = locations.map((location) => ({
            key: location._id,
            location: { lat: location.latitude, lng: location.longitude },
            data: location
        }));
        setPoi(poi_);
    }, [locations]);

    useEffect(() => {
        const center_ = locations.length > 0
            ? { lat: locations[0].latitude, lng: locations[0].longitude }
            : { lat: 22.28552, lng: 114.15769 };
        setCenter(center_);
    }, [locations]);

    const handleMarkerClick = (poiData) => {
        setSelectedLocation(poiData.data);
    };

    const handleCloseInfoWindow = () => {
        setSelectedLocation(null);
    };

    const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    return (
        <Box sx={{
            width: '100%',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 2,
        }}>
            {API_KEY ? (
                <APIProvider
                    solutionChannel="GMP_devsite_samples_v3_rgmbasicmap"
                    apiKey={API_KEY}
                >
                    <Map
                        defaultCenter={center}
                        defaultZoom={11}
                        style={{ width: '100%', height: '100%' }}
                        mapId={`DEMO_MAP_ID`}
                    >
                        {poi.length > 0 && <PoiMarkers pois={poi} onMarkerClick={handleMarkerClick} />}

                        {selectedLocation && (
                            <InfoWindow
                                position={{ lat: selectedLocation.latitude, lng: selectedLocation.longitude }}
                                onCloseClick={handleCloseInfoWindow}
                            >
                                <Paper sx={{ padding: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        {selectedLocation.name}
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        {selectedLocation.description}
                                    </Typography>
                                    <MUILink
                                        component={RouterLink}
                                        to={`/locations/${selectedLocation._id}`}
                                        underline="hover"
                                        color="primary"
                                    >
                                        View Details
                                    </MUILink>
                                </Paper>
                            </InfoWindow>
                        )}
                    </Map>
                </APIProvider>
            ) : (
                <CircularProgress />
            )}
        </Box>
    );
};

export default MapView;