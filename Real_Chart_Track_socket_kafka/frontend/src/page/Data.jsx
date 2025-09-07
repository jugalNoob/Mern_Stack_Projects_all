import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './style/Data.css'; // Added CSS import

const Home = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:9000/home');
        setData(response.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      }
    };

    fetchData();
  }, []); // Empty dependency array to run once on mount

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="container">
      <h1 className="title">Home Data</h1>
      <ul className="data-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {data.map((item, index) => (
          <li key={index} className="data-item" style={{ flex: '1 1 calc(33.333% - 10px)', boxSizing: 'border-box' }}>{JSON.stringify(item)}</li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
