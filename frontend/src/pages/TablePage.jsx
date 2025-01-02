import { useState, useCallback, useEffect } from 'react';
import { Spinner, Alert, Button, Modal, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';

const TablePage = ({ userId }) => {
  const [show, setShow] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [deviceStatus, setDeviceStatus] = useState('');
  const [deviceTypes] = useState(['Laptop', 'Smartphone', 'Tablet', 'Other']);
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const fetchDevices = useCallback(async () => {
    if (!userId) {
      setError('User ID is missing');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:5000/api/devices/${userId}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('userId');
          window.location.href = '/login';
          throw new Error('Session expired - Redirecting to login');
        }
        throw new Error('Failed to fetch devices');
      }

      const data = await response.json();
      setDevices(data?.devices || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const handleDelete = async (deviceId) => {
    setDeletingId(deviceId);
    setDevices(prevDevices => prevDevices.filter(device => device._id !== deviceId));

    try {
      const response = await fetch(`http://localhost:5000/api/devices/${deviceId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('userId');
          window.location.href = '/login';
          throw new Error('Session expired - Redirecting to login');
        }
        throw new Error('Failed to delete device');
      }
    } catch (err) {
      setError(err.message);
      fetchDevices();
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdate = (deviceId) => {
    console.log(`Update device with ID: ${deviceId}`);
    // Navigate to an update page or show an update form
  };

  // const handleAddNewDevice = () => {
  //   navigate('/add-device'); // Navigate to AddNewDevice page
  // };

  const handleSubmit = () => {
    console.log('Adding new device:', { deviceName, deviceType, deviceStatus });
    // Add new device logic
    handleClose();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!userId) {
    return <Alert variant="warning" className="m-3">User ID is missing. Please log in.</Alert>;
  }

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
        <Button 
          variant="outline-danger" 
          size="sm" 
          className="ms-3"
          onClick={fetchDevices}
          disabled={isLoading}
        >
          Retry
        </Button>
      </Alert>
    );
  }

  if (!devices.length) {
    return <Alert variant="info" className="m-3">No devices found</Alert>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Your Devices</h2>
        <Button variant="primary" onClick={handleShow}>
          <FaPlus className="me-2" />
          Add New Device
        </Button>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Device</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formDeviceName" className="mb-3">
                <Form.Label>Device Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter device name"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formDeviceType" className="mb-3">
                <Form.Label>Device Type</Form.Label>
                <Form.Control
                  as="select"
                  value={deviceType}
                  onChange={(e) => setDeviceType(e.target.value)}
                  required
                >
                  <option value="" disabled>Select a device type</option>
                  {deviceTypes.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formDeviceStatus" className="mb-3">
                <Form.Label>Device Status</Form.Label>
                <Form.Control
                  as="select"
                  value={deviceStatus}
                  onChange={(e) => setDeviceStatus(e.target.value)}
                  required
                >
                  <option value="" disabled>Select a status</option>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </Form.Control>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
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
          <tbody>
            {devices.map((device, index) => (
              <tr key={device._id}>
                <td>{index + 1}</td>
                <td>{device.name}</td>
                <td>{device.type}</td>
                <td>{device.status}</td>
                <td>{formatDate(device.dateAdded)}</td>
                <td>
                  <Button 
                    variant="warning" 
                    size="sm" 
                    className="me-2"
                    onClick={() => handleUpdate(device._id)}
                  >
                    <FaEdit /> Update
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDelete(device._id)}
                    disabled={deletingId === device._id}
                  >
                    <FaTrash />
                    {deletingId === device._id ? ' Deleting...' : ' Delete'}
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
