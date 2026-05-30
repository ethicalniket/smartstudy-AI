import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function FloatingTimer() {

  // ================= STATES =================

  const [seconds, setSeconds] =
    useState(0);

    const location = useLocation();

    const showUI =
      location.pathname === "/dashboard";

  const [targetMinutes, setTargetMinutes] =
    useState("");

  const [isRunning, setIsRunning] =
    useState(false);

  const [expanded, setExpanded] =
    useState(false);

  // ================= TIMER =================

  useEffect(() => {

    let timer;

    if (isRunning) {

      timer = setInterval(() => {

        setSeconds(prev => {

          const updated =
            prev + 1;

          // TARGET COMPLETE

          if (

            targetMinutes &&
            Number(targetMinutes) > 0 &&

            updated >=
            Number(targetMinutes) * 60

          ) {

            alert(
              "⏰ Study Goal Completed! Take a break."
            );

            setIsRunning(false);

          }

          return updated;

        });

      }, 1000);

    }

    return () =>
      clearInterval(timer);

  }, [
    isRunning,
    targetMinutes
  ]);

  // ================= ACTIONS =================

  const startTimer = () => {

    setIsRunning(true);

  };

  const pauseTimer = () => {

    setIsRunning(false);

  };

  const resetTimer = () => {

    setIsRunning(false);

    setSeconds(0);

  };

  // ================= FORMAT =================

  const formatTime = () => {

    const hrs =
      Math.floor(seconds / 3600);

    const mins =
      Math.floor(
        (seconds % 3600) / 60
      );

    const secs =
      seconds % 60;

    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  };

  // ================= UI =================

  return (

    <>

      {/* MINI FLOATING BUTTON */}

      {showUI && !expanded && (

        <div
          style={floatingIcon}
          onClick={() =>
            setExpanded(true)
          }
        >

          ⏳

          <div style={miniTime}>

            {formatTime()}

          </div>

        </div>

      )}

      {/* EXPANDED CARD */}

     {showUI && expanded && (

        <div style={floatingCard}>

          {/* CLOSE */}

          <button
            style={closeButton}
            onClick={() =>
              setExpanded(false)
            }
          >
            ✖
          </button>

          {/* TITLE */}

          <h2 style={heading}>
            📚 Study Tracker
          </h2>

          {/* TIMER */}

          <h1 style={timeText}>

            {formatTime()}

          </h1>

          {/* TARGET */}

          <input
            type="number"
            placeholder="Optional target (minutes)"
            value={targetMinutes}
            onChange={(e) =>
              setTargetMinutes(
                e.target.value
              )
            }
            style={timeInput}
          />

          <p style={helperText}>

            Leave empty for
            unlimited tracking

          </p>

          {/* BUTTONS */}

          <div style={btnGroup}>

            <button
              style={startBtn}
              onClick={startTimer}
            >
              {
                isRunning
                  ? "Running..."
                  : "Start"
              }
            </button>

            <button
              style={pauseBtn}
              onClick={pauseTimer}
            >
              Pause
            </button>

            <button
              style={resetBtn}
              onClick={resetTimer}
            >
              Reset
            </button>

          </div>

        </div>

      )}

    </>

  );

}

// ================= STYLES =================

const floatingIcon = {
  width: "90px",
  height: "90px",
  borderRadius: "22px",
  background:
    "linear-gradient(135deg,#4f46e5,#7c3aed)",
  color: "white",
  position: "fixed",
  bottom: "25px",
  right: "25px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  boxShadow:
    "0 10px 30px rgba(124,58,237,0.45)",
  zIndex: 9999,
  fontWeight: "bold",
  transition: "0.3s"
};

const miniTime = {
  marginTop: "6px",
  fontSize: "12px"
};

const floatingCard = {
  width: "340px",
  background: "white",
  borderRadius: "24px",
  padding: "28px",
  position: "fixed",
  bottom: "25px",
  right: "25px",
  zIndex: 9999,
  boxShadow:
    "0 20px 45px rgba(0,0,0,0.2)",
  textAlign: "center"
};

const closeButton = {
  position: "absolute",
  top: "14px",
  right: "14px",
  border: "none",
  background: "#ef4444",
  color: "white",
  borderRadius: "50%",
  width: "32px",
  height: "32px",
  cursor: "pointer",
  fontWeight: "bold"
};

const heading = {
  marginBottom: "18px",
  color: "#0f172a",
  fontSize: "24px"
};

const timeText = {
  fontSize: "52px",
  margin: "20px 0",
  color: "#111827",
  letterSpacing: "2px"
};

const timeInput = {
  width: "210px",
  padding: "12px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  textAlign: "center",
  fontSize: "15px",
  outline: "none"
};

const helperText = {
  fontSize: "12px",
  color: "#64748b",
  marginTop: "10px",
  marginBottom: "22px"
};

const btnGroup = {
  display: "flex",
  justifyContent: "center",
  gap: "10px",
  flexWrap: "wrap"
};

const startBtn = {
  background: "#22c55e",
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold"
};

const pauseBtn = {
  background: "#f59e0b",
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold"
};

const resetBtn = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold"
};

export default FloatingTimer;