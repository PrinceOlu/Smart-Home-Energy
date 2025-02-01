import { useState, useEffect } from "react";
import { Spinner, Alert } from "react-bootstrap";
import { FaExclamationTriangle } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import NavBar from "../../components/Layout/NavBar";
import EnergyPieChart from "./EnergyPieChart";
import EnergyBarChart from "./EnergyBarChart";

const EnergyUsageDashboard = () => {
  const { userId, isLoading } = useAuth();
  const [totalEnergyUsage, setTotalEnergyUsage] = useState(0);
  const [allDevices, setAllDevices] = useState([]);
  const [error, setError] = useState(null);

  // Fetch energy usage data from the server
  const fetchEnergyUsageData = async () => {
    try {
      const response = await fetch(`http://localhost:80/api/energy-usage/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch energy usage data");
      const data = await response.json();

      setTotalEnergyUsage(data.totalEnergyUsage || 0);
      setAllDevices(data.devices || []); // Assuming 'devices' contains all devices
      setError(null); // Clear any previous errors
    } catch (err) {
      setError(err.message);
      setTotalEnergyUsage(0); // Reset total energy usage on error
      setAllDevices([]); // Reset device list on error
    }
  };

  useEffect(() => {
    if (userId) fetchEnergyUsageData();
  }, [userId]);

  if (isLoading) {
    return <Spinner animation="border" variant="primary" />;
  }

  // Prepare data for the EnergyChart component
  const chartData = {
    labels: allDevices.map((device) => device.name), // Device names as labels
    data: allDevices.map((device) => device.energyUsage), // Energy usage as data points
  };

  return (
    <>
      <NavBar />
      <div className="container mt-4">
        <h2>Energy Usage Dashboard</h2>
        {error && (
          <Alert variant="danger">
            <FaExclamationTriangle /> {error}
          </Alert>
        )}
        <div className="mb-4">
          <h4>Total Energy Usage: {totalEnergyUsage} kWh</h4>
        </div>

        <div className="table-responsive mt-4">
          <table className="table table-striped table-hover">
            <thead className="table-light">
              <tr>
                <th>Device Name</th>
                <th>Power Rating</th>
                <th>Energy Usage</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {allDevices.map((device) => (
                <tr key={device._id}>
                  <td>{device.name}</td>
                  <td>{device.powerRating || "N/A"}</td>
                  <td>{device.energyUsage} kWh</td>
                  <td>{device.energyUsage > 10 ? "High Usage" : "Normal"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <h5>Energy-Saving Tips:</h5>
          <ul>
            <li>Turn off devices when not in use.</li>
            <li>Use energy-efficient devices for better savings.</li>
            <li>Ensure devices are properly maintained to avoid excess power consumption.</li>
          </ul>
        </div>
      </div>
      
      {/* Pass allDevices to the EnergyChart */}
      <EnergyPieChart data={chartData} />
      <EnergyBarChart data={chartData} />
    </>
  );
};

export default EnergyUsageDashboard;
