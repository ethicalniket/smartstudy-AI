import {
  Link,
  Outlet,
  useLocation
} from "react-router-dom";

import FloatingTimer from "../components/FloatingTimer";

import { useState } from "react";

function DashboardLayout() {

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [profileOpen, setProfileOpen] =
    useState(false);

  const location = useLocation();

  // =========================
  // PAGE TITLE
  // =========================

  const getPageTitle = () => {

    if (
      location.pathname.includes(
        "/upload"
      )
    ) {

      return "Study PDFs";

    }

    if (
      location.pathname.includes(
        "/routine"
      )
    ) {

      return "Study Routine";

    }

    if (
      location.pathname.includes(
        "/interview"
      )
    ) {

      return "Interview Mode";

    }
    if (
      location.pathname.includes(
        "/ai-study"
      )
    ) {

      return "AI Study Assistant";

    }

    if (
      location.pathname.includes(
        "/profile"
      )
    ) {

      return "My Profile";

    }

    return "Dashboard";

  };

  // =========================
  // USERNAME
  // =========================

  const userName =

    localStorage.getItem(
      "userName"
    ) || "Student";

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "userName"
    );

    window.location.href =
      "/login";

  };

  // =========================
  // MENU
  // =========================

  const menuItems = [

    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "🏠"
    },

    {
      name: "Study Routine",
      path: "/dashboard/routine",
      icon: "📚"
    },

    {
      name: "Upload PDFs",
      path: "/dashboard/upload",
      icon: "📄"
    },


    {
      name: "Interview Mode",
      path: "/dashboard/interview",
      icon: "🎤"
    },{
        name: "AI Study Assistant",
        path: "/dashboard/ai-study",
        icon: "🤖"
      }

  ];

  return (

    <div style={container}>

      {/* OVERLAY */}

      {

        sidebarOpen && (

          <div
            onClick={() =>
              setSidebarOpen(false)
            }
            style={overlay}
          />

        )

      }

      {/* SIDEBAR */}

      <div
        style={{
          ...sidebar,

          left:
            sidebarOpen
              ? "0"
              : "-260px"
        }}
      >

        <div>

          <h2 style={logo}>
            SmartStudy AI
          </h2>

          <p style={tagline}>
            AI Study Platform
          </p>

          {/* MENU */}

          <div style={menuContainer}>

            {

              menuItems.map(
                (item, index) => {

                  const active =

                    location.pathname ===
                    item.path;

                  return (

                    <Link
                      key={index}

                      to={item.path}

                      onClick={() =>
                        setSidebarOpen(
                          false
                        )
                      }

                      style={{

                        ...menuItem,

                        ...(active
                          ? activeMenuItem
                          : {})

                      }}
                    >

                      <span>
                        {item.icon}
                      </span>

                      <span>
                        {item.name}
                      </span>

                    </Link>

                  );

                }
              )

            }

          </div>

        </div>

      </div>

      {/* MAIN */}

      <div style={mainContent}>

        {/* TOPBAR */}

        <div style={topbar}>

          {/* LEFT */}

          <div style={topbarLeft}>

            <button
              onClick={() =>
                setSidebarOpen(true)
              }
              style={menuButton}
            >

              ☰

            </button>

            <h2 style={pageTitle}>
              {getPageTitle()}
            </h2>

          </div>

          {/* RIGHT */}

          <div style={userSection}>

            <div
              style={profileBox}

              onClick={() =>
                setProfileOpen(
                  !profileOpen
                )
              }
            >

              <span style={profileName}>

                👤 {userName}

              </span>

              <span>
                ▼
              </span>

            </div>

            {

              profileOpen && (

                <div
                  style={
                    profileDropdown
                  }
                >

                  <Link
                    to="/dashboard/profile"

                    style={dropdownLink}
                  >

                    <div style={dropdownItem}>
                      My Profile
                    </div>

                  </Link>

                  <Link
                    to="/dashboard/settings"

                    style={dropdownLink}
                  >

                    <div style={dropdownItem}>
                      Settings
                    </div>

                  </Link>

                  <div
                    style={dropdownItem}

                    onClick={
                      handleLogout
                    }
                  >

                    Logout

                  </div>

                </div>

              )

            }

          </div>

        </div>

        {/* PAGE */}

        <div style={pageContent}>

         <Outlet
           context={{
             sidebarOpen
           }}
         />
        </div>

      </div>

      {/* TIMER */}

      <FloatingTimer />

    </div>

  );

}

