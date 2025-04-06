import React, { useState, useEffect } from "react";
import axios from "axios";
import '../css/SearchPage.css'; // CSS dosyasını ekliyoruz

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
    if (!query) return;  // query boşsa işlem yapma
    setLoading(true);
    setWebResults([]);
    setOtherResults([]);
    
    try {
      const token = localStorage.getItem("token");  // Kullanıcı token'ını alıyoruz
      const res = await axios.get(
        `http://localhost:5000/api/products/search?q=${query}`,  // query parametresini URL'ye ekliyoruz
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWebResults(res.data.webResults);  // Google'dan gelen sonuçları set ediyoruz
      setOtherResults(res.data.dbResults);  // Veritabanından gelen sonuçları set ediyoruz
    } catch (err) {
      console.error("Search error", err);  // Hata mesajını konsola yazdırıyoruz
    } finally {
      setLoading(false);  // Yükleniyor durumunu sonlandırıyoruz
    }
  };

  return (
    <div className="search-container">
      {/* Arama kutusu */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for products"
        className="search-input"
      />

      {/* Arama Butonu */}
      <button onClick={handleSearch} disabled={loading} className="search-button">
        {loading ? "Loading..." : "Search"}
      </button>

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : (
        <div className="results-container">
          <h3 className="results-header">Web Results</h3>
          {webResults.length > 0 ? (
            <div className="results-list">
              {webResults.map((result, index) => (
                <div key={index} className="result-card">
                  {result.image ? (
                    <img src={result.image} alt={result.name} className="result-image" />
                  ) : (
                    <img src="result.image" alt="placeholder" className="result-image" />
                  )}
                  <h4 className="result-title">{result.name}</h4>
                  <p className="result-snippet">{result.snippet}</p>
                  <p className="result-price">{result.price} {result.currency}</p>
                  <p className="result-supplier">Supplier: {result.supplier}</p>
                  <p className="result-delivery-time">Delivery time: {result.delivery_time} days</p>
                  <a href={result.url} target="_blank" rel="noopener noreferrer" className="result-link">
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
