import React, { useState } from "react";
import axios from "axios";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [webResults, setWebResults] = useState([]);
  const [dbResults, setDbResults] = useState([]);

  const handleSearch = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post("http://localhost:5000/api/products/search", { query }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWebResults(response.data.webResults);
      setDbResults(response.data.dbResults);
    } catch (err) {
      console.error("Arama başarısız:", err);
    }
  };

  return (
    <div>
      <h2>Ürün Ara</h2>
      <input
        type="text"
        placeholder="Ürün ismi"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Ara</button>

      <h3>Web'de Bulunanlar</h3>
      {webResults.map((item, i) => (
        <div key={i}>
          <p>{item.name} - {item.price} {item.currency}</p>
          <a href={item.url} target="_blank">Bağlantı</a>
        </div>
      ))}

      <h3>Diğer Kullanıcıların Arattıkları</h3>
      {dbResults.map((item, i) => (
        <div key={i}>
          <p>{item.name} - {item.price} {item.currency}</p>
          <a href={item.url} target="_blank">Bağlantı</a>
        </div>
      ))}
    </div>
  );
};

export default SearchPage;
