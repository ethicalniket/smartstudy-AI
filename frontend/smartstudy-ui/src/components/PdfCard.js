import React from "react";
import ReactMarkdown from "react-markdown";

function PdfCard({

  file,
  darkMode,

  deletingFile,
  deleteFile,

  loadingSummary,
  generateSummary,

  loadingAI,
  generateAI,

  loadingAsk,
  askPDF,

  questions,
  setQuestions,

  answers,

  setSelectedFile,
  setQuizOpen

}) {

  return (

    <div
      style={{
        ...card,

        background:
          darkMode
            ? "#1e293b"
            : "white",

        color:
          darkMode
            ? "white"
            : "#0f172a"
      }}
    >

      {/* PDF ICON */}

      <div style={pdfIcon}>
        📄
      </div>

      {/* FILE NAME */}

      <p style={filename}>
        {file.originalFileName}
      </p>

      {/* OPEN + DELETE */}

      <div style={btnGroup}>

        <a
          href={`${file.fileName}?fl_attachment=false`}
          target="_blank"
          rel="noopener noreferrer"
        >

          <button style={openBtn}>
            Open
          </button>

        </a>

        <button
          style={{
            ...deleteBtn,

            opacity:
              deletingFile ===
              file.fileName
                ? 0.7
                : 1
          }}

          disabled={
            deletingFile ===
            file.fileName
          }

          onClick={() =>
            deleteFile(
              file.fileName
            )
          }
        >

          {
            deletingFile ===
            file.fileName

              ? "Deleting..."

              : "Delete"
          }

        </button>

      </div>

      {/* AI BUTTONS */}

      <div style={aiButtonBox}>

        <button
          style={{
            ...aiBtn,

            opacity:
              loadingSummary
                ? 0.7
                : 1
          }}

          disabled={loadingSummary}

          onClick={() =>
            generateSummary(
              file.fileName
            )
          }
        >

          {
            loadingSummary
              ? "Loading..."
              : "Summary"
          }

        </button>

        <button
          style={aiBtn}

          onClick={() => {

            setSelectedFile(
              file.fileName
            );

            setQuizOpen(true);

          }}
        >

          Quiz

        </button>

        <button
          style={{
            ...aiBtn,

            opacity:
              loadingAI
                ? 0.7
                : 1
          }}

          disabled={loadingAI}

          onClick={() =>
            generateAI(
              file.fileName
            )
          }
        >

          {
            loadingAI
              ? "Thinking..."
              : "🤖 AI"
          }

        </button>

      </div>

      {/* ASK AI */}

      <div
        style={{
          marginTop: "15px"
        }}
      >

        <input
          type="text"
          placeholder="Ask from PDF..."

          value={
            questions[
              file.fileName
            ] || ""
          }

          onChange={(e) =>

            setQuestions(prev => ({

              ...prev,

              [file.fileName]:
                e.target.value

            }))

          }

          style={questionInput}
        />

        <button
          style={{
            ...askBtn,

            opacity:
              loadingAsk
                ? 0.7
                : 1
          }}

          disabled={loadingAsk}

          onClick={() =>
            askPDF(
              file
            )
          }
        >

          {
            loadingAsk
              ? "Searching..."
              : "Ask AI"
          }

        </button>

        {/* ANSWER */}

        {answers[file.fileName] && (

          <div
            style={answerBox}
          >

            <h4>
              🤖 AI Answer
            </h4>

            <div
              style={{
                textAlign: "left"
              }}
            >

              <ReactMarkdown>
                {
                  answers[
                    file.fileName
                  ]
                }
              </ReactMarkdown>

            </div>

          </div>

        )}

      </div>

    </div>

  );

}

export default PdfCard;

// ================= STYLES =================

const card = {

  background: "white",

  padding: "18px",

  borderRadius: "24px",

  textAlign: "center",
maxWidth: "420px",
  boxShadow:
    "0 10px 24px rgba(0,0,0,0.05)",

  transition:
    "0.3s ease",

  border:
    "1px solid #e2e8f0"

};

const pdfIcon = {

  width: "72px",

  height: "72px",

  borderRadius: "22px",

  background: "#f3e8ff",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  margin: "0 auto",

  fontSize: "42px"

};

const filename = {

  marginTop: "18px",

  fontWeight: "700",

  wordBreak: "break-word",

  lineHeight: "1.5",

  fontSize: "18px",

  color: "#0f172a"

};

const btnGroup = {

  display: "flex",

  justifyContent: "center",

  gap: "12px",

  marginTop: "18px",

  flexWrap: "wrap"

};

const openBtn = {

  background: "#22c55e",

  color: "white",

  border: "none",

  padding: "10px 18px",

  borderRadius: "12px",

  cursor: "pointer",

  fontWeight: "700",

  fontSize: "14px",

  boxShadow:
    "0 4px 10px rgba(34,197,94,0.25)"

};

const deleteBtn = {

  background: "#ef4444",

  color: "white",

  border: "none",

  padding: "10px 18px",

  borderRadius: "12px",

  cursor: "pointer",

  fontWeight: "700",

  fontSize: "14px",

  boxShadow:
    "0 4px 10px rgba(239,68,68,0.25)"

};

const aiButtonBox = {

  marginTop: "18px",

  display: "flex",

  justifyContent: "center",

  gap: "10px",

  flexWrap: "wrap"

};

const aiBtn = {

  background:
    "linear-gradient(135deg,#7c3aed,#4f46e5)",

  color: "white",

  border: "none",

  padding: "10px 16px",

  borderRadius: "12px",

  cursor: "pointer",

  fontWeight: "700",

  fontSize: "14px",

  boxShadow:
    "0 4px 12px rgba(124,58,237,0.25)"

};

const questionInput = {

  width: "100%",

  padding: "14px 16px",

  borderRadius: "14px",

  border:
    "1px solid #dbeafe",

  marginBottom: "12px",

  marginTop: "18px",

  outline: "none",

  background: "#f8fafc",

  fontSize: "15px",

  boxSizing: "border-box"

};

const askBtn = {

  width: "100%",

  background:
    "linear-gradient(135deg,#0f172a,#1e293b)",

  color: "white",

  border: "none",

  padding: "12px",

  borderRadius: "14px",

  cursor: "pointer",

  fontWeight: "700",

  fontSize: "15px",

  boxShadow:
    "0 6px 14px rgba(15,23,42,0.18)"

};

const answerBox = {

  marginTop: "18px",

  padding: "18px",

  borderRadius: "18px",

  background: "#f8fafc",

  color: "#0f172a",

  textAlign: "left",

  lineHeight: "1.8",

  border:
    "1px solid #e2e8f0"

};