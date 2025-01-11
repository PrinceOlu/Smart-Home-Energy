import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        let currentUserId = localStorage.getItem('userId');
        if (!currentUserId) {
          const response = await fetch('http://localhost:5000/api/auth/session', {
            credentials: 'include',
          });
          if (response.ok) {
            const data = await response.json();
            currentUserId = data.userId;
            localStorage.setItem('userId', currentUserId);
          } else {
            navigate('/login');
            return;
          }
        }
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
