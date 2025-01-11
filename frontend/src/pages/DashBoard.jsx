import { Container } from 'react-bootstrap';
import NavBar from '../components/Layout/NavBar';
import DevicePage from './Devices/DevicePage';
import useAuth from '../hooks/useAuth';
const Dashboard = () => {
  const { userId, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <Container>
        <p>Checking authentication status...</p>
      </Container>
    );
  }

  if (!userId) {
    return (
      <Container>
        <p>Please log in to access the dashboard.</p>
      </Container>
    );
  }
  
  return (
    <>
      <NavBar />
      <Container>
         <DevicePage userId={userId} />
      </Container>
    </>
  );
};

export default Dashboard;