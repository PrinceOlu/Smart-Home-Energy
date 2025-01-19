import { useState, useEffect } from "react";
import {
  Container,
  Spinner,
  Alert,
  Table,
  Button,
} from "react-bootstrap";
import {
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaPlus,
  FaEdit,
  FaTrashAlt,
} from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import NavBar from "../../components/Layout/NavBar";
import AddBudgetModal from "./AddBudgetModal";
import EditBudgetModal from "./EditBudgetModal";
import BudgetDashboard from "./BudgetDashboard";

const BudgetPage = () => {
  const { userId, isLoading } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [totalEnergyUsage, setTotalEnergyUsage] = useState(0);
  const [totalDevices, setTotalDevices] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [budgetIdToEdit, setBudgetIdToEdit] = useState(null);

  const fetchEnergyUsageData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/energy-usage/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch energy usage data");
      const data = await response.json();
      setTotalEnergyUsage(data.totalEnergyUsage || 0);
      setTotalDevices(data.devices || 0);
      setError(null);
    } catch (err) {
      setError(err.message);
      setTotalEnergyUsage(0);
      setTotalDevices(0);
    }
  };

  const fetchBudgets = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/budgets/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch budgets.");
      const data = await response.json();
      setBudgets(data.budgets || []);
    } catch (err) {
      setError(err.message || "Failed to fetch budgets.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDevices = async () => {
    if (!userId) return;
    try {
      const response = await fetch(`http://localhost:5000/api/devices/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch devices.");
      const data = await response.json();
      setTotalDevices(data.totalDevices || 0);
    } catch (err) {
      setError(err.message || "Failed to fetch devices.");
    }
  };

  useEffect(() => {
    if (userId) {
      fetchEnergyUsageData();
      fetchDevices();
      fetchBudgets();
    }
  }, [userId]);

  const handleAddModal = () => {
    setShowAddModal(true);
    setError(null);
  };

  const handleEditModal = (budgetId) => {
    setBudgetIdToEdit(budgetId);
    setShowEditModal(true);
    setError(null);
  };

  const handleCloseModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setBudgetIdToEdit(null);
  };

  const handleDeleteBudget = async (budgetId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/budgets/${userId}/${budgetId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete budget.");
      await fetchBudgets();
    } catch (err) {
      setError(err.message || "Failed to delete budget.");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading user data...</p>
      </Container>
    );
  }

  if (!userId) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="warning">
          <FaExclamationTriangle className="me-2" />
          Please log in to access the dashboard.
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <NavBar />
      <Container className="mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Budgets Dashboard</h2>
          <Button variant="primary" onClick={handleAddModal} disabled={loading}>
            <FaPlus className="me-2" />
            Add New Budget
          </Button>
        </div>

        {error && (
          <Alert variant="danger" className="mb-4" dismissible onClose={() => setError(null)}>
            <FaExclamationTriangle className="me-2" />
            {error}
          </Alert>
        )}

        <BudgetDashboard budgets={budgets} totalEnergyUsage={totalEnergyUsage} totalDevices={totalDevices} />

        <AddBudgetModal show={showAddModal} handleClose={handleCloseModals} />
        <EditBudgetModal show={showEditModal} handleClose={handleCloseModals} budgetId={budgetIdToEdit} />

        {loading ? (
          <div className="text-center mt-5">
            <Spinner animation="border" variant="primary" />
            <p>Loading budgets...</p>
          </div>
        ) : budgets.length === 0 ? (
          <Alert variant="info">No budgets found.</Alert>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Period</th>
                <th>Number of Devices</th>
                <th>Budget Limit (kWh)</th>
                <th>Energy Usage (kWh)</th>
                <th>Alerts</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {budgets.map((budget, index) => (
                <tr key={budget._id || index}>
                  <td>{index + 1}</td>
                  <td>{new Date(budget.period).toLocaleDateString("en-US", { year: "numeric", month: "long" })}</td>
                  <td>{totalDevices}</td>
                  <td>{budget.energyLimit}</td>
                  <td>{totalEnergyUsage || 0}</td>
                  <td className="text-center">
                    {budget.alerts ? (
                      <FaCheckCircle className="text-success" title="Enabled" />
                    ) : (
                      <FaTimesCircle className="text-danger" title="Disabled" />
                    )}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-primary"
                        onClick={() => handleEditModal(budget._id)}
                        size="sm"
                        disabled={loading}
                      >
                        <FaEdit className="me-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        onClick={() => handleDeleteBudget(budget._id)}
                        size="sm"
                        disabled={loading}
                      >
                        <FaTrashAlt className="me-1" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
    </>
  );
};

export default BudgetPage;
