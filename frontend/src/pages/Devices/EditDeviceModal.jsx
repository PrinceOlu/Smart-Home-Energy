import  { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import useAuth from '../../hooks/useAuth';

const EditDeviceModal = ({ show, handleClose, handleSubmit, deviceToEdit }) => {
  const { userId, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    status: '',
    powerRating: '',
    energyUsage: '',
  });


  useEffect(() => {
    if (deviceToEdit) {
      setFormData({
        name: deviceToEdit.name,
        type: deviceToEdit.type,
        status: deviceToEdit.status,
        powerRating: deviceToEdit.powerRating,
        energyUsage: deviceToEdit.energyUsage,
      });
    }
  }, [deviceToEdit]);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!userId) {
    return <p>Redirecting to login...</p>;
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Device</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={(e) => handleSubmit(e, formData)}>
          <Form.Group controlId="formDeviceName" className="mb-3">
            <Form.Label>Device Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter device name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formDeviceType" className="mb-3">
            <Form.Label>Device Type</Form.Label>
            <Form.Control
              as="select"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="">Select a device type</option>
              {['Laptop', 'Smartphone', 'Tablet', 'Others'].map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
 {/* lets create input for powerRating */}
 <Form.Group controlId="formDevicePowerRating" className="mb-3">
                <Form.Label>Device Power Rating</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter device power rating"
                  name="powerRating"
                  value={formData.powerRating}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              {/* lets create input for energyUsage  */}
              <Form.Group controlId="formDeviceEnergyUsage" className="mb-3">
                <Form.Label>Device Energy Usage</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter device energy usage"
                  name="energyUsage"
                  value={formData.energyUsage}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
          <Form.Group controlId="formDeviceStatus" className="mb-3">
            <Form.Label>Device Status</Form.Label>
            <Form.Control
              as="select"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="">Select a status</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </Form.Control>
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

EditDeviceModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  deviceToEdit: PropTypes.object,
};


export default EditDeviceModal;
