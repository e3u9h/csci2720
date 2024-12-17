// src/theme.js
import { createTheme } from '@mui/material/styles';

const getTheme = (mode) =>
    createTheme({
        palette: {
            mode,
            primary: {
                main: '#1976d2',
            },
            secondary: {
                main: '#dc004e',
            },
            background: {
                default: mode === 'light' ? '#ffffff' : '#121212',
                paper: mode === 'light' ? '#f5f5f5' : '#1e1e1e',
            },
        },
    });

export default getTheme;