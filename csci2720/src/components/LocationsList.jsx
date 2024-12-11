import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

const LocationsList = ({ locations }) => {
    const [sortAsc, setSortAsc] = useState(true);

    const sortedLocations = [...locations].sort((a, b) => {
        if (sortAsc) return a.events.length - b.events.length;
        return b.events.length - a.events.length;
    });

    const toggleSort = () => setSortAsc(!sortAsc);

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                Locations
            </Typography>
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
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><Typography variant="h6">Name</Typography></TableCell>
                            <TableCell><Typography variant="h6">Number of Events</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedLocations.map(location => (
                            <TableRow key={location._id}>
                                <TableCell>
                                    <Link to={`/locations/${location._id}`} style={{ textDecoration: 'none', color: '#1976d2' }}>
                                        {location.name}
                                    </Link>
                                </TableCell>
                                <TableCell>{location.events.length}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default LocationsList;