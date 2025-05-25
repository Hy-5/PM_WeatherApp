import React from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../style.css';

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/main', { state: { username: 'JohnDoe' } });
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleSkip = () => {
    navigate('/main');
  };

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
      <h2 className="text-center mb-4">PM Accelerator - Weather App</h2>
      <h3 className="text-center mb-4">You can either log in, register or press the skip button on the bottom left</h3>

      <Form style={{ width: '100%', maxWidth: '400px' }}>
        <Form.Group controlId="username" className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="Enter username" />
        </Form.Group>

        <Form.Group controlId="password" className="mb-4">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Enter password" />
        </Form.Group>

        <div className="d-grid gap-2 mb-2">
          <Button variant="primary" onClick={handleLogin}>Sign In</Button>
          <Button variant="secondary" onClick={handleRegister}>Register</Button>
        </div>
      </Form>

      <div className="position-absolute bottom-0 end-0 p-3">
        <Button variant="link" className="text-muted" onClick={handleSkip}>Skip</Button>
      </div>
    </Container>
  );
}

export default LoginPage;
