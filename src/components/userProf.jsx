import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

function UserProfile() {
  const location = useLocation();
  const navigate = useNavigate();

  const user = location.state?.user;

  if (!user) {
    return (
      <Container className="mt-5 text-center">
        <h3>No user data found.</h3>
        <Button variant="secondary" onClick={() => navigate('/main')}>Back to Main</Button>
      </Container>
    );
  }

  return (
    <Container className="mt-5" style={{ maxWidth: '500px' }}>
      <Card>
        <Card.Header as="h5">User Profile</Card.Header>
        <Card.Body>
          <Card.Text><strong>Username:</strong> {user.username}</Card.Text>
          <Card.Text><strong>Password:</strong> {user.password}</Card.Text>
          <Card.Text><strong>Location:</strong> {user.location}</Card.Text>
          <Button
            variant="primary"
            onClick={() => navigate('/main', { state: { ...user } })} >
            Back
        </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default UserProfile;
