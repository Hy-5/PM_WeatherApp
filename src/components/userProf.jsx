import React, { useState } from 'react';
import { Container, Card, Button, Form, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import Autosuggest from 'react-autosuggest';
import { useGeoLocationService, getSuggestionValue, renderSuggestion } from './locPull';

function UserProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = location.state || {};
  
  const [username, setUsername] = useState(user?.username || '');
  const [password, setPassword] = useState(user?.password || '');
  const [userLocation, setUserLocation] = useState(user?.location || '');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [selectedLocationData, setSelectedLocationData] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  
  const { getSuggestions } = useGeoLocationService('9a237f649b55a4f5183dd716c1fa7d1c');
  
  if (!user) {
    return (
      <Container className="mt-5 text-center">
        <h3>No user data found.</h3>
        <Button variant="secondary" onClick={() => navigate('/main')}>Back to Main</Button>
      </Container>
    );
  }

  const handleUpdate = async () => {
    if (!username || !password || !userLocation) {
      setMessage('Please fill in all fields.');
      setMessageType('danger');
      return;
    }

    const updateData = {
      id: user.id,
      username,
      password,
      location: userLocation
    };

    // Add lat/lon if location was selected from suggestions
    if (selectedLocationData) {
      updateData.lat = selectedLocationData.lat;
      updateData.lon = selectedLocationData.lon;
    }

    const result = await window.db.updateUser({ 
        id: user.id, 
        username, 
        password, 
        location: userLocation,
        lat: selectedLocationData?.lat,
        lon: selectedLocationData?.lon
    });


    if (result.success) {
      setMessage('Profile updated successfully!');
      setMessageType('success');
    } else {
      setMessage(result.error || 'Update failed.');
      setMessageType('danger');
    }
  };

  const onLocationSuggestionsFetchRequested = ({ value }) => {
    getSuggestions(value, setLocationSuggestions);
  };

  const onLocationSuggestionsClearRequested = () => {
    setLocationSuggestions([]);
  };

  const onLocationSuggestionSelected = (event, { suggestion }) => {
    setSelectedLocationData(suggestion);
  };

  const onLocationChange = (event, { newValue }) => {
    setUserLocation(newValue);
    if (!newValue) {
      setSelectedLocationData(null);
    }
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
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><strong>Password:</strong></Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </Form.Group>

          <Form.Group className="mb-4">
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

          <div className="d-grid gap-2">
            <div className="d-flex gap-2">
              <Button
                variant="primary"
                onClick={handleUpdate}
                className="flex-fill"
              >
                Update
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate('/main', { state: { ...user } })}
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