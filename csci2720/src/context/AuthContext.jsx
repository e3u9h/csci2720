// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { register as apiRegister, login as apiLogin, logout as apiLogout } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        token: localStorage.getItem('token') || null,
        user: null,
        username: null,
        isAdmin: false,
    });

    useEffect(() => {
        if (auth.token) {
            try {
                const decoded = jwtDecode(auth.token);
                setAuth((prevAuth) => ({
                    ...prevAuth,
                    user: decoded,
                    username: decoded.username,
                    isAdmin: decoded.isAdmin, // Adjust based on your token structure
                }));
            } catch (error) {
                console.error('Invalid token:', error);
                setAuth({ token: null, user: null, isAdmin: false });
                localStorage.removeItem('token'); // Optional: Remove invalid token
            }
        }
    }, [auth.token]);

    // Login function
    const login = async (username, password, role) => {
        try {
            const response = await apiLogin({ username, password, role });
            const { token } = response.data;
            localStorage.setItem('token', token);
            const decoded = jwtDecode(token);
            setAuth({
                token: token,
                user: decoded,
                isAdmin: role === 'admin',
            });
            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await apiLogout();
            localStorage.removeItem('token');
            setAuth({ token: null, user: null, isAdmin: false });
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // Register function
    const register = async (username, password) => {
        try {
            await apiRegister({ username, password, role: 'user' });
            return true;
        } catch (error) {
            console.error('Registration error:', error);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};