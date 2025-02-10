import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../apiConfig';
const useAuth = () => {
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Check if the user is already authenticated
        let currentUserId = localStorage.getItem('userId');
        if (!currentUserId) {
          const response = await fetch(`${API_BASE_URL}/api/auth/session`, {
            credentials: 'include',
          });
          // If the user is not authenticated, redirect to the login page
          if (response.ok) {
            const data = await response.json();
            currentUserId = data.userId;
            localStorage.setItem('userId', currentUserId);
          } else {
            navigate('/login');
            return;
          }
        }
        // Set the user ID
        setUserId(currentUserId);
      } catch (error) {
        console.error('Authentication failed:', error);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, [navigate]);

  return { userId, isLoading };
};

export default useAuth;
