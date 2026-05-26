import { useState, useEffect } from "react";

import {
  useNavigate
} from "react-router-dom";

function SettingsPage() {

  const navigate =
    useNavigate();

  const [darkMode, setDarkMode] =
    useState(
      localStorage.getItem("darkMode")
      === "true"
    );

  const [sound, setSound] =
    useState(
      localStorage.getItem("studySound")
      !== "false"
    );

  const [notifications,
    setNotifications
  ] = useState(
    localStorage.getItem("notifications")
    !== "false"
  );
useEffect(() => {

  if (darkMode) {

    document.body.style.filter =
      "invert(1) hue-rotate(180deg)";

  }

  else {

    document.body.style.filter =
      "none";

  }

}, [darkMode]);
useEffect(() => {

  const images =
    document.querySelectorAll(
      "img"
    );

  images.forEach(img => {

    img.style.filter =
      darkMode
        ? "invert(1) hue-rotate(180deg)"
        : "none";

  });

}, [darkMode]);

  const saveSettings = () => {

    localStorage.setItem(
      "darkMode",
      darkMode
    );

    localStorage.setItem(
      "studySound",
      sound
    );

    localStorage.setItem(
      "notifications",
      notifications
    );

    alert(
      "Settings Saved"
    );

  };

  return (

    <div style={container}>

      <div style={card}>

        {/* CLOSE */}

        <button
          style={closeBtn}
          onClick={() =>
            navigate("/dashboard")
          }
        >
          ✖
        </button>

        <h1>
          ⚙ Settings
        </h1>

        {/* DARK MODE */}

        <div style={settingRow}>

          <span>
            Dark Mode
          </span>

          <input
            type="checkbox"
            checked={darkMode}
            onChange={() =>
              setDarkMode(
                !darkMode
              )
            }
          />

        </div>

        {/* SOUND */}

        <div style={settingRow}>

          <span>
            Study Sound
          </span>

          <input
            type="checkbox"
            checked={sound}
            onChange={() =>
              setSound(
                !sound
              )
            }
          />

        </div>

        {/* NOTIFICATION */}

        <div style={settingRow}>

          <span>
            Notifications
          </span>

          <input
            type="checkbox"
            checked={notifications}
            onChange={() =>
              setNotifications(
                !notifications
              )
            }
          />

        </div>

        {/* BUTTONS */}

        <div style={btnGroup}>

          <button
            style={saveBtn}
            onClick={saveSettings}
          >
            Save
          </button>

          <button
            style={cancelBtn}
            onClick={() =>
              navigate("/dashboard")
            }
          >
            Cancel
          </button>

        </div>

      </div>

    </div>

  );

}

const container = {
  padding: "30px"
};

const card = {
  position: "relative",
  maxWidth: "500px",
  margin: "auto",
  background: "white",
  borderRadius: "20px",
  padding: "35px",
  boxShadow:
    "0 10px 30px rgba(0,0,0,0.1)"
};

const closeBtn = {
  position: "absolute",
  top: "20px",
  right: "20px",
  background: "#ef4444",
  color: "white",
  border: "none",
  width: "38px",
  height: "38px",
  borderRadius: "50%",
  cursor: "pointer",
  fontSize: "18px",
  fontWeight: "bold"
};

const settingRow = {
  display: "flex",
  justifyContent:
    "space-between",
  alignItems: "center",
  padding: "18px 0",
  borderBottom:
    "1px solid #e2e8f0"
};

const btnGroup = {
  display: "flex",
  gap: "15px",
  marginTop: "30px"
};

const saveBtn = {
  flex: 1,
  background:
    "linear-gradient(135deg,#4f46e5,#7c3aed)",
  color: "white",
  border: "none",
  padding: "14px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "bold"
};

const cancelBtn = {
  flex: 1,
  background: "#e2e8f0",
  color: "#0f172a",
  border: "none",
  padding: "14px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "bold"
};

export default SettingsPage;