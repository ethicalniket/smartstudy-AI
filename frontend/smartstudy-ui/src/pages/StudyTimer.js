import { useEffect, useState } from "react";

function StudyTimer() {

  // ================= STATES =================

  const [minutes, setMinutes] =
    useState(25);

  const [seconds, setSeconds] =
    useState(0);

  const [isRunning, setIsRunning] =
    useState(false);

  const [isBreak, setIsBreak] =
    useState(false);

  const [sessions, setSessions] =
    useState(0);

  // ================= TIMER =================

  useEffect(() => {

    let timer;

    if (isRunning) {

      timer = setInterval(() => {

        if (seconds > 0) {

          setSeconds(
            seconds - 1
          );

        }

        else {

          if (minutes === 0) {

            // SESSION COMPLETE

            if (!isBreak) {

              alert(
                "🎉 Study Session Complete! Break Time."
              );

              setIsBreak(true);

              setMinutes(5);

              setSeconds(0);

              setSessions(
                prev => prev + 1
              );

            }

            else {

              alert(
                "⏰ Break Over! Back to Study."
              );

              setIsBreak(false);

              setMinutes(25);

              setSeconds(0);

            }

          }

          else {

            setMinutes(
              minutes - 1
            );

            setSeconds(59);

          }

        }

      }, 1000);

    }

    return () =>
      clearInterval(timer);

  }, [
    isRunning,
    minutes,
    seconds,
    isBreak
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

    setMinutes(25);

    setSeconds(0);

    setIsBreak(false);

  };

  // ================= FORMAT =================

  const formatTime = value => {

    return value < 10
      ? `0${value}`
      : value;

  };

  // ================= UI =================

  return (

    <div style={container}>

      {/* HEADER */}

      <div style={header}>

        <h1 style={title}>
          ⏳ Smart Study Timer
        </h1>

        <p style={subtitle}>
          Pomodoro Focus System
        </p>

      </div>

      {/* TIMER CARD */}

      <div style={timerCard}>

        <div style={statusBox}>

          {
            isBreak
              ? "☕ Break Time"
              : "📚 Focus Mode"
          }

        </div>

        <h1 style={timeText}>

          {
            formatTime(minutes)
          }

          :

          {
            formatTime(seconds)
          }

        </h1>

        {/* BUTTONS */}

        <div style={btnGroup}>

          <button
            style={startBtn}
            onClick={startTimer}
          >
            Start
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

      {/* STATS */}

      <div style={statsGrid}>

        <div style={statCard}>

          <h2 style={statNumber}>
            {sessions}
          </h2>

          <p style={statText}>
            Sessions Completed
          </p>

        </div>

        <div style={statCard}>

          <h2 style={statNumber}>
            {sessions * 25}
          </h2>

          <p style={statText}>
            Minutes Focused
          </p>

        </div>

      </div>

      {/* TIP */}

      <div style={tipCard}>

        <h2>
          💡 Study Tip
        </h2>

        <p style={tipText}>

          Focus deeply for
          25 minutes, then
          take a short break.
          This improves memory
          retention and prevents
          burnout.

        </p>

      </div>

    </div>

  );

}

// ================= STYLES =================

const container = {
  padding: "40px",
  minHeight: "100vh",
  background: "#f1f5f9"
};

const header = {
  textAlign: "center",
  marginBottom: "40px"
};

const title = {
  fontSize: "42px",
  color: "#0f172a",
  marginBottom: "10px"
};

const subtitle = {
  color: "#64748b",
  fontSize: "18px"
};

const timerCard = {
  background: "white",
  maxWidth: "500px",
  margin: "0 auto",
  padding: "40px",
  borderRadius: "24px",
  textAlign: "center",
  boxShadow:
    "0 8px 20px rgba(0,0,0,0.08)"
};

const statusBox = {
  display: "inline-block",
  background: "#ede9fe",
  color: "#7c3aed",
  padding: "10px 18px",
  borderRadius: "999px",
  fontWeight: "bold",
  marginBottom: "25px"
};

const timeText = {
  fontSize: "90px",
  margin: "20px 0",
  color: "#0f172a"
};

const btnGroup = {
  display: "flex",
  justifyContent: "center",
  gap: "15px",
  marginTop: "25px",
  flexWrap: "wrap"
};

const startBtn = {
  background: "#22c55e",
  color: "white",
  border: "none",
  padding: "12px 22px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold"
};

const pauseBtn = {
  background: "#f59e0b",
  color: "white",
  border: "none",
  padding: "12px 22px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold"
};

const resetBtn = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "12px 22px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold"
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: "20px",
  marginTop: "40px"
};

const statCard = {
  background: "white",
  padding: "30px",
  borderRadius: "20px",
  textAlign: "center",
  boxShadow:
    "0 4px 12px rgba(0,0,0,0.06)"
};

const statNumber = {
  fontSize: "42px",
  color: "#7c3aed",
  marginBottom: "10px"
};

const statText = {
  color: "#64748b"
};

const tipCard = {
  marginTop: "40px",
  background: "white",
  padding: "30px",
  borderRadius: "20px",
  boxShadow:
    "0 4px 12px rgba(0,0,0,0.06)"
};

const tipText = {
  marginTop: "15px",
  lineHeight: "1.8",
  color: "#475569"
};

export default StudyTimer;