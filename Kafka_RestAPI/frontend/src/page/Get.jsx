import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './style/get.css'; // Importing custom CSS

const PaginatedList = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [hobby, setHobby] = useState('');
  const [remove, setRemove] = useState('');
  const [eligible, setEligible] = useState('');
  const [less, setLess] = useState('');  // New state for age filter
  const [list , setList]=useState('')
  const [great , setGreat]=useState('')
  const [pricel ,setPricel]=useState('')
  const [priceg , setPriceg]=useState('')


  let query = `http://localhost:9000/v2/AdGet?page=${page}&limit=${limit}&names=${name}&countrys=${country}&hoobies=${hobby}&removes=${remove}&truess=${eligible}&lesses=${less}&agegreats=${great}&pricegreat=${priceg}&priceless=${pricel}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(query);
        console.log(response.data)
     setList(response.data.totalCount)
      
        setData(response.data.data);
        setTotalPages(Math.ceil(response.data.totalCount / limit));
     
      } catch (error) {
        alert("Error fetching data:", error.response.data.message);
        console.error("Error fetching data:", error.response.data.message);
    
      }
    };
    fetchData();
  }, [page, limit, name, country, hobby, remove, eligible,less,great,priceg,pricel]);

  const nextPage = () => setPage((prevPage) => Math.min(prevPage + 1, totalPages));
  const prevPage = () => setPage((prevPage) => Math.max(prevPage - 1, 1));
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="paginated-list">
    <h1>Total: {list ? list : "not available"}</h1>
      <h2>Paginated List</h2>
      <form onSubmit={handleSearch} className="search-form">
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        {/* <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" /> */}

      
        <label>
        Country:
        <select value={country} onChange={(e) => setCountry(e.target.value)} required>
          <option value="">Select Country</option>
          <option value="USA">USA</option>
          <option value="Canada">Canada</option>
          <option value="India">India</option>
          <option value="UK">UK</option>
        </select>
      </label>
        <input type="text" value={hobby} onChange={(e) => setHobby(e.target.value)} placeholder="Hobby" />
        <input type="text" name="" value={priceg} onChange={(e)=>setPriceg(e.target.value)}  placeholder='price greater' />
        <input type="text" name="" value={pricel} onChange={(e)=>setPricel(e.target.value)}  placeholder='price less' />
        
        <input type="number" value={less} onChange={(e) => setLess(e.target.value)} placeholder="Age less than" />
        <input type="number" value={great} onChange={(e) => setGreat(e.target.value)} placeholder="Age greten than" />
        <select value={eligible} onChange={(e) => setEligible(e.target.value)}>
          <option value="">isEligible</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
        <select value={remove} onChange={(e) => setRemove(e.target.value)}>
          <option value="">Include _id</option>
          <option value="0">Exclude _id</option>
        </select>
 
      </form>

      <div className="results">
        {data.length > 0 ? data.map((item) => (
          <div key={item._id} className="result-item">
          <h3>ID: {item._id}</h3>
            <h3>{item.name}</h3>
            <h3>{item.email}</h3>
            <p>Gender: {item.gender}</p>
            <p>Age: {item.age}</p>
            <p>Country: {item.country}</p>
            <p>Hobby: {item.hobbies}</p>
            <p>price: {item.price}</p>
            <p className={item.isEligible ? "eligible-true" : "eligible-false"}>
  Eligible: {item.isEligible ? "True" : "False"}
</p>


          </div>
        )) : <p>No data available</p>}
      </div>

      <div className="pagination">
        <button onClick={prevPage} disabled={page === 1}>Previous</button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={nextPage} disabled={page === totalPages}>Next</button>
      </div>
    </div>
  );
};

export default PaginatedList;
