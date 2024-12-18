// src/App.jsx
import React, { useState, useEffect, useMemo, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register'; // Import Register component
import LocationsList from './components/LocationsList';
import LocationDetail from './components/LocationDetail';
import AdminDashboard from './components/AdminDashboard';
import Favorites from './components/Favorites';
import NavBar from './components/NavBar'; // Optional: Navigation bar
import MapPage from './components/MapPage';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import getTheme from './theme'; // Path to your custom theme
import { Container } from '@mui/material';
import API from './services/api';
import LocationSearch from './components/LocationSearch';

const App = () => {
  const { auth } = useContext(AuthContext);
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode ? savedMode : 'light';
  });

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', newMode);
      return newMode;
    });
  };

  const theme = useMemo(() => getTheme(mode), [mode]);

  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const getLocations = async () => {
      if (!auth.token) return;
      const { data } = await API.get('/locations');
      setLocations(data);
    };
    getLocations();
  }, [auth.token]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <Router>
        <Container
          maxWidth={false}
          sx={{
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'background.default',
          }}
        >
            <NavBar toggleTheme={toggleTheme} mode={mode} />
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
                    <MapPage locations={locations} />
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
              <Route
                path="/search"
                element={
                  <PrivateRoute>
                    <LocationSearch />
                  </PrivateRoute>
                }
              />
              <Route path="/" element={<Navigate to="/locations" />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </Container>
      </Router>
    </ThemeProvider>
  );
};

const PrivateRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);
  return auth.token ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);
  console.log("111", auth);
  return auth.token && auth.isAdmin ? children : <Navigate to="/login" />;
};

export default App;
