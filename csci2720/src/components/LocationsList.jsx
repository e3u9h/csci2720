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
    CircularProgress 
} from '@mui/material';
import { Link } from 'react-router-dom';
import API from '../services/api';

const LocationsListWithFilter = () => {
  const [distance, setDistance] = useState(50);
  const [category, setCategory] = useState('all');
  const [locations, setLocations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    { value: 'inc4', label: 'Sports & Recreation' },
    { value: 'inc7', label: 'Library Activities' }
  ];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationLoading(false);
        },
        (error) => {
          console.warn("Location error:", error);
          setLocationLoading(false);
        }
      );
    }
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setDataLoading(true);
        const params = new URLSearchParams({
          category,
          distance: distance.toString()
        });

        if (userLocation) {
          params.append('latitude', userLocation.lat.toString());
          params.append('longitude', userLocation.lng.toString());
        }

        const response = await API.get(`/locations/filter?${params}`);
        setLocations(response.data.locations);
        setError(null);
      } catch (err) {
        setError(err.message);
        setLocations([]);  // 确保在错误时清空位置列表
      } finally {
        setDataLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchLocations, 300);
    return () => clearTimeout(timeoutId);
  }, [distance, category, userLocation]);

  return (
    <Box sx={{ 
      height: 'calc(100vh - 64px)',  // 减去顶部导航栏的高度
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden',  // 防止整体滚动
      bgcolor: '#f5f5f5'
    }}>
      {/* 标题和过滤器区域 - 固定高度 */}
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
            {locationLoading && (
              <CircularProgress 
                size={20} 
                sx={{ 
                  position: 'absolute',
                  left: -30
                }} 
              />
            )}
            
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

      {/* 表格区域 - 剩余高度 */}
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
              {!dataLoading && locations.map(location => (
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
                    {location.distance != null ? `${location.distance} km` : 'N/A'}
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