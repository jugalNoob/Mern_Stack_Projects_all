// import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
// import React, { useEffect, useState } from 'react';
// import { Line } from 'react-chartjs-2';
// import { io } from 'socket.io-client';

// // Register required Chart.js components
// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// const socket = io('http://localhost:9000', {
//   transports: ['websocket'],
// });

// function App() {
//   const [bitcoinPrices, setBitcoinPrices] = useState([]);
//   const [timestamps, setTimestamps] = useState([]);

//   useEffect(() => {
//     socket.on('bitcoinPrice', (price) => {
//       const timestamp = new Date().toLocaleTimeString();

//       // Update state with new Bitcoin price and timestamp
//       setBitcoinPrices((prevPrices) => [...prevPrices, price].slice(-10)); // Keep last 10 prices
//       setTimestamps((prevTimes) => [...prevTimes, timestamp].slice(-10)); // Keep last 10 timestamps
//     });

//     return () => {
//       socket.off('bitcoinPrice');
//     };
//   }, []);

//   const data = {
//     labels: timestamps, // X-axis: time
//     datasets: [
//       {
//         label: 'Bitcoin Price (USD)',
//         data: bitcoinPrices, // Y-axis: Bitcoin prices
//         borderColor: 'rgb(75, 192, 192)',
//         backgroundColor: 'rgba(75, 192, 192, 0.2)',
//         tension: 0.1,
//       },
//     ],
//   };

//   return (
//     <div style={{ width: '80%', margin: 'auto', padding: '50px' }}>
//       <h2>Live Bitcoin Price</h2>
//       <Line data={data} />
//     </div>
//   );
// }

// export default App;

