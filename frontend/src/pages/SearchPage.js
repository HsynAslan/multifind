import React, { useState, useEffect } from "react";
import axios from "axios";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [webResults, setWebResults] = useState([]);
  const [otherResults, setOtherResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Kullanıcı yazdıkça autocomplete için veritabanından geçmiş aramaları çek
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) return;
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/products/suggestions?q=${query}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSuggestions(res.data);
      } catch (err) {
        console.error("Autocomplete error", err);
      }
    };
    fetchSuggestions();
  }, [query]);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setWebResults([]);
    setOtherResults([]);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/products/search",
        { query },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWebResults(res.data.webResults);
      setOtherResults(res.data.dbResults);
    } catch (err) {
      console.error("Search error", err);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div>
      {/* Arama kutusu */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for products"
      />

      {/* Arama Butonu */}
      <button onClick={handleSearch} disabled={loading}>
        {loading ? "Loading..." : "Search"}
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h3>Web Results</h3>
          {webResults.length > 0 ? (
  <div>
    {webResults.map((result, index) => (
      <div key={index}>
        <h3>{result.name}</h3>
        <p>{result.snippet}</p>
        <a href={result.url} target="_blank" rel="noopener noreferrer">
          Go to product
        </a>
      </div>
    ))}
  </div>
) : (
  <p>No results found.</p>
)}

        </div>
      )}
    </div>
  );
};

export default SearchPage;
