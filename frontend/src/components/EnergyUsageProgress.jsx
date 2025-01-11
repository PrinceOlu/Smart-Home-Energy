import PropTypes from 'prop-types';
import { ProgressBar } from 'react-bootstrap';
import '../styles/EnergyUsageProgress.css';

const EnergyUsageProgress = ({ budgetId, energyUsage, energyLimit }) => {
  if (!budgetId || energyUsage == null || energyLimit == null) {
    return (
      <div className="energy-usage-container">
        <p>Invalid data provided for energy usage.</p>
      </div>
    );
  }

  const percentage = Math.min((energyUsage / energyLimit) * 100, 100);

  return (
    <div className="energy-usage-container">
      <h4>Energy Usage Progress</h4>
      <ProgressBar
        now={percentage}
        label={`${percentage.toFixed(2)}%`}
        variant={percentage > 90 ? 'danger' : percentage > 75 ? 'warning' : 'success'}
      />
      <p className="usage-text">
        {percentage.toFixed(2)}% of your energy limit has been used.
        {percentage > 90 && <span className="alert-text"> Warning: Near energy limit!</span>}
      </p>
    </div>
  );
};

EnergyUsageProgress.propTypes = {
  budgetId: PropTypes.string.isRequired,
  energyUsage: PropTypes.number.isRequired,
  energyLimit: PropTypes.number.isRequired,
};

export default EnergyUsageProgress;
