
import useAuth from '../utils/useAuth';


const AddNewDevice = () => {
  const { userId, isLoading } = useAuth();


  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!userId) {
    return <p>Redirecting to login...</p>;
  }

  return (
    <div>
      <h1>Add New Device</h1>
      <p>User ID: {userId}</p>
   
    </div>
  );
};

export default AddNewDevice;
