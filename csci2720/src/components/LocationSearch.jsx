import React, { useState } from 'react';
import axios from 'axios';

const LocationSearch = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState('');

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  // Handle search submission
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchKeyword.trim()) {
      setError('Please enter a search keyword');
      return;
    }

    try {
      // Replace with your actual API endpoint
      const response = await axios.get(`/api/locations/search?keyword=${searchKeyword}`);
      setLocations(response.data);
      setError('');
    } catch (err) {
      setError('Error searching locations: ' + err.message);
      setLocations([]);
    }
  };

  return (
    <div className="location-search">
      <h2>Search Locations</h2>
      
      {/* Search Form */}
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={searchKeyword}
          onChange={handleSearchChange}
          placeholder="Enter location name..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Results Table */}
      {locations.length > 0 && (
        <table className="locations-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Coordinates</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((location) => (
              <tr key={location._id}>
                <td>{location.name}</td>
                <td>{location.address}</td>
                <td>{`${location.latitude}, ${location.longitude}`}</td>
                <td>{location.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* No Results Message */}
      {locations.length === 0 && searchKeyword && !error && (
        <div className="no-results">No locations found</div>
      )}

      {/* CSS Styles */}
      <style jsx>{`
        .location-search {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .search-form {
          margin-bottom: 20px;
          display: flex;
          gap: 10px;
        }

        .search-input {
          padding: 8px;
          font-size: 16px;
          border: 1px solid #ddd;
          border-radius: 4px;
          flex-grow: 1;
        }

        .search-button {
          padding: 8px 16px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .search-button:hover {
          background-color: #0056b3;
        }

        .error-message {
          color: red;
          margin-bottom: 10px;
        }

        .locations-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        .locations-table th,
        .locations-table td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }

        .locations-table th {
          background-color: #f4f4f4;
        }

        .locations-table tr:nth-child(even) {
          background-color: #f8f8f8;
        }

        .no-results {
          text-align: center;
          padding: 20px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default LocationSearch;
