// navbar.jsx
import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function AppNavbar({ user }) {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (user) {
      navigate('/profile', { state: { ...user } });
    }
  };

  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand onClick={() => navigate('/main')} style={{ cursor: 'pointer' }}>
          PM Weather
        </Navbar.Brand>
        <Nav className="ms-auto">
          {user && (
            <Nav.Link onClick={handleProfileClick}>
              {user.username}
            </Nav.Link>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
