
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

    return "Dashboard";

  };

  const token = localStorage.getItem("token");

  let email = "";

  if (token) {

    try {

      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      email = payload.sub;

    } catch {

      email = "";

    }

  }

  const handleLogout = () => {

    localStorage.removeItem("token");

    window.location.href = "/login";

  };

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
      }


  ];

  return (

    <div style={container}>

      {/* OVERLAY */}

      {sidebarOpen && (

        <div
          onClick={() =>
            setSidebarOpen(false)
          }
          style={overlay}
        />

      )}

      {/* SIDEBAR */}

      <div
        style={{
          ...sidebar,
          left: sidebarOpen ? "0" : "-260px"
        }}
      >

        <div>

          <h2 style={logo}>
            SmartStudy AI
          </h2>

          <p style={tagline}>
            AI Study Platform
          </p>

          <div style={menuContainer}>

            {menuItems.map(
              (item, index) => {

                const active =
                  location.pathname ===
                  item.path;

                return (

                  <Link
                    key={index}
                    to={item.path}
                    onClick={() =>
                      setSidebarOpen(false)
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
            )}

          </div>

        </div>

      </div>

      {/* MAIN */}

      <div style={mainContent}>

        {/* TOPBAR */}

        <div style={topbar}>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px"
            }}
          >

            <button
              onClick={() =>
                setSidebarOpen(true)
              }
              style={menuButton}
            >
              ☰
            </button>

            <h2 style={{ margin: 0 }}>
              {getPageTitle()}
            </h2>

          </div>

          {/* USER */}

         <div style={userSection}>

           <div
             style={profileBox}
             onClick={() =>
               setProfileOpen(
                 !profileOpen
               )
             }
           >

             <span>
               👤 {email}
             </span>

             <span>
               ▼
             </span>

           </div>

           {profileOpen && (

             <div style={profileDropdown}>

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
                 onClick={handleLogout}
               >
                 Logout
               </div>

             </div>

           )}

         </div>

        </div>

        {/* PAGE */}

        <div style={pageContent}>

          <Outlet />

        </div>

      </div>
<FloatingTimer />
    </div>

  );

}

// ================= STYLES =================

const container = {
  height: "100vh",
  background: "#f1f5f9"
};

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.3)",
  zIndex: 5
};

const sidebar = {
  position: "fixed",
  top: 0,
  width: "240px",
  height: "100%",
  background: "#0f172a",
  color: "white",
  padding: "25px 20px",
  transition: "0.3s",
  zIndex: 10,
  boxShadow: "2px 0 10px rgba(0,0,0,0.2)"
};

const logo = {
  margin: 0
};

const tagline = {
  color: "#94a3b8",
  fontSize: "14px",
  marginTop: "6px"
};

const menuContainer = {
  marginTop: "35px",
  display: "flex",
  flexDirection: "column",
  gap: "10px"
};

const menuItem = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "12px 14px",
  borderRadius: "8px",
  color: "white",
  textDecoration: "none"
};

const activeMenuItem = {
  background: "#2563eb"
};

const mainContent = {
  display: "flex",
  flexDirection: "column",
  height: "100%"
};

const topbar = {
  background: "white",
  padding: "15px 25px",
  display: "flex",
  position: "relative",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow:
    "0 2px 8px rgba(0,0,0,0.05)"
};

const menuButton = {
  fontSize: "22px",
  border: "none",
  background: "none",
  cursor: "pointer"
};

const userSection = {
  display: "flex",
  alignItems: "center",
  gap: "15px"
};
const profileBox = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  cursor: "pointer",
  padding: "10px 14px",
  borderRadius: "10px",
  background: "#f8fafc",
  fontWeight: "500"
};

const profileDropdown = {
  position: "absolute",
  top: "70px",
  right: "30px",
  width: "180px",
  background: "white",
  borderRadius: "12px",
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
    "1px solid #e2e8f0"
};


const pageContent = {
  padding: "25px",
  overflowY: "auto"
};

export default DashboardLayout;