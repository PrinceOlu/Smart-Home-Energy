import { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import useAuth from '../../hooks/useAuth';

const AddBudgetModal = ({ show, handleClose, handleSubmit }) => {
  const { userId, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    period: '',
    energyLimit: '',
    energyUsage: '',
    alerts: false,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    });
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!userId) {
    return <p>Redirecting to login...</p>;
  }

  // handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(e, formData);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Budget</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleFormSubmit}>
          {/* Budget Period Dropdown */}
          <Form.Group controlId="formBudgetPeriod" className="mb-3">
            <Form.Label>Budget Period</Form.Label>
            <Form.Control
              as="select"
              name="period"
              value={formData.period}
              onChange={handleChange}
              required
            >
              <option value="">Select a budget period</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </Form.Control>
          </Form.Group>

          {/* Energy Limit */}
          <Form.Group controlId="formBudgetEnergyLimit" className="mb-3">
            <Form.Label>Energy Limit (kWh)</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter energy limit"
              name="energyLimit"
              value={formData.energyLimit}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Energy Usage */}
          <Form.Group controlId="formBudgetEnergyUsage" className="mb-3">
            <Form.Label>Energy Usage (kWh)</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter energy usage"
              name="energyUsage"
              value={formData.energyUsage}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Alerts Checkbox */}
          <Form.Group controlId="formBudgetAlerts" className="mb-3">
            <Form.Check
              type="checkbox"
              label="Enable Alerts"
              name="alerts"
              checked={formData.alerts}
              onChange={handleChange}
            />
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

AddBudgetModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default AddBudgetModal;
