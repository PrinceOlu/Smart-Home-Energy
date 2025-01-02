import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function NavBar() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId'); // Get userId from localStorage (or context/state)

  const handleLogout = () => {
    // Clear session data (e.g., localStorage)
    localStorage.removeItem('userId');
    navigate('/'); // Redirect to login page
  };

  return (
    <Navbar bg="primary" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href={userId ? `/dashboard/${userId}` : '/'}>Prince-Energy</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="#device">Device</Nav.Link>
          <Nav.Link href="#budget">Budget</Nav.Link>
          <Nav.Link onClick={handleLogout} style={{ cursor: 'pointer' }}>
            Logout
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavBar;
