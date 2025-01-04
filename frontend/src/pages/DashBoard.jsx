import { Container } from 'react-bootstrap';
import NavBar from '../components/Layout/NavBar';
import { useEffect, useState } from 'react';
import TablePage from './Devices/DevicePage';

const Dashboard = () => {
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // First check localStorage
        let currentUserId = localStorage.getItem('userId');
        
        // If not in localStorage, check if user has an active session
        if (!currentUserId) {
          const response = await fetch('http://localhost:5000/api/auth/session', {
            credentials: 'include'
          });
          
          if (response.ok) {
            const data = await response.json();
            currentUserId = data.userId;
            // Save to localStorage for future use
            localStorage.setItem('userId', currentUserId);
          } else {
            // If no active session, redirect to login
            window.location.href = '/login';
            return;
          }
        }
        
        setUserId(currentUserId);
      } catch (error) {
        console.error('Authentication check failed:', error);
        window.location.href = '/login';
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, []);

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
         <TablePage userId={userId} />
      </Container>
    </>
  );
};

export default Dashboard;