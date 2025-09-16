import {
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  LineElement,
  PointElement,
  Title,
} from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { io } from 'socket.io-client';

// Register Chart.js components
ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale);

const socket = io('http://localhost:9000'); // Connect to the server

function  Live() {
  const [dataPoints, setDataPoints] = useState([]);
  const labels = dataPoints.map((_, index) => `Point ${index + 1}`);

  useEffect(() => {
    // Listen for randomNumber events from the server
    socket.on('randomNumber', (number) => {
      setDataPoints((prev) => {
        const updated = [...prev, number];
        return updated.length > 10 ? updated.slice(-10) : updated; // Keep last 10 points
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const data = {
    labels,
    datasets: [
      {
        label: 'Live Random Data',
        data: dataPoints,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: false,
      },
    ],
  };

  return (
    <div style={{ width: '80%', margin: 'auto', padding: '50px' }}>
      <h2>Live Random Number Chart</h2>
      <Line data={data} />
    </div>
  );
}

export default Live;
