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
import BudgetDashboard from "./BudgetDashboard";

const BudgetPage = () => {
  const { userId, isLoading } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [budgetToEdit, setBudgetToEdit] = useState(null);

  const fetchBudgets = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/budgets/${userId}`);
      if (!response.ok) throw new Error(`Failed to fetch budgets: ${response.statusText}`);

      const data = await response.json();
      setBudgets(data.budgets || []);
    } catch (err) {
      setError(err.message || "Failed to fetch budgets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [userId]);

  const handleModal = (budget = null) => {
    setBudgetToEdit(budget);
    setShowModal(!showModal);
    setError(null);
  };

  const handleSubmitBudget = async (e, formData) => {
    e.preventDefault();
    setLoading(true);

    const url = budgetToEdit
      ? `http://localhost:5000/api/budgets/${userId}/${budgetToEdit._id}`
      : "http://localhost:5000/api/budgets/create";

    try {
      const response = await fetch(url, {
        method: budgetToEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userId }),
      });

      if (!response.ok) throw new Error(`Failed to ${budgetToEdit ? "update" : "add"} budget.`);

      await fetchBudgets();
      handleModal();
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
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
      setError(err.message || "Failed to delete budget. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading)
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading user data...</p>
      </Container>
    );

  if (!userId)
    return (
      <Container className="text-center mt-5">
        <Alert variant="warning">
          <FaExclamationTriangle className="me-2" />
          Please log in to access the dashboard.
        </Alert>
      </Container>
    );

  return (
    <>
      <NavBar />
      <Container className="mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Budgets Dashboard</h2>
          <Button
            variant="primary"
            onClick={() => handleModal()}
            disabled={loading}
          >
            <FaPlus className="me-2" />
            Add New Budget
          </Button>
        </div>

        {error && (
          <Alert
            variant="danger"
            className="mb-4"
            dismissible
            onClose={() => setError(null)}
          >
            <FaExclamationTriangle className="me-2" />
            {error}
          </Alert>
        )}
        {/* lets pass the budgets array to the BudgetDashboard component */}
      <BudgetDashboard  budgets={budgets} />
        <AddBudgetModal
          show={showModal}
          budgetToEdit={budgetToEdit}
          handleClose={() => handleModal()}
          handleSubmit={handleSubmitBudget}
          error={error}
        />

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
                  <td>{budget.period}</td>
                  <td>{budget.energyLimit}</td>
                  <td>{budget.energyUsage || 0}</td>
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
                        onClick={() => handleModal(budget)}
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
