// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { register as apiRegister, login as apiLogin, } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                return {
                    token,
                    user: decoded,
                    username: decoded.username,
                    isAdmin: decoded.isAdmin
                };
            } catch (error) {
                console.error(error);
                localStorage.removeItem('token');
                return {
                    token: null,
                    user: null,
                    username: null,
                    isAdmin: false,
                };
            }
        } else {
            return {
                token: null,
                user: null,
                username: null,
                isAdmin: false,
            };
        }
    });

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
                username: decoded.username,
                isAdmin: role === 'admin',
            });
            console.log('Logged in:', auth);
            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    // Logout function
    const logout = async () => {
        try {
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