import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      <Link to="/" style={{ marginRight: "10px" }}>Home</Link>
      {token ? (
        <>
          <Link to="/profile" style={{ marginRight: "10px" }}>Profile</Link>
          <Link to="/search">Ürün Ara</Link>
          <button onClick={handleLogout}>Logout</button>
          
        </>
      ) : (
        <>
          <Link to="/login" style={{ marginRight: "10px" }}>Login</Link>
          <Link to="/register">Register</Link>
         
        </>
      )}
    </nav>
  );
};

export default Navbar;
