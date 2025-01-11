import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  Title,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(
  Tooltip,
  Legend,
  Title,
  BarElement,
  CategoryScale,
  LinearScale
);

export default function EnergyChart({ data, height = 300 }) {
  // Handle missing or invalid data
  if (!data || !data.labels || !data.data || data.labels.length === 0 || data.data.length === 0) {
    return (
      <div className="text-center p-4">
        <p>No energy usage data available</p>
      </div>
    );
  }

  // Ensure that labels and data arrays have the same length
  if (data.labels.length !== data.data.length) {
    return (
      <div className="text-center p-4">
        <p>Error: Mismatched labels and data lengths</p>
      </div>
    );
  }

  // Generate a color for each device based on its index
  const getColor = (index) => {
    const hue = (index * 40) % 360; // Spread colors evenly
    return `hsl(${hue}, 80%, 60%)`; // Vibrant colors
  };

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Energy Usage (kWh)',
        data: data.data,
        backgroundColor: data.data.map((_, index) => getColor(index)), // Apply unique color to each device
        borderColor: data.data.map(() => 'rgba(255, 255, 255, 0.8)'), // Light border for contrast
        borderWidth: 2, // Thicker borders for visual clarity
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14, // Larger font size for better visibility
            family: 'Arial, sans-serif',
            weight: 'bold', // Bold labels
          },
          color: '#333', // Dark color for better contrast
        },
      },
      title: {
        display: true,
        text: 'Device Energy Usage Overview',
        font: {
          size: 18,
          weight: 'bold',
        },
        color: '#333', // Dark title for clarity
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const percentage = (
              (value / data.data.reduce((acc, curr) => acc + curr, 0)) *
              100
            ).toFixed(1);
            return `${context.label}: ${value.toFixed(1)} kWh (${percentage}%)`;
          },
        },
        bodyFont: {
          size: 14,
        },
        titleFont: {
          size: 16,
          weight: 'bold',
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Devices',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Energy Usage (kWh)',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div
      style={{
        height: `${height}px`,
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
}

EnergyChart.propTypes = {
  data: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    data: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
  height: PropTypes.number,
};

EnergyChart.defaultProps = {
  height: 300,
};
