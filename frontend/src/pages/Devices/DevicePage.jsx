import { useState, useCallback, useEffect } from "react";
import { Spinner, Alert, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import { FaPlus, FaEdit, FaTrashAlt, FaBolt } from "react-icons/fa";
import AddDeviceModal from "./AddDeviceModal";
import EditDeviceModal from "./EditDeviceModal";
import useAuth from '../../hooks/useAuth';
const DevicePage = () => {
  const { userId} = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deviceToEdit, setDeviceToEdit] = useState(null);
  const [updatingEnergy, setUpdatingEnergy] = useState(null);

  // Fetch devices from the server
  const fetchDevices = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:5000/api/devices/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch devices");
      const data = await response.json();
      setDevices(data?.devices || []);
      setError(null); // Clear any previous errors
    } catch (err) {
      setError(err.message);
      setDevices([]); // Reset devices on error
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Modal handlers
  const handleShowModal = (device = null) => {
    setDeviceToEdit(device);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setDeviceToEdit(null);
    setError(null); // Clear any errors when closing modal
  };

  // Add Device Handler
  const handleAddDevice = async (e, formData) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/devices/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userId }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to add device");
      }
      // Only refetch devices after successful creation
      await fetchDevices();
      handleCloseModal();
    } catch (err) {
      setError(err.message);
    }
  };

  // Edit Device Handler
  const handleEditDeviceSubmit = async (e, formData) => {
    e.preventDefault();
    if (!deviceToEdit?._id) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/devices/${userId}/${deviceToEdit._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update device");
      }
      await fetchDevices(); // Fetch devices after update
      handleCloseModal();
    } catch (err) {
      setError(err.message);
    }
  };

  // Update Energy Usage Handler
  const handleUpdateEnergyUsage = async (deviceId) => {
    if (!deviceId || updatingEnergy === deviceId) return;

    try {
      setUpdatingEnergy(deviceId);
      setError(null);
      
      const response = await fetch(
        `http://localhost:5000/api/devices/${userId}/${deviceId}/energy-usage`,
        { 
          method: "PUT",
          headers: { "Content-Type": "application/json" }
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update energy usage");
      }

      await fetchDevices(); // Fetch devices after updating energy usage
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingEnergy(null);
    }
  };

  // Delete Device Handler
  const handleDeleteDevice = async (deviceId) => {
    if (!deviceId || !window.confirm("Are you sure you want to delete this device?")) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/devices/${userId}/${deviceId}`,
        { method: "DELETE" }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete device");
      }

      await fetchDevices(); // Fetch devices after deleting
    } catch (err) {
      setError(err.message);
    }
  };

  // Initialize Devices Fetch
  useEffect(() => {
    fetchDevices(); // Fetch devices on page load
  }, [fetchDevices]);

  return (
    <div className="container mt-4">
      {error && <Alert variant="danger" className="mb-3" dismissible onClose={() => setError(null)}>{error}</Alert>}
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Your Devices</h2>
        <Button variant="primary" onClick={() => handleShowModal()}>
          <FaPlus className="me-2" />
          Add New Device
        </Button>
      </div>

      <AddDeviceModal
        show={showModal && !deviceToEdit}
        handleClose={handleCloseModal}
        handleSubmit={handleAddDevice}
      />

      <EditDeviceModal
        show={showModal && deviceToEdit !== null}
        handleClose={handleCloseModal}
        handleSubmit={handleEditDeviceSubmit}
        deviceToEdit={deviceToEdit}
      />

      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center p-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading devices...</span>
          </Spinner>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Device Name</th>
                <th>Type</th>
                <th>Power Rating</th>
                <th>Energy Usage</th>
                <th>Status</th>
                <th>Date Added</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {devices.length > 0 ? (
                devices.map((device, index) => (
                  <tr key={device._id}>
                    <td>{index + 1}</td>
                    <td>{device.name}</td>
                    <td>{device.type}</td>
                    <td>{device.powerRating} kW</td>
                    <td>{device.energyUsage} kWh</td>
                    <td>{device.status}</td>
                    <td>{new Date(device.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="btn-group">
                        <Button
                          variant="warning"
                          className="me-2"
                          onClick={() => handleShowModal(device)}
                          disabled={updatingEnergy === device._id}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="info"
                          className="me-2"
                          onClick={() => handleUpdateEnergyUsage(device._id)}
                          disabled={updatingEnergy === device._id}
                        >
                          {updatingEnergy === device._id ? (
                            <Spinner 
                              as="span" 
                              animation="border" 
                              size="sm" 
                              role="status" 
                              aria-hidden="true"
                            />
                          ) : (
                            <FaBolt />
                          )}
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDeleteDevice(device._id)}
                          disabled={updatingEnergy === device._id}
                        >
                          <FaTrashAlt />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-5">
                    <div className="text-muted">
                      <FaBolt className="h2 mb-3" />
                      <h4>No devices found</h4>
                      <p>Click the &quot;Add New Device&quot; button to get started</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

DevicePage.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default DevicePage;
