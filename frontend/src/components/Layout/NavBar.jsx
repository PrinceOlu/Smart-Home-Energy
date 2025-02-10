import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import useAuth from '../../hooks/useAuth';
import Profile from './Profile';
function NavBar() {
  const { userId} = useAuth();
  const navigate = useNavigate();
  // const userId = localStorage.getItem('userId'); // Get userId from localStorage (or context/state)

  const handleLogout = () => {
    // Clear session data (e.g., localStorage)
    localStorage.removeItem('userId');
    navigate('/'); // Redirect to login page
  };

  return (
    <Navbar bg="primary" data-bs-theme="dark">
      <Container>
        <Navbar.Brand >Smart-Home-Energy</Navbar.Brand>
        
        <Nav className="me-auto">
          <Nav.Link href={userId ? `/dashboard` : '/'}>Device</Nav.Link>
          <Nav.Link href={userId ? `/EnergyUsageDashboard` : '/'}>Energy</Nav.Link>
          <Nav.Link href={userId ? `/BudgetPage` : '/'}>Budget</Nav.Link>
          <Nav.Link onClick={handleLogout} style={{ cursor: 'pointer' }}>
            Logout
          </Nav.Link>
          
        </Nav> 
       

      </Container>
      {userId && <Profile userId={userId} />}
    </Navbar>
  );
}

export default NavBar;
