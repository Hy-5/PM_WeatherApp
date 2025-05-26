import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../style.css';

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
    <Navbar expand="lg" className='nav-back'>
      <Container>
        <Navbar.Brand onClick={() => navigate('/')}>
          PM Weather
        </Navbar.Brand>
        <Nav className="ms-auto">
          {user && (
            <Nav.Link onClick={handleProfileClick} style={{ color: 'black' }}>
              {user.username} - Profile
            </Nav.Link>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
