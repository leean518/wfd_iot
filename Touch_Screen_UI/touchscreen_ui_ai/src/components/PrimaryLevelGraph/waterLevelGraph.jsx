// WaterLevelGraph.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const WaterLevelGraph = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/water-levels')
      .then(response => {
        const waterLevels = response.data || [];

        // Extract timestamps and water levels
        const timestamps = waterLevels.map(entry => 
          new Date(entry.timestamp).toLocaleTimeString()
        );
        const levels = waterLevels.map(entry => entry.level);

        // Set chart data
        setChartData({
          labels: timestamps,
          datasets: [
            {
              label: 'Water Level Over Time',
              data: levels,
              borderColor: 'blue',
              borderWidth: 2,
              fill: false,
            }
          ]
        });
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching water level data:", error);
        setLoading(false);
      });
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Water Level Monitoring',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Timestamp', // X-axis label
        },
      },
      y: {
        title: {
          display: true,
          text: 'Water Level (m)', // Y-axis label
        },
      },
    },
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!chartData) {
    return <div>No data available</div>;
  }

  return (
    <div>
      <h2>Water Level Graph</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default WaterLevelGraph;
