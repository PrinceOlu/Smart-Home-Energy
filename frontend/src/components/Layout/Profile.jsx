import { useState, useEffect } from "react";
import PropTypes from "prop-types"; 
import { API_BASE_URL } from "../../apiConfig";

const Profile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/profile/${userId}`, {
          method: 'GET',
          credentials: 'include', 
          headers: {
            'Content-Type': 'application/json',
          }
        });

       

        if (response.status === 401) {
          throw new Error("Please log in to view your profile");
        }

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        
        const data = await response.json();
        setUser(data.user);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h6>Welcome {user?.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1).toLowerCase() : "Guest"}</h6>  
    </div>
  );
};

// Prop validation: Declare the expected type for the `userId` prop
Profile.propTypes = {
  userId: PropTypes.string.isRequired, 
};

export default Profile;
