import { useState, useEffect } from "react";

function RoutinePage() {

  const [subject, setSubject] = useState("");
  const [time, setTime] = useState("");
  const [routines, setRoutines] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  // =========================
  // LOAD ROUTINES
  // =========================

  useEffect(() => {

    const saved = localStorage.getItem(
      "studyRoutines"
    );

    if (saved) {

      setRoutines(
        JSON.parse(saved)
      );

    }

  }, []);

  // =========================
  // NOTIFICATION PERMISSION
  // =========================

  useEffect(() => {

    if (
      Notification.permission !==
      "granted"
    ) {

      Notification.requestPermission();

    }

  }, []);

  // =========================
  // ALARM SYSTEM
  // =========================

  useEffect(() => {

    const interval = setInterval(() => {

      const saved = localStorage.getItem(
        "studyRoutines"
      );

      if (!saved) return;

      const routines = JSON.parse(saved);

      const now = new Date();

      const currentTime =

        now.getHours()
          .toString()
          .padStart(2, "0")

        +

        ":"

        +

        now.getMinutes()
          .toString()
          .padStart(2, "0");

      const today =
        now.toDateString();

      routines.forEach((r) => {

        const key =
          r.subject + r.time;

        const lastTriggered =

          localStorage.getItem(
            "alarm_" + key
          );

        // =========================
        // ALARM MATCH
        // =========================

        if (

          r.time === currentTime &&

          lastTriggered !== today

        ) {

          // =========================
          // BROWSER NOTIFICATION
          // =========================

          if (

            Notification.permission ===
            "granted"

          ) {

            new Notification(

              "📚 Study Reminder",

              {
                body:
                  "Time to study " +
                  r.subject,

                icon:
                  "https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
              }

            );

          }

          // =========================
          // ALARM SOUND
          // =========================

          const audio = new Audio(

            "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"

          );

          audio.volume = 1;

          audio.play().catch((err) => {

            console.log(
              "Audio blocked:",
              err
            );

          });

          // =========================
          // PREVENT MULTIPLE RINGS
          // =========================

          localStorage.setItem(

            "alarm_" + key,

            today

          );

        }

      });

    }, 1000);

    return () => clearInterval(interval);

  }, []);

  // =========================
  // ADD / UPDATE ROUTINE
  // =========================

  const saveRoutine = () => {

    if (!subject || !time) return;

    let updated;

    if (editIndex !== null) {

      updated = [...routines];

      updated[editIndex] = {

        subject,
        time

      };

      setEditIndex(null);

    } else {

      updated = [

        ...routines,

        {
          subject,
          time
        }

      ];

    }

    setRoutines(updated);

    localStorage.setItem(

      "studyRoutines",

      JSON.stringify(updated)

    );

    setSubject("");
    setTime("");

  };

  // =========================
  // DELETE ROUTINE
  // =========================

  const deleteRoutine = (index) => {

    const updated =

      routines.filter(
        (_, i) => i !== index
      );

    setRoutines(updated);

    localStorage.setItem(

      "studyRoutines",

      JSON.stringify(updated)

    );

  };

  // =========================
  // EDIT ROUTINE
  // =========================

  const editRoutine = (index) => {

    const r = routines[index];

    setSubject(r.subject);

    setTime(r.time);

    setEditIndex(index);

  };

  return (

    <div style={container}>

      <h2 style={heading}>
        📅 Study Routine
      </h2>

      {/* INPUT SECTION */}

      <div style={inputBox}>

        <input
          style={input}
          placeholder="Subject"
          value={subject}
          onChange={(e) =>
            setSubject(
              e.target.value
            )
          }
        />

        <input
          style={input}
          type="time"
          value={time}
          onChange={(e) =>
            setTime(
              e.target.value
            )
          }
        />

        <button
          style={addBtn}
          onClick={saveRoutine}
        >

          {
            editIndex !== null
              ? "Update"
              : "Add"
          }

        </button>

      </div>

      {/* ROUTINE CARDS */}

      <div style={grid}>

        {routines.map((r, i) => (

          <div
            key={i}
            style={card}
          >

            <h3>
              {r.subject}
            </h3>

            <p>
              ⏰ {r.time}
            </p>

            <div style={btnGroup}>

              <button
                style={editBtn}
                onClick={() =>
                  editRoutine(i)
                }
              >
                Edit
              </button>

              <button
                style={deleteBtn}
                onClick={() =>
                  deleteRoutine(i)
                }
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}

export default RoutinePage;

// =========================
// STYLES
// =========================

const container = {

  padding: "40px",

  background: "#f1f5f9",

  minHeight: "100vh"

};

const heading = {

  marginBottom: "20px"

};

const inputBox = {

  display: "flex",

  gap: "10px",

  marginBottom: "25px",

  flexWrap: "wrap"

};

const input = {

  padding: "10px",

  borderRadius: "6px",

  border: "1px solid #ccc",

  minWidth: "180px"

};

const addBtn = {

  background: "#2563eb",

  color: "white",

  border: "none",

  padding: "10px 16px",

  borderRadius: "6px",

  cursor: "pointer",

  fontWeight: "bold"

};

const grid = {

  display: "grid",

  gridTemplateColumns:
    "repeat(auto-fill, minmax(220px,1fr))",

  gap: "20px"

};

const card = {

  background: "white",

  padding: "20px",

  borderRadius: "10px",

  boxShadow:
    "0 4px 10px rgba(0,0,0,0.1)",

  textAlign: "center"

};

const btnGroup = {

  display: "flex",

  justifyContent: "center",

  gap: "10px",

  marginTop: "15px"

};

const editBtn = {

  background: "#22c55e",

  color: "white",

  border: "none",

  padding: "6px 12px",

  borderRadius: "5px",

  cursor: "pointer"

};

const deleteBtn = {

  background: "#ef4444",

  color: "white",

  border: "none",

  padding: "6px 12px",

  borderRadius: "5px",

  cursor: "pointer"

};