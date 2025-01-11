import { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import useAuth from "../../hooks/useAuth";

const EditBudgetModal = ({ show, handleClose, handleSubmit, budgetToEdit }) => {
  const { userId, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    period: "",
    energyLimit: "",
    energyUsage: "",
    alerts: false,
  });

  // Update form data when the `budgetToEdit` prop changes
  useEffect(() => {
    if (budgetToEdit) {
      setFormData({
        period: budgetToEdit.period || "",
        energyLimit: budgetToEdit.energyLimit || "",
        energyUsage: budgetToEdit.energyUsage || "",
        alerts: budgetToEdit.alerts || false,
      });
    } else {
      setFormData({
        period: "",
        energyLimit: "",
        energyUsage: "",
        alerts: false,
      });
    }
  }, [budgetToEdit]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    
  };

  // Display loading state if authentication is in progress
  if (isLoading) {
    return <p>Loading...</p>;
  }

  // Redirect to login if the user is not authenticated
  if (!userId) {
    return <p>Redirecting to login...</p>;
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Budget</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={(e) => handleSubmit(e, formData)}>
          <Form.Group controlId="formBudgetPeriod" className="mb-3">
            <Form.Label>Budget Period</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter budget period (e.g., Monthly, Weekly)"
              name="period"
              value={formData.period}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formEnergyLimit" className="mb-3">
            <Form.Label>Energy Limit</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter energy limit"
              name="energyLimit"
              value={formData.energyLimit}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formEnergyUsage" className="mb-3">
            <Form.Label>Energy Usage</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter energy usage"
              name="energyUsage"
              value={formData.energyUsage}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formAlerts" className="mb-3">
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

EditBudgetModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  budgetToEdit: PropTypes.object,
};

export default EditBudgetModal;
