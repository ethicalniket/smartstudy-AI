import React from "react";
import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  getToken,
  logout
} from "../services/authService";

const Navbar = () => {

  const token =
    getToken();

  const navigate =
    useNavigate();

  const handleLogout = () => {

    logout();

    navigate("/login");

  };

  return (

    <nav style={navbar}>

      {/* LEFT */}

      <div style={logoSection}>

        <div style={logo}>
          🤖
        </div>

        <div>

          <h2 style={title}>
            SmartStudy AI
          </h2>

          <p style={subtitle}>
            AI Study Platform
          </p>

        </div>

      </div>

      {/* RIGHT */}

      <div style={rightSection}>

        {!token ? (

          <>

            <Link
              to="/login"
              style={navLink}
            >
              Login
            </Link>

            <Link
              to="/register"
              style={registerBtn}
            >
              Register
            </Link>

          </>

        ) : (

          <>

            <Link
              to="/dashboard"
              style={dashboardBtn}
            >
              Dashboard
            </Link>

            <button
              onClick={handleLogout}
              style={logoutBtn}
            >

              Logout

            </button>

          </>

        )}

      </div>

    </nav>

  );

};

export default Navbar;

// ================= STYLES =================

const navbar = {

  padding: "14px 28px",

  background: "#0f172a",

  display: "flex",

  justifyContent: "space-between",

  alignItems: "center",

  borderBottom:
    "1px solid rgba(255,255,255,0.06)",

  position: "sticky",

  top: 0,

  zIndex: 1000

};

const logoSection = {

  display: "flex",

  alignItems: "center",

  gap: "14px"

};

const logo = {

  width: "52px",

  height: "52px",

  borderRadius: "16px",

  background:
    "linear-gradient(135deg,#4f46e5,#7c3aed)",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  fontSize: "24px",

  boxShadow:
    "0 8px 18px rgba(99,102,241,0.28)"

};

const title = {

  color: "white",

  fontSize: "24px",

  fontWeight: "800",

  margin: 0

};

const subtitle = {

  color: "#94a3b8",

  fontSize: "14px",

  marginTop: "4px"

};

const rightSection = {

  display: "flex",

  alignItems: "center",

  gap: "14px"

};

const navLink = {

  color: "white",

  textDecoration: "none",

  fontWeight: "600",

  padding: "10px 16px",

  borderRadius: "10px",

  transition: "0.25s ease"

};

const registerBtn = {

  background:
    "linear-gradient(135deg,#7c3aed,#4f46e5)",

  color: "white",

  textDecoration: "none",

  padding: "11px 18px",

  borderRadius: "12px",

  fontWeight: "700",

  boxShadow:
    "0 6px 14px rgba(124,58,237,0.25)"

};

const dashboardBtn = {

  background:
    "linear-gradient(135deg,#2563eb,#3b82f6)",

  color: "white",

  textDecoration: "none",

  padding: "11px 18px",

  borderRadius: "12px",

  fontWeight: "700",

  boxShadow:
    "0 6px 14px rgba(37,99,235,0.25)"

};

const logoutBtn = {

  background: "#ef4444",

  color: "white",

  border: "none",

  padding: "11px 18px",

  borderRadius: "12px",

  cursor: "pointer",

  fontWeight: "700",

  boxShadow:
    "0 6px 14px rgba(239,68,68,0.25)"

};