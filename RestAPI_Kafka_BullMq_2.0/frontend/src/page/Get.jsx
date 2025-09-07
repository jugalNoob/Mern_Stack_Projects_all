import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./get.css";

const SearchWithRedis = () => {
  const [filters, setFilters] = useState({
    name: "",
    countrys: "",
    truess: "",
    hoobies: "",
    removes: "",
    prices: "",
    pricegreat: "",
    priceless: "",
    agelessValue: "",
    agegreatValues: "",
    page: 1,
    limit: 10,
  });

  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });
  const [headers, setHeaders] = useState({});
  const [error, setError] = useState("");
  const [ttl, setTtl] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, val]) => val !== "")
      );

      const res = await axios.get("http://localhost:9000/apisearchredis", {
        params: cleanFilters,
      });


      console.log(res)

      const { data: result } = res.data;



      setData(Array.isArray(result) ? result : res.data.data);
      setMeta({
        total: res.data.total,
        totalPages: res.data.totalPages,
      });

      setHeaders({
        cache: res.headers["x-cache"],
        source: res.headers["x-cache-source"],
        time: res.headers["x-response-time"],
      });

      const ttlHeader = res.headers["x-ttl-seconds"];
      if (ttlHeader) setTtl(Number(ttlHeader));
    } catch (err) {
      if (err.response?.status === 429) {
        setError("Too many requests. Retry after " + err.response.data.retryAfter);
      } else {
        setError("❌ Failed to fetch data");
      }
      setData([]);
      setTtl(null);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // TTL countdown
  useEffect(() => {
    if (ttl === null) return;
    const timer = setInterval(() => {
      setTtl((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [ttl]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const nextPage = () => {
    if (filters.page < meta.totalPages) {
      setFilters((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const prevPage = () => {
    if (filters.page > 1) {
      setFilters((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  };

  return (
    <div className="paginated-list">
      <h2>Redis Filtered Search</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={(e) => e.preventDefault()}>
        <input name="name" value={filters.name} onChange={handleChange} placeholder="Name" />
        <input name="countrys" value={filters.countrys} onChange={handleChange} placeholder="Country" />
        <input name="hoobies" value={filters.hoobies} onChange={handleChange} placeholder="Hobby" />
        <input name="priceless" value={filters.priceless} onChange={handleChange} placeholder="Price Min" />
        <input name="pricegreat" value={filters.pricegreat} onChange={handleChange} placeholder="Price Max" />
        <input name="agelessValue" value={filters.agelessValue} onChange={handleChange} placeholder="Age Min" />
        <input name="agegreatValues" value={filters.agegreatValues} onChange={handleChange} placeholder="Age Max" />
        <select name="truess" value={filters.truess} onChange={handleChange}>
          <option value="">isEligible</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </form>

      <h3>
        Cache: {headers.cache} | Source: {headers.source} | Time: {headers.time}
        {ttl !== null && <> | TTL Remaining: {ttl}s</>}
      </h3>

      <div className="results">
        {data.map((item) => (
          <div key={item._id} className="result-item">
            <h3>{item.name}</h3>
            <p>Email: {item.email}</p>
            <p>Age: {item.age}</p>
            <p>Country: {item.country}</p>
            <p>Hobbies: {item.hobbies?.join(", ")}</p>
            <p>Price: {item.price}</p>
            <p>Eligible: {item.isEligible ? "✅ Yes" : "❌ No"}</p>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button onClick={prevPage} disabled={filters.page === 1}>Prev</button>
        <span> Page {filters.page} / {meta.totalPages} </span>
        <button onClick={nextPage} disabled={filters.page === meta.totalPages}>Next</button>
      </div>
    </div>
  );
};

export default SearchWithRedis;