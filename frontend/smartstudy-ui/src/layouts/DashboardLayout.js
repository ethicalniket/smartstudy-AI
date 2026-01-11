import { Outlet, Link, useNavigate } from "react-router-dom";
import { logout } from "../services/authService";

const DashboardLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* Sidebar */}
      <div
        style={{
          width: "220px",
          background: "#1e293b",
          color: "#fff",
          padding: "20px",
        }}
      >
        <h2 style={{ marginBottom: "30px" }}>SmartStudy AI</h2>

        <p>
          <Link to="/dashboard" style={{ color: "#fff", textDecoration: "none" }}>
            📊 Dashboard
          </Link>
        </p>

        <p>
          <Link to="/dashboard/upload" style={{ color: "#fff", textDecoration: "none" }}>
            ⬆ Upload PDF
          </Link>
        </p>

        <button
          onClick={handleLogout}
          style={{ marginTop: "30px", width: "100%" }}
        >
          Logout
        </button>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: "30px", background: "#f8fafc" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;