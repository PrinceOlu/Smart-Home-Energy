import { API_BASE_URL } from '../apiConfig';  // Use import instead of require

export const logoutUser = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/logout`, {
        method: 'POST',
        credentials: 'include', // Ensures cookies are sent with the request
      });
      return response;
    } catch (error) {
      throw new Error('Error during logout: ' + error);
    }
  };