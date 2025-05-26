import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function AppNavbar({ user, historyDateRange, historyLocation }) {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (!user) return;
    navigate('/profile', {
      state: {
        ...user,
        historyDate_range: historyDateRange,
        historyLocation: historyLocation
      }
    });
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand onClick={() => navigate('/')}>
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
