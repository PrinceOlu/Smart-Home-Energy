import { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import useAuth from '../../hooks/useAuth';

const AddDeviceModal = ({ show, handleClose, handleSubmit }) => {
  const { userId, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    status: '',
    powerRating: '',
  });

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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(e, formData);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Device</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleFormSubmit}>
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
              <option value="On">On</option>
              <option value="Off">Off</option>
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

AddDeviceModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default AddDeviceModal;
