import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import Autosuggest from 'react-autosuggest';
import { useGeoLocationService, getSuggestionValue, renderSuggestion } from './locPull';

function UserProfile() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const {
    id,
    username: initialUsername,
    password: initialPassword,
    location: initialLocationName,
    lat: initialLat,
    lon: initialLon,
    historyDate_range: initialHistoryDateRange,
    historyLocation: initialHistoryLocation
  } = state || {};

  // redirect if no user data
  if (!id) {
    return (
      <Container className="mt-5 text-center">
        <h3>No user data found.</h3>
        <Button variant="secondary" onClick={() => navigate('/main')}>
          Back to Main
        </Button>
      </Container>
    );
  }

  const [username, setUsername] = useState(initialUsername || '');
  const [password, setPassword] = useState(initialPassword || '');
  const [userLocation, setUserLocation] = useState(initialLocationName || '');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [selectedLocationData, setSelectedLocationData] = useState(
    initialLat != null && initialLon != null
      ? { lat: initialLat, lon: initialLon }
      : null
  );
  const [historyDateRange] = useState(initialHistoryDateRange || '');
  const [historyLocation] = useState(initialHistoryLocation || '');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const { getSuggestions } = useGeoLocationService('9a237f649b55a4f5183dd716c1fa7d1c');

  const handleUpdate = async () => {
    if (!username || !password || !userLocation) {
      setMessage('Please fill in all fields.');
      setMessageType('danger');
      return;
    }

    const updateData = {
      id,
      username,
      password,
      location: userLocation,
      lat: selectedLocationData?.lat ?? initialLat,
      lon: selectedLocationData?.lon ?? initialLon
    };

    const result = await window.db.updateUser(updateData);

    if (result.success) {
      const newState = {
        id,
        username,
        password,
        location: userLocation,
        lat: updateData.lat,
        lon: updateData.lon,
        historyDate_range: historyDateRange,
        historyLocation
      };

      setMessage('Profile updated successfully!');
      setMessageType('success');
      navigate('/main', { state: newState });
    } else {
      setMessage(result.error || 'Update failed.');
      setMessageType('danger');
    }
  };

  const handleDownload = async () => {
    try {
      const allUsers = await window.db.getAllUsers();
      const dataStr = JSON.stringify(allUsers, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'users.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setMessage('Download failed.');
      setMessageType('danger');
    }
  };

  const onLocationSuggestionsFetchRequested = ({ value }) =>
    getSuggestions(value, setLocationSuggestions);
  const onLocationSuggestionsClearRequested = () =>
    setLocationSuggestions([]);
  const onLocationSuggestionSelected = (e, { suggestion }) =>
    setSelectedLocationData(suggestion);
  const onLocationChange = (e, { newValue }) => {
    setUserLocation(newValue);
    if (!newValue) setSelectedLocationData(null);
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '500px' }}>
      <Card>
        <Card.Header as="h5">User Profile</Card.Header>
        <Card.Body>
          {message && (
            <Alert variant={messageType} className="mb-3">
              {message}
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label><strong>Username:</strong></Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><strong>Password:</strong></Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><strong>Location:</strong></Form.Label>
            <Autosuggest
              suggestions={locationSuggestions}
              onSuggestionsFetchRequested={onLocationSuggestionsFetchRequested}
              onSuggestionsClearRequested={onLocationSuggestionsClearRequested}
              onSuggestionSelected={onLocationSuggestionSelected}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={{
                placeholder: 'Enter location',
                value: userLocation,
                onChange: onLocationChange,
                className: 'form-control'
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><strong>Date Range:</strong></Form.Label>
            <Form.Control
              type="text"
              readOnly
              value={historyDateRange}
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label><strong>Old Location Search:</strong></Form.Label>
            <Form.Control
              type="text"
              readOnly
              value={historyLocation}
            />
          </Form.Group>

          <div className="d-grid gap-2">
            <div className="d-flex gap-2">
              <Button variant="primary" onClick={handleUpdate} className="flex-fill">
                Update
              </Button>
              <Button variant="outline-success" onClick={handleDownload} className="flex-fill">
                Download
              </Button>
              <Button
                variant="secondary"
                onClick={() =>
                  navigate('/main', {
                    state: {
                      id,
                      username,
                      password,
                      location: userLocation,
                      lat: selectedLocationData?.lat ?? initialLat,
                      lon: selectedLocationData?.lon ?? initialLon,
                      historyDate_range: historyDateRange,
                      historyLocation
                    }
                  })
                }
                className="flex-fill"
              >
                Back
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default UserProfile;
