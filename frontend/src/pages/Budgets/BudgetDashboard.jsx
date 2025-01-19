import PropTypes from 'prop-types';
import EnergyUsageProgress from '../../components/EnergyUsageProgress';

const BudgetDashboard = ({ budgets, totalEnergyUsage }) => {
  if (!budgets || budgets.length === 0) {
    // return <p>No budgets available.</p>;
  }

  return (
    <div>
      {budgets.map((budget) => (
        <div key={budget._id}>
          <h4>Budget Period: {new Date(budget.period).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                    })}</h4>
          {budget._id ? (
            <EnergyUsageProgress
              budgetId={budget._id}
              energyLimit={budget.energyLimit}
              energyUsage={totalEnergyUsage}  // Use totalEnergyUsage from BudgetPage
            />
          ) : (
            <p>Loading budget details...</p>
          )}
        </div>
      ))}
    </div>
  );
};

BudgetDashboard.propTypes = {
  budgets: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      period: PropTypes.string.isRequired,
      energyUsage: PropTypes.number.isRequired,
      energyLimit: PropTypes.number.isRequired,
    })
  ).isRequired,
  totalEnergyUsage: PropTypes.number.isRequired,  // Prop type validation for totalEnergyUsage
};

export default BudgetDashboard;
