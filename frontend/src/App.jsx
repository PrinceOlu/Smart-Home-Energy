import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/DashBoard';
import Logout from './pages/LogoutPage';
import AddNewDevice from './pages/Devices/AddDeviceModal';
import EnergyUsageDashboard from './pages/energyUsage/EnergyUsageDashboard';
import BudgetPage from './pages/Budgets/BudgetPage';

function App() {

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/logout" element={<Logout />} />
        
        {/* Protected route */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-device" element={<AddNewDevice />} />
        <Route path="/EnergyUsageDashboard" element={<EnergyUsageDashboard />} />
        <Route path="/BudgetPage" element={<BudgetPage />} />
        
        {/* Catch-all route for 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
