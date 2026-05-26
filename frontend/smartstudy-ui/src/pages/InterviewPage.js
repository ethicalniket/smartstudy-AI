import React, {
  useEffect,
  useState
} from "react";
import ReactMarkdown
  from "react-markdown";

import axios from "axios";

import {
  getToken
} from "../services/authService";

const API =
  process.env.REACT_APP_API;

const InterviewPage = () => {

  const [files, setFiles] =
    useState([]);

  const [loading,
    setLoading] =
    useState(false);

  const [showDropdown,
    setShowDropdown] =
    useState(false);

  const [selectedFiles,
    setSelectedFiles] =
    useState([]);

 const [questions,
   setQuestions] =
   useState([]);

 const [currentIndex,
   setCurrentIndex] =
   useState(0);

 const [answer,
   setAnswer] =
   useState("");

 const [feedback,
   setFeedback] =
   useState("");

 const [interviewFinished,
   setInterviewFinished] =
   useState(false);

 const [rating,
   setRating] =
   useState(0);

   const [questionLimit,
     setQuestionLimit] =
     useState(5);
     const [readyForNext,
       setReadyForNext] =
       useState(false);

       const [feedbackType,
         setFeedbackType] =
         useState("");

         const [totalScore,
           setTotalScore] =
           useState(0);

         const [totalAnswered,
           setTotalAnswered] =
           useState(0);

  // ================= LOAD FILES =================

  useEffect(() => {

    fetchFiles();
    console.log(getToken());

  }, []);

  const fetchFiles = async () => {

    try {

      const res =
        await axios.get(

          `${API}/upload/files`,

          {
            headers: {
              Authorization:
                `Bearer ${getToken()}`
            }
          }

        );

      console.log(res.data);


      setFiles(res.data);

    } catch (e) {

      console.log(e);

    }

  };

  // ================= START INTERVIEW =================

  const startInterview =
    async () => {

      if (
        selectedFiles.length === 0
      ) {

        alert(
          "Select at least one PDF"
        );

        return;

      }

      try {

        setLoading(true);

        const res =
          await axios.post(

            `${API}/upload/interview/start`,

            {
              fileNames:
                selectedFiles,

              questionLimit:
                questionLimit
            },

            {
              headers: {
                Authorization:
                  `Bearer ${getToken()}`
              }
            }

          );

        setQuestions(
          res.data.questions
        );

      } catch (e) {

        console.log(e);

        alert(
          "Interview start failed"
        );

      } finally {

        setLoading(false);

      }

        };

const nextQuestion = async () => {

  if (!answer.trim()) {

    setFeedback(
      "Write answer first."
    );

    return;

  }

  try {

    setLoading(true);

    const res =
      await axios.post(

        `${API}/upload/interview/next`,

        {

          currentQuestion:
            questions[currentIndex],

          answer,

          skipped: false

        },

        {
          headers: {
            Authorization:
              `Bearer ${getToken()}`
          }
        }

      );

    setFeedback(
      res.data.feedback
    );

    setFeedbackType(
      "evaluation"
    );

    setTotalScore(
      prev =>
        prev + res.data.score
    );

    setTotalAnswered(
      prev => prev + 1
    );

    setReadyForNext(true);

  } catch (e) {

    console.log(e);

  } finally {

    setLoading(false);

  }

};

const skipQuestion = async () => {

  try {

    setLoading(true);

    const res =
      await axios.post(

        `${API}/upload/interview/next`,

        {

          currentQuestion:
            questions[currentIndex],

          answer: "",

          skipped: true

        },

        {
          headers: {
            Authorization:
              `Bearer ${getToken()}`
          }
        }

      );

    setFeedback(
      res.data.feedback
    );

    setFeedbackType(
      "explanation"
    );

    setReadyForNext(true);

  } catch (e) {

    console.log(e);

  } finally {

    setLoading(false);

  }

};
    const finishInterview = () => {

      let calculatedRating = 0;

      if (
        totalAnswered > 0
      ) {

        calculatedRating = (

          totalScore /
          totalAnswered

        ).toFixed(1);

      }

      setRating(
        calculatedRating
      );

      setInterviewFinished(true);

    };

      return (

        <div
      style={{
        padding: "40px",
        minHeight: "100vh",
        background: "#f1f5f9"
      }}
    >

      {/* HEADER */}

      <div
        style={{
          marginBottom: "35px"
        }}
      >

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px"
          }}
        >

          <div>

            <h1
              style={{
                fontSize: "42px",
                fontWeight: "800",
                color: "#0f172a",
                marginBottom: "10px"
              }}
            >
              🎤 AI Interview Mode
            </h1>

            <p
              style={{
                fontSize: "18px",
                color: "#64748b"
              }}
            >
              Practice AI-generated interview questions
              from your uploaded PDFs.
            </p>

          </div>

          {/* STATS */}

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap"
            }}
          >

            <div style={pill}>
              🤖 AI Powered
            </div>

            <div style={pill}>
              📚 Mixed Topics
            </div>

            <div style={pill}>
              🎯 Mock Interview
            </div>

          </div>

        </div>

      </div>

      {/* MAIN CARD */}

      <div
        style={{
          background: "white",
          borderRadius: "28px",
          padding: "35px",
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.06)"
        }}
      >

        {/* PDF SELECT */}

        <div
          style={{
            marginBottom: "30px",
            position: "relative"
          }}
        >

          <label
            style={{
              display: "block",
              marginBottom: "12px",
              fontWeight: "700",
              color: "#0f172a",
              fontSize: "18px"
            }}
          >
            Select PDFs
          </label>

          {/* DROPDOWN BUTTON */}

          <div

            onClick={() =>
              setShowDropdown(
                !showDropdown
              )
            }

            style={{

              background: "#f8fafc",

              border:
                "1px solid #dbeafe",

              borderRadius: "16px",

              padding: "16px 18px",

              cursor: "pointer",

              display: "flex",

              justifyContent:
                "space-between",

              alignItems: "center",

              fontWeight: "600",

              color: "#0f172a"
            }}
          >

            <span>

              {
                selectedFiles.length === 0

                  ? "Choose PDFs"

                  : `${selectedFiles.length} PDF selected`
              }

            </span>

            <span>
              ▼
            </span>

          </div>

          {/* DROPDOWN */}

          {

            showDropdown && (

              <div
                style={{

                  position: "absolute",

                  top: "100%",

                  left: 0,

                  right: 0,

                  marginTop: "10px",

                  background: "white",

                  borderRadius: "18px",

                  padding: "16px",

                  boxShadow:
                    "0 10px 30px rgba(0,0,0,0.1)",

                  zIndex: 100
                }}
              >

                {/* SELECT ALL */}

                <label
                  style={dropdownItem}
                >

                  <input

                    type="checkbox"

                    checked={
                      selectedFiles.includes(
                        "ALL"
                      )
                    }

                    onChange={() => {

                      if (

                        selectedFiles.includes(
                          "ALL"
                        )

                      ) {

                        setSelectedFiles([]);

                      } else {

                        setSelectedFiles([
                          "ALL"
                        ]);

                      }

                    }}
                  />

                  Select All PDFs

                </label>

                {/* PDFS */}

                {

                  files.map(file => (

                    <label

                      key={file.id}

                      style={dropdownItem}
                    >

                      <input

                        type="checkbox"

                        checked={
                          selectedFiles.includes(
                            file.fileName
                          )
                        }

                        onChange={() => {

                          if (

                            selectedFiles.includes(
                              file.fileName
                            )

                          ) {

                            setSelectedFiles(

                              selectedFiles.filter(
                                f =>
                                  f !==
                                  file.fileName
                              )

                            );

                          } else {

                            setSelectedFiles([

                              ...selectedFiles.filter(
                                f => f !== "ALL"
                              ),

                              file.fileName

                            ]);

                          }

                        }}
                      />

                      {
                        file.originalFileName
                      }

                    </label>

                  ))

                }

              </div>

            )

          }

        </div>

        {/* EMPTY TEXT */}

        {
          selectedFiles.length === 0 && (

            <div
              style={{
                textAlign: "center",
                marginBottom: "28px",
                color: "#64748b",
                fontSize: "16px"
              }}
            >
              Choose study material
              for AI interview practice.
            </div>

          )
        }

