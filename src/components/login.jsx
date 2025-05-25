import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../style.css';

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    document.querySelectorAll('.react-autosuggest__suggestions-container')
      .forEach(el => el.remove());
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    const result = await window.db.loginUser({ username, password });
    if (!result.success) {
      setErrorMessage(result.error);
      return;
    }

    const { user } = result;
    navigate('/main', {
      state: {
        id: user.id,
        username: user.username,
        password: user.password,
        location: user.location,
        lat: user.lat,
        lon: user.lon
      }
    });
  };

  const handleRegister = () => navigate('/register');
  const handleSkip     = () => navigate('/main');

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
      <h2 className="text-center mb-4">PM Accelerator - Weather App</h2>
      <h3 className="text-center mb-4">
        You can log in, register, or press “Skip” below
      </h3>

      <Form
        style={{ width: '100%', maxWidth: '400px' }}
        onSubmit={e => { e.preventDefault(); handleLogin(); }}
      >
        <Form.Group controlId="username" className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoComplete="username"
          />
        </Form.Group>

        <Form.Group controlId="password" className="mb-4">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </Form.Group>

        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        <div className="d-grid gap-2 mt-3">
          <Button type="submit" variant="primary">Sign In</Button>
          <Button variant="secondary" onClick={handleRegister}>Register</Button>
        </div>
      </Form>

      <div className="position-absolute bottom-0 end-0 p-3">
        <Button variant="link" className="text-muted" onClick={handleSkip}>
          Skip
        </Button>
      </div>
    </Container>
  );
}

export default LoginPage;