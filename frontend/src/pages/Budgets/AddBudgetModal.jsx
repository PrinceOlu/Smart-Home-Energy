import { useState, useEffect, useCallback } from 'react';
import { Modal, Form, Button, Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types';
import useAuth from '../../hooks/useAuth';


const INITIAL_FORM_STATE = {
  period: '',
  energyLimit: '',
  alerts: false,
};

const formatDateGroup = (date) => {
  
  try {
    return new Date(date).toLocaleString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid Date';
  }
};

const AddBudgetModal = ({ show, handleClose, onBudgetCreated }) => {
  const { userId, isLoading: authLoading } = useAuth();
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [monthlyGroups, setMonthlyGroups] = useState([]);
  const [status, setStatus] = useState({
    loading: false,
    submitting: false,
    error: null,
  });

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setStatus({ loading: false, submitting: false, error: null });
  }, []);

  useEffect(() => {
    if (!show) {
      resetForm();
         }
  }, [show, resetForm]);

  useEffect(() => {
    const fetchAndProcessDevices = async () => {
      if (!show || !userId) return;

      setStatus((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await fetch(`http://localhost:80/api/devices/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        if (!data?.devices?.length) {
          setStatus((prev) => ({
            ...prev,
            loading: false,
            error: 'No devices found. Please add devices first.',
          }));
          return;
        }

        const groupedDevices = data.devices.reduce((acc, device) => {
          if (!device?.createdAt) return acc;

          const date = new Date(device.createdAt);
          if (isNaN(date.getTime())) return acc;

          const monthYear = formatDateGroup(date);

          if (!acc[monthYear]) {
            acc[monthYear] = {
              label: monthYear,
              date: device.createdAt,
              count: 0,
              devices: [],
              totalPower: 0,
            };
          }

          acc[monthYear].count += 1;
          acc[monthYear].devices.push(device._id);
          acc[monthYear].totalPower += device.powerRating || 0;

          return acc;
        }, {});

        const sortedGroups = Object.values(groupedDevices).sort((a, b) => new Date(b.date) - new Date(a.date));

        setMonthlyGroups(sortedGroups);
        setStatus((prev) => ({ ...prev, loading: false }));
      } catch (error) {
        console.error('Error fetching devices:', error);
        setStatus({
          loading: false,
          submitting: false,
          error: 'Failed to load device data. Please try again.',
        });
      }
    };

    fetchAndProcessDevices();
  }, [show, userId]);

  const validateForm = () => {
    const errors = [];
    const energyLimitNum = parseFloat(formData.energyLimit);

    if (!formData.period) {
      errors.push('Please select a budget period');
    }

    if (
      !formData.energyLimit ||
      isNaN(energyLimitNum) ||
      energyLimitNum <= 0 ||
      energyLimitNum > 1000000
    ) {
      errors.push('Please enter a valid energy limit between 0 and 1,000,000 kWh');
    }

    const selectedGroup = monthlyGroups.find((group) => group.date === formData.period);
    if (!selectedGroup?.devices?.length) {
      errors.push('No devices found for selected period');
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'number' && value !== '' && isNaN(parseFloat(value))) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (status.error) {
      setStatus((prev) => ({ ...prev, error: null }));
    }
  };

  const saveBudget = async (budgetData) => {
    try {
      const response = await fetch('http://localhost:80/api/budgets/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(budgetData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
      // Only refetch budgets after successful creation
            

    } catch (error) {
      console.error('Save budget error:', error);
      throw new Error('Failed to save budget. Please try again.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (errors.length > 0) {
      setStatus((prev) => ({
        ...prev,
        error: errors.join('. '),
      }));
      return;
    }

    setStatus((prev) => ({ ...prev, submitting: true, error: null }));

    try {
      const selectedGroup = monthlyGroups.find((group) => group.date === formData.period);

      const budgetData = {
        period: formData.period,
        energyLimit: parseFloat(formData.energyLimit),
        alerts: formData.alerts,
        deviceIds: selectedGroup.devices,
        userId,
        totalDevices: selectedGroup.count,
        totalPower: selectedGroup.totalPower,
      };

      const savedBudget = await saveBudget(budgetData);
      
      // Call the onBudgetCreated callback
      if (onBudgetCreated) {
        onBudgetCreated(savedBudget);
      }

      resetForm();
      handleClose();
      
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus((prev) => ({
        ...prev,
        error: error.message,
      }));
    } finally {
      setStatus((prev) => ({ ...prev, submitting: false }));
    }
  };

  if (authLoading) {
    return (
      <Modal show={show} centered>
        <Modal.Body className="text-center py-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading authentication...</span>
          </Spinner>
        </Modal.Body>
      </Modal>
    );
  }

  if (!userId) {
    return (
      <Modal show={show} centered>
        <Modal.Body className="text-center py-4">
          <p className="mb-0">Please log in to continue.</p>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop={status.submitting ? 'static' : true}
      keyboard={!status.submitting}
    >
      <Modal.Header closeButton={!status.submitting}>
        <Modal.Title>Add New Budget</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {status.error && (
          <div className="alert alert-danger" role="alert">
            {status.error}
          </div>
        )}

        <Form onSubmit={handleFormSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Budget Period</Form.Label>
            <Form.Select
              name="period"
              value={formData.period}
              onChange={handleChange}
              disabled={status.loading || status.submitting}
              required
            >
              <option value="">Select a budget period</option>
              {monthlyGroups.map((group) => (
                <option key={group.date} value={group.date}>
                  {group.label} ({group.count} {group.count === 1 ? 'device' : 'devices'})
                </option>
              ))}
            </Form.Select>
            {status.loading && (
              <Form.Text className="text-muted">Loading available periods...</Form.Text>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Energy Limit (kWh)</Form.Label>
            <Form.Control
              type="number"
              name="energyLimit"
              value={formData.energyLimit}
              onChange={handleChange}
              placeholder="Enter energy limit"
              min="0.01"
              step="0.01"
              disabled={status.submitting}
              required
            />
            <Form.Text className="text-muted">Enter a value greater than 0 kWh</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Enable Alerts"
              name="alerts"
              checked={formData.alerts}
              onChange={handleChange}
              disabled={status.submitting}
            />
          </Form.Group>

          <div className="text-center">
            {status.submitting ? (
              <Spinner animation="border" />
            ) : (
              <Button variant="primary" type="submit">
                Add Budget
              </Button>
            )}
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

AddBudgetModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  onBudgetCreated: PropTypes.func.isRequired,
};

export default AddBudgetModal;
