import { useState, useCallback, useEffect } from 'react';
import { Spinner, Alert, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { FaPlus, FaEdit, FaTrashAlt } from 'react-icons/fa'; // Import edit and delete icons
import AddDeviceModal from './AddDeviceModal'; // Import the modal component
import EditDeviceModal from './EditDeviceModal'; // Import the EditDeviceModal

const TablePage = ({ userId }) => {
  const [showModal, setShowModal] = useState(false);
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deviceToEdit, setDeviceToEdit] = useState(null); // State for the device to edit

  // Fetch devices
  const fetchDevices = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:5000/api/devices/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch devices');
      const data = await response.json();
      setDevices(data?.devices || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setDeviceToEdit(null); // Clear edit device state when closing modal
  };

  // Function to handle adding a new device
  const handleAddDevice = async (e, formData) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/devices/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, userId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to add device');
      fetchDevices(); // Refresh device list after adding
      handleCloseModal(); // Close modal after adding device
    } catch (err) {
      setError(err.message || 'An error occurred while adding the device');
    }
  };

  // Function to handle editing a device
  const handleEditDeviceSubmit = async (e, formData) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/devices/${userId}/${deviceToEdit._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update device');
      fetchDevices(); // Refresh device list after editing
      handleCloseModal(); // Close modal after editing device
    } catch (err) {
      setError(err.message || 'An error occurred while updating the device');
    }
  };

  // Function to handle deleting a device
  const handleDeleteDevice = async (deviceId) => {
    try {
        const response = await fetch(`http://localhost:5000/api/devices/${userId}/${deviceId}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to delete device');
        fetchDevices(); // Refresh device list after deletion
    } catch (err) {
        setError(err.message || 'An error occurred while deleting the device');
    }
};


  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center p-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading devices...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="m-3">
        {error}
      </Alert>
    );
  }

 

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Your Devices</h2>
        <Button variant="primary" onClick={handleShowModal}>
          <FaPlus className="me-2" />
          Add New Device
        </Button>
      </div>

      {/* AddDeviceModal Component */}
      <AddDeviceModal
        show={showModal && !deviceToEdit}
        handleClose={handleCloseModal}
        handleSubmit={handleAddDevice}
      />

      {/* EditDeviceModal Component */}
      <EditDeviceModal
        show={showModal && deviceToEdit !== null}
        handleClose={handleCloseModal}
        handleSubmit={handleEditDeviceSubmit} // Pass the correct submit function for editing
        deviceToEdit={deviceToEdit} // Pass deviceToEdit for editing
      />

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Device Name</th>
              <th>Device Type</th>
              <th>Device Status</th>
              <th>Date Added</th>
              <th>Actions</th>
            </tr>
          </thead>
          {/* lets add the No device found here if there is no device */}
          {/* Display  a message if there are no  devices */}
          
          <tbody>
            {devices.map((device, index) => (
              <tr key={device._id}>
                <td>{index + 1}</td>
                <td>{device.name}</td>
                <td>{device.type}</td>
                <td>{device.status}</td>
                <td>{new Date(device.createdAt).toLocaleDateString()}</td>
                <td>
                  {/* Edit and Delete buttons */}
                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => {
                      setDeviceToEdit(device);
                      handleShowModal(); // Open modal for editing
                    }}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteDevice(device._id)}
                  >
                    <FaTrashAlt />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

TablePage.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default TablePage;
