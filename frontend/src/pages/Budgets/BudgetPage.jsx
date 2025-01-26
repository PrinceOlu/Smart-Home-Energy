import React, { useState, useEffect, useCallback } from "react";
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
const BudgetDashboard = React.lazy(() => import("./BudgetDashboard"));

const formatDateGroup = (date) => {
  try {
    return new Date(date).toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
  } catch {
    return "Invalid Date";
  }
};

const BudgetPage = () => {
  const { userId, isLoading: authLoading } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [totalEnergyUsage, setTotalEnergyUsage] = useState(0);
  const [totalDevices, setTotalDevices] = useState(0);
  const [deviceGroups, setDeviceGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [budgetIdToEdit, setBudgetIdToEdit] = useState(null);

  const apiBaseUrl = "http://localhost:5000/api";

  const fetchEnergyUsageByPeriod = useCallback(async (period) => {
    try {
      const periodDate = new Date(period).toISOString().slice(0, 7);
      const response = await fetch(`${apiBaseUrl}/energy-usage/${userId}/${periodDate}`);
      
      if (!response.ok) throw new Error("Failed to fetch energy usage data.");
      
      const data = await response.json();
      return data.totalEnergyUsage || 0;
    } catch (err) {
      console.error(err);
      return 0;
    }
  }, [userId, apiBaseUrl]);

  const fetchBudgetsWithEnergyUsage = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiBaseUrl}/budgets/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch budgets.");
      
      const data = await response.json();
      
      const budgetsWithUsage = await Promise.all(
        data.budgets.map(async (budget) => ({
          ...budget,
          energyUsage: await fetchEnergyUsageByPeriod(budget.period)
        }))
      );

      setBudgets(budgetsWithUsage);
      setTotalEnergyUsage(
        budgetsWithUsage.reduce((sum, budget) => sum + budget.energyUsage, 0)
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId, fetchEnergyUsageByPeriod]);

  const fetchDevices = useCallback(async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/devices/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch devices.");
      
      const data = await response.json();
      setTotalDevices(data.devices.length);

      const groupedDevices = data.devices.reduce((acc, device) => {
        const date = new Date(device?.createdAt);
        if (isNaN(date)) return acc;

        const groupKey = formatDateGroup(date);
        if (!acc[groupKey]) {
          acc[groupKey] = {
            label: groupKey,
            date: device.createdAt,
            count: 0,
            totalPower: 0,
          };
        }
        acc[groupKey].count += 1;
        acc[groupKey].totalPower += device.powerRating || 0;

        return acc;
      }, {});

      setDeviceGroups(
        Object.values(groupedDevices).sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        )
      );
    } catch (err) {
      setError(err.message);
    }
  }, [userId]);

  const fetchData = useCallback(async () => {
    if (userId) {
      setError(null);
      await Promise.all([fetchDevices(), fetchBudgetsWithEnergyUsage()]);
    }
  }, [userId, fetchDevices, fetchBudgetsWithEnergyUsage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddModal = () => setShowAddModal(true);
  
  const handleEditModal = (budgetId) => {
    setBudgetIdToEdit(budgetId);
    setShowEditModal(true);
  };

  const handleCloseModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setBudgetIdToEdit(null);
  };

  const handleDeleteBudget = async (budgetId) => {
    try {
      setLoading(true);
      const response = await fetch(`${apiBaseUrl}/budgets/${userId}/${budgetId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete budget.");
      await fetchBudgetsWithEnergyUsage();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
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

        <BudgetDashboard 
          budgets={budgets} 
          totalEnergyUsage={totalEnergyUsage} 
          totalDevices={totalDevices} 
        />

        <AddBudgetModal show={showAddModal} handleClose={handleCloseModals} />
        <EditBudgetModal 
          show={showEditModal} 
          handleClose={handleCloseModals} 
          budgetId={budgetIdToEdit} 
        />

        {loading ? (
          <div className="text-center mt-5">
            <Spinner animation="border" variant="primary" />
            <p>Loading devices...</p>
          </div>
        ) : deviceGroups.length === 0 ? (
          <Alert variant="info">No devices found.</Alert>
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
              {budgets.map((budget, index) => {
                const group = deviceGroups.find((g) => 
                  g.label === formatDateGroup(budget.period)
                );
                return (
                  <tr key={budget._id || index}>
                    <td>{index + 1}</td>
                    <td>{formatDateGroup(budget.period)}</td>
                    <td>{group?.count || 0}</td>
                    <td>{budget.energyLimit}</td>
                    <td>{budget.energyUsage}</td>
                    <td className="text-center">
                      {budget.energyUsage <= budget.energyLimit ? (
                        <FaCheckCircle className="text-success" />
                      ) : (
                        <FaTimesCircle className="text-danger" />
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
                );
              })}
            </tbody>
          </Table>
        )}
      </Container>
    </>
  );
};

export default BudgetPage;