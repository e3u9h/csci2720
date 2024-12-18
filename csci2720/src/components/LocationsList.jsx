import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Slider, 
    FormControl, 
    Select, 
    MenuItem, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper,
    Alert,
    CircularProgress,
    Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

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

const LocationsListWithFilter = ({ locations }) => {
    const [locationsDist, setLocationsDist] = useState(locations.map((location) => ({
        ...location,
        distance: null
    })));
  const [distance, setDistance] = useState(50);
    const [category, setCategory] = useState('all');
    const [userLocation, setUserLocation] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);
    const [sortAsc, setSortAsc] = useState(true);
    const [filteredLocations, setFilteredLocations] = useState(locations);


    const toggleSort = () => setSortAsc(!sortAsc);

  const categories = [
      { value: 'Library', label: 'Library' },
      { value: 'Lecture Room', label: 'Lecture Room' },
      { value: 'Function Room', label: 'Function Room' },
      { value: 'Auditorium', label: 'Auditorium' },
      { value: 'Others', label: 'Others' }
  ];
    console.log("hello2")

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
            const sortedLocations = [...locationsDist].sort((a, b) => {
                if (sortAsc) return a.events.length - b.events.length;
                return b.events.length - a.events.length;
            });
            const filtered = sortedLocations.filter((location) => {
                if (category !== 'all' && location.categories.indexOf(category) === -1) {
                    return false;
                }
                return location.distance <= distance;
            });
            setFilteredLocations(filtered);
        }
    }, [distance, category, sortAsc, locationsDist, userLocation]);


  return (
    <Box sx={{ 
          height: 'calc(100vh - 64px)',
      display: 'flex', 
      flexDirection: 'column',
          overflow: 'hidden',
      bgcolor: '#f5f5f5'
      }}>
      <Box sx={{ 
        p: 3,
        backgroundColor: 'white',
        borderBottom: 1,
        borderColor: 'divider'
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center'
        }}>
          <Typography variant="h4" sx={{ fontWeight: 500 }}>Location List</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                      <Button
                          variant="contained"
                          color="primary"
                          onClick={toggleSort}
                          startIcon={sortAsc ? <ArrowUpward /> : <ArrowDownward />}
                      >
                          Sort by Number of Events ({sortAsc ? 'Ascending' : 'Descending'})
                      </Button>
                  </Box>
          
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

      <Box sx={{ 
        flex: 1,
        p: 3,
        overflow: 'hidden',
        position: 'relative'
      }}>
        {error && (
          <Alert 
            severity="warning" 
            sx={{ 
              mb: 2,
              position: 'absolute',
              top: 24,
              left: 24,
              right: 24,
              zIndex: 1
            }}
          >
            {error}
          </Alert>
        )}
        
        <TableContainer 
          component={Paper} 
          sx={{ 
            height: '100%',
            position: 'relative',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
          }}
        >
          <Table stickyHeader sx={{ tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '40%', bgcolor: 'background.paper' }}>Name</TableCell>
                <TableCell sx={{ width: '30%', bgcolor: 'background.paper' }}>Distance</TableCell>
                <TableCell sx={{ width: '30%', bgcolor: 'background.paper' }}>Events</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                          {!dataLoading && filteredLocations.map(location => (
                <TableRow key={location._id} hover>
                  <TableCell>
                    <Link 
                      to={`/locations/${location._id}`}
                      style={{ 
                        textDecoration: 'none', 
                        color: '#1976d2',
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {location.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                                      {location.distance != null ? `${location.distance.toFixed(2)} km` : 'N/A'}
                  </TableCell>
                  <TableCell>{location.events?.length || 0}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {dataLoading && (
            <Box sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.7)'
            }}>
              <CircularProgress />
            </Box>
          )}

          {!dataLoading && locations.length === 0 && (
            <Box sx={{ 
              textAlign: 'center', 
              py: 8,
              color: 'text.secondary'
            }}>
              <Typography>No locations found</Typography>
            </Box>
          )}
        </TableContainer>
      </Box>
    </Box>
  );
};

export default LocationsListWithFilter;