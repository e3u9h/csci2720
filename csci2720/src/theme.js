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
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        backgroundColor: mode === 'light' ? '#ffffff' : '#121212',
                        margin: 0,
                        padding: 0,
                        boxSizing: 'border-box',
                    },
                },
            },
        },
    });

export default getTheme;