<input

  type="number"

  min="1"

  max="20"

  value={questionLimit}

  onChange={(e) =>
    setQuestionLimit(
      e.target.value
    )
  }

  style={{

    width: "120px",

    padding: "14px",

    borderRadius: "12px",

    border:
      "1px solid #cbd5e1",

    marginBottom: "20px",

    fontSize: "16px"

  }}

/>
        {/* BUTTON */}

        <button

          onClick={
            startInterview
          }

          style={{
            width: "100%",
            padding: "18px",
            border: "none",
            borderRadius: "18px",
            background:
              "linear-gradient(135deg,#4f46e5,#7c3aed)",
            color: "white",
            fontSize: "18px",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow:
              "0 8px 20px rgba(79,70,229,0.3)"
          }}
        >

          {
            loading
              ? "Starting Interview..."
              : "🚀 Start AI Interview"
          }

        </button>

      </div>

      {/* INTERVIEW */}

      {

        questions.length > 0 &&

        !interviewFinished && (

          <div
            style={{
              marginTop: "40px"
            }}
          >

            <div
              style={{
                background: "white",
                borderRadius: "24px",
                padding: "30px",
                boxShadow:
                  "0 10px 25px rgba(0,0,0,0.06)"
              }}
            >

              {/* QUESTION COUNT */}

              <div
                style={{
                  marginBottom: "18px",
                  color: "#4f46e5",
                  fontWeight: "700",
                  fontSize: "15px"
                }}
              >

                Question {currentIndex + 1}

              </div>

              {/* QUESTION */}

              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#0f172a",
                  lineHeight: "1.6",
                  marginBottom: "24px"
                }}
              >

                {
                  questions[currentIndex]
                }

              </div>

              {/* ANSWER BOX */}

              <textarea

                value={answer}

                onChange={(e) =>
                  setAnswer(
                    e.target.value
                  )
                }

                placeholder=
                  "Write your answer here..."

                style={{

                  width: "100%",

                  minHeight: "180px",

                  borderRadius: "18px",

                  border:
                    "1px solid #cbd5e1",

                  padding: "18px",

                  fontSize: "16px",

                  outline: "none",

                  resize: "vertical",

                  marginBottom: "24px"
                }}
              />

              {/* BUTTONS */}

              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  flexWrap: "wrap"
                }}
              >

                {/* NEXT */}

                <button

                  onClick={
                    nextQuestion
                  }

                  style={primaryBtn}
                >

                  Next Question

                </button>

                {/* SKIP */}

                <button

                  onClick={
                    skipQuestion
                  }

                  style={secondaryBtn}
                >

                  Skip

                </button>

                {/* FINISH */}

                <button

                  onClick={
                    finishInterview
                  }

                  style={dangerBtn}
                >

                  Finish Interview

                </button>
                {

                  readyForNext && (

                    <button

                      onClick={() => {

                        setCurrentIndex(
                          prev => prev + 1
                        );

                        setAnswer("");

                        setFeedback("");

                        setReadyForNext(false);

                      }}

                      style={primaryBtn}

                    >

                      Continue

                    </button>

                  )

                }

              </div>

              {/* FEEDBACK */}

              {

                feedback && (

                  <div
                    style={{
                      marginTop: "28px",
                      background: "#eff6ff",
                      borderRadius: "18px",
                      padding: "22px"
                    }}
                  >

                    <h3
                      style={{
                        color: "#1d4ed8",
                        marginBottom: "10px"
                      }}
                    >
                     {

                       feedbackType ===
                       "evaluation"

                       ?

                       "Answer Evaluation"

                       :

                       "Concept Explanation"

                     }
                    </h3>

                    <div
                      style={{
                        lineHeight: "1.8",
                        fontSize: "16px"
                      }}
                    >

                      <ReactMarkdown>

                        {feedback}

                      </ReactMarkdown>

                    </div>
                  </div>

                )

              }

            </div>

          </div>

      )

      }

      {/* FINAL REPORT */}

      {

        interviewFinished && (

          <div
            style={{
              marginTop: "40px"
            }}
          >

            <div
              style={{
                background: "white",
                borderRadius: "24px",
                padding: "40px",
                textAlign: "center",
                boxShadow:
                  "0 10px 25px rgba(0,0,0,0.06)"
              }}
            >

              <h1
                style={{
                  fontSize: "42px",
                  marginBottom: "18px"
                }}
              >
                🎉 Interview Finished
              </h1>

              <div
                style={{
                  fontSize: "72px",
                  fontWeight: "800",
                  color: "#4f46e5",
                  marginBottom: "20px"
                }}
              >
                {rating}/10
              </div>

              <p
                style={{
                  fontSize: "18px",
                  color: "#475569",
                  lineHeight: "1.8",
                  maxWidth: "700px",
                  margin: "0 auto"
                }}
              >

                You completed the AI interview session.

                Your rating is based on:

                answered questions,
                skipped questions,
                and interview progress.

              </p>

            </div>

          </div>

        )

      }

    </div>

  );

};

