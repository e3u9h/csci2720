// src/services/api.js

import axios from 'axios';

// Access the backend URL from environment variables
const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Create an Axios instance with the backend URL
const API = axios.create({
    baseURL: backendUrl, // Use the backend URL from .env
    withCredentials: true, // Include cookies if needed
});

// Add a request interceptor to attach the token to every request
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

API.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response && (error.response.status === 401)) {
        localStorage.removeItem('token');
    }
    return Promise.reject(error);
});
export default API;
// API Functions
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const logout = () => API.post('/auth/logout');
export const fetchLocations = () => API.get('/locations');
export const fetchLocationById = (id) => API.get(`/locations/${id}`);
export const fetchFavorites = () => API.get('/favorites');
// Add other API functions as needed