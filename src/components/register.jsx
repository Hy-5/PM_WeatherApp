import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Autosuggest from 'react-autosuggest';
import {
  useGeoLocationService,
  getSuggestionValue,
  renderSuggestion
} from './locPull.jsx';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();
  const { getSuggestions } = useGeoLocationService('9a237f649b55a4f5183dd716c1fa7d1c');

  // Autosuggest handlers
  const onSuggestionsFetchRequested = ({ value }) => {
    getSuggestions(value, setSuggestions);
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onChange = (event, { newValue }) => {
    setSearch(newValue);
  };

  const onSuggestionSelected = (event, { suggestion }) => {
    setSelectedLocation(suggestion);
  };

  const inputProps = {
    placeholder: 'Enter location..',
    value: search,
    onChange: onChange,
    className: 'form-control mb-3'
  };

  const handleSubmit = async () => {
    if (!username || !password || !selectedLocation) {
      setErrorMessage('Please fill in all fields and select a location from suggestions.');
      return;
    }

    const result = await window.db.registerUser({
      username,
      password,
      location: selectedLocation.name,
      lat: selectedLocation.lat,
      lon: selectedLocation.lon
    });

    if (result.success) {
      setErrorMessage('');
      setSuccessMessage('Registration successful! Redirecting...');
      setTimeout(() => navigate('/'), 1000);
    } else {
      setSuccessMessage('');
      setErrorMessage(`Registration failed: ${result.error}`);
    }
  };

  // Clean up autosuggest containers on unmount | to try and bypass alert-related typing bug | clean up if not needed after
  useEffect(() => {
    return () => {
      document.querySelectorAll('.react-autosuggest__suggestions-container')
        .forEach(el => el.remove());
    };
  }, []);

  return (
    <Container className="mt-5">
      <h2>Register</h2>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Location</Form.Label>
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            onSuggestionSelected={onSuggestionSelected}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
            theme={{
              container: 'position-relative',
              suggestionsContainer: 'position-absolute w-100',
              suggestionsContainerOpen: 'border border-secondary rounded bg-white shadow-sm',
              suggestionsList: 'list-unstyled m-0 p-0',
              suggestion: 'px-3 py-2 cursor-pointer',
              suggestionHighlighted: 'bg-light'
            }}
          />
        </Form.Group>

        {errorMessage && (
          <Alert variant="danger" className="mt-2">{errorMessage}</Alert>
        )}
        {successMessage && (
          <Alert variant="success" className="mt-2">{successMessage}</Alert>
        )}

        <Button onClick={handleSubmit} className="mt-3">Submit</Button>
      </Form>
    </Container>
  );
}

export default Register;