// ================= STYLES =================

const pill = {

  background: "white",

  padding: "10px 16px",

  borderRadius: "999px",

  fontWeight: "700",

  color: "#4f46e5",

  boxShadow:
    "0 4px 12px rgba(0,0,0,0.05)",

  border:
    "1px solid #e2e8f0"

};

const dropdownItem = {

  display: "flex",

  alignItems: "center",

  gap: "12px",

  padding: "12px",

  borderRadius: "12px",

  cursor: "pointer",

  marginBottom: "8px",

  color: "#0f172a",

  fontWeight: "500",

  background: "#f8fafc"

};
const primaryBtn = {

  background:
    "linear-gradient(135deg,#4f46e5,#7c3aed)",

  color: "white",

  border: "none",

  padding: "14px 24px",

  borderRadius: "14px",

  cursor: "pointer",

  fontWeight: "700",

  fontSize: "15px"

};

const secondaryBtn = {

  background: "#e2e8f0",

  color: "#0f172a",

  border: "none",

  padding: "14px 24px",

  borderRadius: "14px",

  cursor: "pointer",

  fontWeight: "700",

  fontSize: "15px"

};

const dangerBtn = {

  background: "#ef4444",

  color: "white",

  border: "none",

  padding: "14px 24px",

  borderRadius: "14px",

  cursor: "pointer",

  fontWeight: "700",

  fontSize: "15px"

};
export default InterviewPage;