import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import FloatingTimer from "../components/FloatingTimer";
import {
  FaFilePdf,
  FaBookOpen,
  FaChartLine
} from "react-icons/fa";

function DashboardHome() {

  const [pdfCount, setPdfCount] =
    useState(0);

  const [notesCount, setNotesCount] =
    useState(0);

  const [recentFiles, setRecentFiles] =
    useState([]);
    const userName =
      localStorage.getItem("userName");

    const formattedName =
      userName
        ? userName.charAt(0).toUpperCase() +
          userName.slice(1).toLowerCase()
        : "Student";

  useEffect(() => {

    fetchDashboardData();

  }, []);

  const fetchDashboardData = async () => {

    try {

      const res = await axiosInstance.get(

        "dashboard/stats",

        {

          headers: {

            Authorization:
              `Bearer ${localStorage.getItem("token")}`

          }

        }

      );

      setPdfCount(
        res.data.pdfCount || 0
      );

      setNotesCount(
        res.data.notesGenerated || 0
      );

      setRecentFiles(
        res.data.recentFiles || []
      );

    } catch (err) {

      console.log(
        "Dashboard fetch failed"
      );

    }

  };

  // =========================
  // STUDY PROGRESS
  // =========================

  const studyProgress = Math.min(

    pdfCount * 10,

    100

  );

  // =========================
  // RANDOM STUDY TIPS
  // =========================

  const studyTips = [

    "Revise daily for better retention.",

    "Practice active recall while studying.",

    "Take short breaks between study sessions.",

    "Focus on understanding concepts deeply.",

    "Solve quizzes regularly for revision."

  ];

  const randomTip =

    studyTips[
      Math.floor(
        Math.random() *
        studyTips.length
      )
    ];

  return (

    <div style={container}>

      {/* HERO */}

      <div style={heroSection}>

        {/* LEFT */}

        <div style={{ flex: 1 }}>

          <h1 style={heading}>

            Welcome back, {formattedName} 👋

          </h1>

          <p style={subheading}>
            Let's make your study smarter with AI
          </p>

        </div>

        {/* RIGHT */}

        <div style={aiCard}>

          <div style={{ flex: 1 }}>

            <h2 style={aiTitle}>
              Ask AI Anything
            </h2>

            <p style={aiText}>
              Read any book instantly with AI.
              Get answers, insights and more.
            </p>

            <a
              href="https://www.bookai.chat/chat?"
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
            >

              <button style={chatBtn}>
                Read Any Book →
              </button>

            </a>

          </div>

          <div style={robot}>
            🤖
          </div>

        </div>

      </div>

      {/* STATS */}

      <div style={statsGrid}>

        <div style={statCard}>

          <div style={statIconPurple}>
            <FaFilePdf />
          </div>

          <div>

            <h1 style={statNumber}>
              {pdfCount}
            </h1>

            <p style={statText}>
              PDFs Uploaded
            </p>

          </div>

        </div>

        <div style={statCard}>

          <div style={statIconGreen}>
            <FaBookOpen />
          </div>

          <div>

            <h1 style={statNumber}>
              {notesCount}
            </h1>

            <p style={statText}>
              Notes Generated
            </p>

          </div>

        </div>

        <div style={statCard}>

          <div style={statIconBlue}>
            <FaChartLine />
          </div>

          <div>

            <h1 style={statNumber}>
              {studyProgress}%
            </h1>

            <p style={statText}>
              Study Progress
            </p>

          </div>

        </div>

      </div>

      {/* MAIN SECTION */}

      <div style={mainGrid}>

        {/* LEFT SIDE */}

        <div>

          {/* QUICK ACCESS */}

          <div style={sectionCard}>

            <div style={sectionHeader}>

              <div>

                <h2 style={sectionTitle}>
                  Quick Access
                </h2>

                <p style={sectionSub}>
                  Access your study tools
                </p>

              </div>

            </div>

            <div style={quickGrid}>

              {/* INTERVIEW MODE */}

              <Link
                to="/dashboard/interview"
                style={linkStyle}
              >

                <div
                  style={quickCard}
                >

                  <div style={quickIconPurple}>
                    🎤
                  </div>

                  <div>

                    <h3 style={quickTitle}>
                      Interview Mode
                    </h3>

                    <p style={quickText}>
                      AI mock interview from PDFs
                    </p>

                  </div>

                </div>

              </Link>

              {/* STUDY */}

              <Link
                to="/dashboard/upload"
                style={linkStyle}
              >

                <div
                  style={quickCard}
                >

                  <div style={quickIconGreen}>
                    📚
                  </div>

                  <div>

                    <h3 style={quickTitle}>
                      Study
                    </h3>

                    <p style={quickText}>
                      AI notes and quizzes
                    </p>

                  </div>

                </div>

              </Link>

              {/* ROUTINE */}

              <Link
                to="/dashboard/routine"
                style={linkStyle}
              >

                <div
                  style={quickCard}
                >

                  <div style={quickIconOrange}>
                    ⏰
                  </div>

                  <div>

                    <h3 style={quickTitle}>
                      Routine
                    </h3>

                    <p style={quickText}>
                      Plan study schedule
                    </p>

                  </div>

                </div>

              </Link>

            </div>

          </div>

          {/* STUDY TIP */}

          <div style={tipCard}>

            <div style={tipRow}>

              <div style={tipEmoji}>
                ✨
              </div>

              <div>

                <h3 style={tipTitle}>
                  AI Study Tip
                </h3>

                <p style={tipText}>
                  {randomTip}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div>

          {/* RECENT ACTIVITY */}

          <div style={activityCard}>

            <div style={activityHeader}>

              <h2 style={sectionTitle}>
                Recent Activity
              </h2>

              <div style={activityBadge}>
                {recentFiles.length}
              </div>

            </div>

            {

              recentFiles.length === 0 ? (

                <p style={emptyText}>
                  No recent uploads
                </p>

              ) : (

                recentFiles.map(
                  (file, index) => (

                    <div
                      key={index}
                      style={activityItem}
                    >

                      <div style={activityIcon}>
                        📄
                      </div>

                      <div>

                        <h4 style={fileName}>
                          {
                            file.originalFileName
                          }
                        </h4>

                        <p style={fileText}>
                          {
                            file.subject ||
                            "General"
                          }
                        </p>

                      </div>

                    </div>

                  )
                )

              )

            }

          </div>

          {/* STREAK */}

          <div style={streakCard}>

            <div>

              <p style={streakMini}>
                Study Streak
              </p>

              <h1 style={streakBig}>
                {pdfCount}
              </h1>

              <p style={streakText}>
                Active Study Days
              </p>

            </div>

            <div style={fireIcon}>
              🔥
            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

// ================= STYLES =================

const container = {

  padding: "20px",

  width: "100%",

  maxWidth: "1400px",

  margin: "0 auto",

  boxSizing: "border-box"

};

const heroSection = {

  display: "flex",

  justifyContent: "space-between",

  alignItems: "stretch",

  gap: "24px",

  flexWrap: "wrap",

  marginBottom: "30px"

};

const heading = {

  fontSize:
    "clamp(32px,5vw,58px)",

  fontWeight: "800",

  color: "#0f172a",

  marginBottom: "10px",

  lineHeight: "1.1",

  wordBreak: "break-word"

};

const subheading = {

  fontSize:
    "clamp(16px,2vw,20px)",

  color: "#64748b"

};

const aiCard = {

  flex: "1",

  minWidth: "280px",

  width: "100%",

  background:
    "linear-gradient(135deg,#4f46e5,#7c3aed)",

  color: "white",

  borderRadius: "28px",

  padding: "24px",

  display: "flex",

  justifyContent: "space-between",

  alignItems: "center",

  gap: "20px",

  flexWrap: "wrap",

  overflow: "hidden",

  boxShadow:
    "0 12px 30px rgba(99,102,241,0.35)"

};

const aiTitle = {

  fontSize:
    "clamp(28px,5vw,36px)",

  fontWeight: "800",

  marginBottom: "12px"

};

const aiText = {

  lineHeight: "1.7",

  opacity: 0.95

};

const robot = {

  fontSize: "clamp(48px,10vw,82px)",

  flexShrink: 0

};

const chatBtn = {

  marginTop: "18px",

  background: "white",

  color: "#4f46e5",

  border: "none",

  padding: "14px 22px",

  borderRadius: "12px",

  fontWeight: "700",

  cursor: "pointer",

  fontSize: "15px"

};

const statsGrid = {

  display: "grid",

  gridTemplateColumns:
    "repeat(auto-fit,minmax(240px,1fr))",

  gap: "20px"

};

const statCard = {

  background: "white",

  borderRadius: "24px",

  padding: "24px",

  display: "flex",

  alignItems: "center",

  gap: "20px",

  border: "1px solid #e2e8f0",

  boxShadow:
    "0 10px 24px rgba(0,0,0,0.04)"

};

const statIconBase = {

  width: "78px",

  height: "78px",

  borderRadius: "20px",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  fontSize: "30px"

};

const statIconPurple = {

  ...statIconBase,

  background: "#ede9fe",

  color: "#7c3aed"

};

const statIconGreen = {

  ...statIconBase,

  background: "#dcfce7",

  color: "#16a34a"

};

const statIconBlue = {

  ...statIconBase,

  background: "#dbeafe",

  color: "#2563eb"

};

const statNumber = {

  fontSize:
    "clamp(36px,5vw,44px)",

  fontWeight: "800",

  color: "#0f172a",

  margin: 0

};

const statText = {

  color: "#64748b",

  marginTop: "6px",

  fontSize: "16px"

};

const mainGrid = {

  display: "grid",

  gridTemplateColumns:
    "repeat(auto-fit,minmax(320px,1fr))",

  gap: "24px",

  marginTop: "28px",

  alignItems: "start"

};

const sectionCard = {

  background: "white",

  borderRadius: "28px",

  padding: "28px",

  border: "1px solid #e2e8f0",

  boxShadow:
    "0 10px 24px rgba(0,0,0,0.04)"

};

const sectionHeader = {

  marginBottom: "24px"

};

const sectionTitle = {

  fontSize:
    "clamp(24px,4vw,30px)",

  fontWeight: "800",

  color: "#0f172a"

};

const sectionSub = {

  color: "#64748b",

  marginTop: "6px"

};

const quickGrid = {

  display: "grid",

  gridTemplateColumns:
    "repeat(auto-fit,minmax(240px,1fr))",

  gap: "16px"

};

const quickCard = {

  display: "flex",

  alignItems: "center",

  gap: "18px",

  background: "#f8fafc",

  border: "1px solid #e2e8f0",

  borderRadius: "20px",

  padding: "22px",

  transition: "0.3s ease",

  flexWrap: "wrap",

  cursor: "pointer",

  minHeight: "140px"

};

const quickIconBase = {

  width: "72px",

  height: "72px",

  borderRadius: "18px",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  fontSize: "34px"

};

const quickIconPurple = {

  ...quickIconBase,

  background: "#ede9fe"

};

const quickIconGreen = {

  ...quickIconBase,

  background: "#dcfce7"

};

const quickIconOrange = {

  ...quickIconBase,

  background: "#ffedd5"

};

const quickTitle = {

  fontSize:
    "clamp(20px,3vw,24px)",

  fontWeight: "800",

  color: "#0f172a"

};

const quickText = {

  color: "#64748b",

  marginTop: "5px"

};

const tipCard = {

  marginTop: "22px",

  background:
    "linear-gradient(135deg,#0f172a,#1e293b)",

  color: "white",

  borderRadius: "28px",

  padding: "26px"

};

const tipRow = {

  display: "flex",

  alignItems: "center",

  gap: "18px",

  flexWrap: "wrap"

};

const tipEmoji = {

  fontSize: "48px"

};

const tipTitle = {

  fontSize:
    "clamp(22px,4vw,26px)",

  fontWeight: "800"

};

const tipText = {

  marginTop: "8px",

  opacity: 0.9,

  lineHeight: "1.7"

};

const activityCard = {

  background: "white",

  borderRadius: "28px",

  padding: "28px",

  border: "1px solid #e2e8f0",

  boxShadow:
    "0 10px 24px rgba(0,0,0,0.04)"

};

const activityHeader = {

  display: "flex",

  justifyContent: "space-between",

  alignItems: "center",

  marginBottom: "22px",

  gap: "10px",

  flexWrap: "wrap"

};

const activityBadge = {

  background: "#ede9fe",

  color: "#7c3aed",

  padding: "7px 14px",

  borderRadius: "999px",

  fontWeight: "700"

};

const activityItem = {

  display: "flex",

  gap: "14px",

  alignItems: "center",

  marginBottom: "18px",

  flexWrap: "wrap"

};

const activityIcon = {

  width: "58px",

  height: "58px",

  borderRadius: "16px",

  background: "#f3f4f6",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  fontSize: "24px",

  flexShrink: 0

};

const fileName = {

  fontSize: "17px",

  fontWeight: "700",

  color: "#0f172a",

  wordBreak: "break-word"

};

const fileText = {

  color: "#64748b",

  marginTop: "4px"

};

const streakCard = {

  marginTop: "22px",

  background:
    "linear-gradient(135deg,#7c3aed,#4f46e5)",

  color: "white",

  borderRadius: "28px",

  padding: "30px",

  display: "flex",

  justifyContent: "space-between",

  alignItems: "center",

  flexWrap: "wrap",

  gap: "20px",

  boxShadow:
    "0 12px 30px rgba(99,102,241,0.35)"

};

const streakMini = {

  opacity: 0.9,

  fontSize: "15px"

};

const streakBig = {

  fontSize:
    "clamp(48px,6vw,72px)",

  fontWeight: "800",

  margin: "4px 0"

};

const streakText = {

  opacity: 0.95

};

const fireIcon = {

  fontSize: "clamp(48px,10vw,82px)"

};

const emptyText = {

  color: "#64748b"
};

const linkStyle = {

  textDecoration: "none"

};

export default DashboardHome;