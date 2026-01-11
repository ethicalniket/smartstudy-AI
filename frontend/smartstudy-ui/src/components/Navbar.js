import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getToken, logout } from "../services/authService";

const Navbar = () => {
  const token = getToken();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        padding: "10px 20px",
        borderBottom: "1px solid #ccc",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <h3>SmartStudy AI</h3>

      <div>
        {!token ? (
          <>
            <Link to="/login" style={{ marginRight: "10px" }}>
              Login
            </Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" style={{ marginRight: "10px" }}>
              Dashboard
            </Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;