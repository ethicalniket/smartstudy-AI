import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ margin: "100px", textAlign: "center" }}>
      <h1>Dashboard</h1>
      <p>You are logged in ✅</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;