// =========================
// STYLES
// =========================

const container = {

  minHeight: "100vh",

  width: "100%",

  overflowX: "hidden",

  background: "#f1f5f9"

};

const overlay = {

  position: "fixed",

  top: 0,

  left: 0,

  width: "100%",

  height: "100%",

  background:
    "rgba(0,0,0,0.35)",

  zIndex: 5

};

const sidebar = {

  position: "fixed",

  top: 0,

  width: "240px",

  maxWidth: "85vw",

  height: "100vh",

  overflowY: "auto",

  background: "#0f172a",

  color: "white",

  padding: "25px 20px",

  transition: "0.3s ease",

  zIndex: 10,

  boxShadow:
    "2px 0 18px rgba(0,0,0,0.25)"

};

const logo = {

  margin: 0,

  fontSize:
    "clamp(24px,4vw,30px)",

  fontWeight: "800"

};

const tagline = {

  color: "#94a3b8",

  fontSize: "14px",

  marginTop: "8px"

};

const menuContainer = {

  marginTop: "35px",

  display: "flex",

  flexDirection: "column",

  gap: "12px"

};

const menuItem = {

  display: "flex",

  alignItems: "center",

  gap: "12px",

  padding: "14px 16px",

  borderRadius: "14px",

  color: "white",

  textDecoration: "none",

  transition: "0.3s"

};

const activeMenuItem = {

  background:
    "linear-gradient(135deg,#2563eb,#4f46e5)",

  boxShadow:
    "0 8px 18px rgba(37,99,235,0.35)"

};

const mainContent = {

  display: "flex",

  flexDirection: "column",

  minHeight: "100vh",

  width: "100%",

  overflowX: "hidden"

};

const topbar = {

  background: "white",

  padding: "15px 20px",

  display: "flex",

  position: "sticky",

  top: 0,

  zIndex: 4,

  justifyContent: "space-between",

  alignItems: "center",

  flexWrap: "wrap",

  gap: "14px",

  boxShadow:
    "0 2px 8px rgba(0,0,0,0.05)"

};

const topbarLeft = {

  display: "flex",

  alignItems: "center",

  gap: "15px",

  flexWrap: "wrap"

};

const pageTitle = {

  margin: 0,

  fontSize:
    "clamp(22px,4vw,30px)",

  color: "#0f172a",

  fontWeight: "800"

};

const menuButton = {

  fontSize: "24px",

  border: "none",

  background: "none",

  cursor: "pointer",

  padding: "4px"

};

const userSection = {

  display: "flex",

  alignItems: "center",

  gap: "12px",

  flexWrap: "wrap",

  position: "relative"

};

const profileBox = {

  display: "flex",

  alignItems: "center",

  gap: "10px",

  cursor: "pointer",

  padding: "10px 14px",

  borderRadius: "14px",

  background: "#f8fafc",

  fontWeight: "600",

  border: "1px solid #e2e8f0",

  maxWidth: "220px",

  overflow: "hidden",

  whiteSpace: "nowrap",

  textOverflow: "ellipsis"

};

const profileName = {

  overflow: "hidden",

  textOverflow: "ellipsis"

};

const profileDropdown = {

  position: "absolute",

  top: "58px",

  right: 0,

  width: "190px",

  background: "white",

  borderRadius: "14px",

  boxShadow:
    "0 10px 25px rgba(0,0,0,0.12)",

  overflow: "hidden",

  zIndex: 999

};

const dropdownLink = {

  textDecoration: "none",

  color: "black"

};

const dropdownItem = {

  padding: "14px 16px",

  cursor: "pointer",

  borderBottom:
    "1px solid #e2e8f0",

  transition: "0.2s"

};

const pageContent = {

  padding: "16px",

  overflowY: "auto",

  width: "100%",

  maxWidth: "100vw",

  overflowX: "hidden",

  boxSizing: "border-box"

};

export default DashboardLayout;