// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register'; // Import Register component
import LocationsList from './components/LocationsList';
import LocationDetail from './components/LocationDetail';
import AdminDashboard from './components/AdminDashboard';
import Favorites from './components/Favorites';
import NavBar from './components/NavBar'; // Optional: Navigation bar
import MapView from './components/MapView'; // Import MapView component
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme'; // Path to your custom theme
import { Container } from '@mui/material';
import API from './services/api';

const App = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const getLocations = async () => {
      const { data } = await API.get('/locations/tenrandom').catch(console.error);
      setLocations(data);
    };
    getLocations();
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Container maxWidth="lg" sx={{ height: '100vh', padding: 2 }}>
            <NavBar />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} /> {/* Add Register route */}
              <Route
                path="/locations"
                element={
                  <PrivateRoute>
                    <LocationsList locations={locations} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/locations/:id"
                element={
                  <PrivateRoute>
                    <LocationDetail />
                  </PrivateRoute>
                }
              />
              <Route
                path="/favorites"
                element={
                  <PrivateRoute>
                    <Favorites />
                  </PrivateRoute>
                }
              />
              <Route
                path="/map"
                element={
                  <PrivateRoute>
                    <MapView locations={locations} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route path="/" element={<Navigate to="/locations" />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </Container>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

const PrivateRoute = ({ children }) => {
  const { auth } = React.useContext(AuthContext);
  return auth.token ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { auth } = React.useContext(AuthContext);
  return auth.token && auth.isAdmin ? children : <Navigate to="/login" />;
};

export default App;
