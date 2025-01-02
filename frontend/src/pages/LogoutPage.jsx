import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomePage from './HomePage';

function Logout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/logout', {
        method: 'POST',
        credentials: 'include', // Ensures cookies are sent with the request
      });
      if (response.ok) {
        console.log('Logout successful');
        navigate('/HomePage'); // Redirect to HomePage
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  useEffect(() => {
    handleLogout(); // Automatically logs out the user when the component is loaded
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div>
      <HomePage />
    </div>
  );
}

export default Logout;
