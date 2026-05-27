import { useEffect, useState } from "react";
import PdfCard from "../components/PdfCard";
import PdfViewerModal from "../components/PdfViewerModal";
import API
from "../config/api";
import api from "../api/axiosConfig";
import ReactMarkdown from "react-markdown";
import {
  ToastContainer,
  toast
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

function UploadPage() {

  // ================= STATES =================
const [viewerOpen, setViewerOpen] =
  useState(false);

const [viewerFile, setViewerFile] =
  useState("");

const [timeLeft, setTimeLeft] =
  useState(30);

const [timerActive, setTimerActive] =
  useState(false);

const [showResult, setShowResult] =
  useState(false);
const [darkMode] =
  useState(

    localStorage.getItem(
      "darkMode"
    ) === "true"

  );
  const [loadingSummary, setLoadingSummary] =
  useState(false);

const [loadingQuiz, setLoadingQuiz] =
  useState(false);
  const [file, setFile] =
    useState(null);

  const [files, setFiles] =
    useState([]);
    const [questionCount, setQuestionCount] =
      useState(5);

  const [search, setSearch] =
    useState("");

  const [subject, setSubject] =
    useState("");

  const [summary, setSummary] =
    useState("");

  const [aiResult, setAiResult] =
    useState("");

  const [loadingAI, setLoadingAI] =
    useState(false);
const [deletingFile, setDeletingFile] =
  useState("");

const [uploading, setUploading] =
  useState(false);
  // QUIZ

  const [quizOpen, setQuizOpen] =
    useState(false);

  const [quizData, setQuizData] =
    useState("");
    const [currentQuestion, setCurrentQuestion] =
      useState(0);

    const [selectedAnswer, setSelectedAnswer] =
      useState("");

    const [score, setScore] =
      useState(0);

    const [quizFinished, setQuizFinished] =
      useState(false);
    const [quizType, setQuizType] =
      useState("");

    const [selectedFile, setSelectedFile] =
      useState("");

  // ASK AI

  const [questions, setQuestions] =
    useState({});
  const [answers, setAnswers] =
    useState({});

  const [loadingAsk, setLoadingAsk] =
    useState(false);


  const getToken = () =>
    localStorage.getItem("token");

  // ================= FETCH FILES =================

  const fetchFiles = async () => {

    try {

      const res = await api.get(
       `${API}/upload/files`,
        {
          headers: {
            Authorization:
              `Bearer ${getToken()}`
          }
        }
      );

      setFiles(res.data);

    } catch {

      toast.error(
        "Failed to fetch PDFs"
      );

    }

  };

  useEffect(() => {

    fetchFiles();
// eslint-disable-next-line
  }, []);
  useEffect(() => {

    let timer;

    if (
      timerActive &&
      timeLeft > 0 &&
      !quizFinished
    ) {

      timer = setTimeout(() => {

        setTimeLeft(
          prev => prev - 1
        );

      }, 1000);

    }

    // AUTO NEXT WHEN TIME ENDS

    else if (
      timeLeft === 0 &&
      !quizFinished
    ) {

      setSelectedAnswer("");

      setShowResult(false);

      if (
        currentQuestion + 1 <
        quizData.length
      ) {

        setCurrentQuestion(
          prev => prev + 1
        );

        setTimeLeft(30);

      } else {

        setQuizFinished(true);

      }

    }

    return () =>
      clearTimeout(timer);

  }, [

    timerActive,
    timeLeft,
    quizFinished,
    currentQuestion,
    quizData.length

  ]);
  useEffect(() => {

    localStorage.setItem(
      "darkMode",
      darkMode
    );

  }, [darkMode]);

  // ================= UPLOAD =================

  const handleUpload = async () => {

    if (!file || !subject.trim()) {

      toast.warning(
        "Enter subject and select PDF"
      );

      return;

    }
// PDF VALIDATION

if (
  file &&
  file.type !==
    "application/pdf"
) {

  toast.error(
    "Only PDF files allowed"
  );

  return;

}

// FILE SIZE VALIDATION

if (
  file &&
  file.size >
    10 * 1024 * 1024
) {

  toast.error(
    "File must be under 10MB"
  );

  return;

}

    const formData =
      new FormData();

    formData.append("file", file);

    formData.append("subject", subject);

    try {

      // START LOADING

      setUploading(true);

      await api.post(
        `${API}/upload`,
        formData,
        {
          headers: {
            Authorization:
              `Bearer ${getToken()}`
          }
        }
      );

      toast.success(
        "PDF uploaded successfully"
      );

      setFile(null);

      setSubject("");

      fetchFiles();

    } catch (e) {

      console.log(e);

      toast.error(

        e.response?.data ||

        "Upload failed"

      );



    } finally {

      // STOP LOADING

      setUploading(false);

    }

  };
  // ================= DELETE =================

  const deleteFile = async (
    filename
  ) => {

    try {

      setDeletingFile(
        filename
      );

await api.delete(

  `${API}/upload/files`,

  {

    headers: {
      Authorization:
        `Bearer ${getToken()}`
    },

    data: {
      fileUrl: filename
    }

  }

);
      toast.success(
        "PDF deleted"
      );

      await fetchFiles();

    } catch {

      toast.error(
        "Delete failed"
      );

    } finally {

      setDeletingFile("");

    }

  };
  // ================= SUMMARY =================

  const generateSummary =
    async (filename) => {

      try {

        setLoadingSummary(true);

       const res = await api.post(

         `${API}/upload/summary`,

         {
           fileUrl: filename
         },

         {
           headers: {
             Authorization:
               `Bearer ${getToken()}`
           }
         }

       );
if (!res.data.summary) {

  toast.error(
    "Summary not generated"
  );

  return;

}
        setSummary(
          res.data.summary
        );

        setAiResult("");

        setQuizOpen(false);

     } catch (e) {

       console.log(e);

       toast.error(

         e.response?.data ||

         "Summary failed"

       );


      } finally {

        setLoadingSummary(false);

      }

    };


  // ================= QUIZ =================

  const generateQuestions =
    async () => {

      if (!quizType) {

        toast.warning(
          "Select quiz type"
        );

        return;

      }

      try {

        setLoadingQuiz(true);

        const res = await api.post(

          `${API}/upload/questions`,

          {
            fileName: selectedFile,
            type: quizType,
            count: questionCount
          },

          {
            headers: {
              Authorization:
                `Bearer ${getToken()}`
            }
          }

        );
        if (!res.data.questions) {

          toast.error(
            "No quiz generated"
          );

          return;

        }

        // ================= MCQ =================

       if (quizType === "mcq") {

         const parsedQuiz =

           JSON.parse(
             res.data.questions
           );

         const shuffledQuiz =

           parsedQuiz

             .map((question) => ({

               ...question,

               options:

                 [...question.options]

                   .sort(
                     () => Math.random() - 0.5
                   )

             }))

             .sort(
               () => Math.random() - 0.5
             );

         setQuizData(
           shuffledQuiz
         );

       }
        // ================= SUBJECTIVE =================

        else {

          setQuizData(
            res.data.questions
          );

        }

        // ================= RESET =================

        setCurrentQuestion(0);

        setSelectedAnswer("");

        setScore(0);

        setQuizFinished(false);

        // ================= OPEN MODAL =================

        setQuizOpen(true);

        setSummary("");

        setAiResult("");
        setTimeLeft(30);

        setTimerActive(true);

     } catch (e) {

       console.log(e);

       toast.error(

         e.response?.data ||

         "Quiz generation failed"

       );



      } finally {

        setLoadingQuiz(false);

      }

  };
  // ================= AI =================

  const generateAI = async (
    filename
  ) => {

    try {

      setLoadingAI(true);

      setAiResult("");

      setSummary("");

      setQuizOpen(false);

      const res = await api.post(

        `${API}/upload/process`,

        {
          fileUrl: filename
        },

        {
          headers: {
            Authorization:
              `Bearer ${getToken()}`
          }
        }

      );

      setAiResult(
        res.data.message
      );

    } catch {

      toast.error(
        "AI generation failed"
      );

    } finally {

      setLoadingAI(false);

    }

  };

  // ================= ASK PDF =================

 const askPDF = async (file) => {

   console.log(file);

   const currentQuestion =
     questions[file.fileName] || "";

   if (!currentQuestion.trim()) {

     toast.warning(
       "Enter your question"
     );

     return;

   }

   try {

     setLoadingAsk(true);

     setSummary("");

     setAiResult("");

     const res = await api.post(

       `${API}/upload/ask`,

       {
         question: currentQuestion,
         fileName: file.fileName
       },

       {
         headers: {
           Authorization:
             `Bearer ${getToken()}`
         }
       }

     );

     if (!res.data.answer) {

       toast.error(
         "No answer found"
       );

       return;

     }

     setAnswers(prev => ({

       ...prev,

       [file.fileName]:
         res.data.answer

     }));

   } catch (e) {

     console.log(e);

     toast.error(

       e.response?.data?.error ||

       "Ask AI failed"

     );

   } finally {

     setLoadingAsk(false);

   }

 };
  // ================= GROUP FILES =================

  const groupedFiles =
    files.reduce((acc, file) => {

      const subject =(
        file.subject || "General"
        ).toUpperCase();

      if (!acc[subject]) {

        acc[subject] = [];

      }

      acc[subject].push(file);

      return acc;

    }, {});

  // ================= UI =================

  return (

   <div
     style={{
       ...container,

       background:
         darkMode
           ? "#0f172a"
           : "#f1f5f9",

       color:
         darkMode
           ? "white"
           : "#0f172a"
     }}
   >
      {/* HEADER */}

      <div style={header}>

        <div>

          <h1 style={title}>
            Study PDFs
          </h1>

          <p style={subtitle}>
            AI-powered study assistant
            for PDFs
          </p>

        </div>

      </div>

      {/* UPLOAD */}

      <div style={uploadSection}>

        <input
          type="text"
          placeholder="Enter Subject"
          value={subject}
          onChange={(e) =>
            setSubject(
              e.target.value
            )
          }
          style={input}
        />

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) =>
            setFile(
              e.target.files[0]
            )
          }
        />

        <button
          style={uploadBtn}
          onClick={handleUpload}
          disabled={uploading}
        >
          {
            uploading
              ? "Uploading..."
              : "Upload PDF"
          }
        </button>

      </div>

      {/* SEARCH */}

      <div style={searchRow}>

        <input
          type="text"
          placeholder="🔍 Search PDFs..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={searchBar}
        />

        <div style={miniStat}>
          📄 {files.length} PDFs
        </div>

        <div style={miniStat}>
          📚 {
            Object.keys(groupedFiles)
              .length
          } Subjects
        </div>

      </div>


      {/* EMPTY */}

      {files.length === 0 ? (

        <div style={emptyBox}>

         <h2>
           📂 No PDFs Uploaded Yet
         </h2>

         <p>
           Upload your study PDFs
           to unlock AI summaries,
           quizzes, smart search
           and AI question answering.
         </p>

         <button
           style={uploadBtn}
         >
           Upload Your First PDF
         </button>

        </div>

      ) : (

        Object.entries(
          groupedFiles
        ).map(
          (
            [
              subjectName,
              subjectFiles
            ],
            index
          ) => (

            <div
              key={index}
              style={subjectSection}
            >

              <h2
                style={
                  subjectHeading
                }
              >
                📚 {subjectName}
              </h2>

              <div style={grid}>

                {subjectFiles
                  .filter(file =>
                    file.originalFileName
                      .toLowerCase()
                      .includes(
                        search.toLowerCase()
                      )
                  )
                  .map((file, i) => (

                    <PdfCard
                      key={i}

                      file={file}
                      darkMode={darkMode}

                      deletingFile={deletingFile}
                      deleteFile={deleteFile}

                      loadingSummary={loadingSummary}
                      generateSummary={generateSummary}

                      loadingAI={loadingAI}
                      generateAI={generateAI}

                      loadingAsk={loadingAsk}
                      askPDF={askPDF}

                      questions={questions}
                      setQuestions={setQuestions}

                      answers={answers}

                      setSelectedFile={setSelectedFile}
                      setQuizOpen={setQuizOpen}

                     API={API}

                     setViewerOpen={setViewerOpen}
                     setViewerFile={setViewerFile}
                     />
                  ))}

              </div>

            </div>

          )
        )

      )}

      {/* SUMMARY */}

      {summary && (

       <div
         style={{
           ...resultBox,

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
          <h3>
            🧠 AI Summary
          </h3>

         <ReactMarkdown>
           {summary}
         </ReactMarkdown>
        </div>

      )}

      {/* AI */}

      {loadingAI && (

        <p style={loadingText}>
          ⏳ Generating AI...
        </p>

      )}

      {aiResult &&
        !loadingAI && (

          <div
            style={resultBox}
          >

            <h3>
              🤖 AI Output
            </h3>

           <div
             style={{
               textAlign: "left"
             }}
           >

             <ReactMarkdown>
               {aiResult}
             </ReactMarkdown>

           </div>

          </div>

        )}

      {/* ASK RESULT */}

      {loadingAsk && (

        <p style={loadingText}>
          ⏳ Searching PDF...
        </p>

      )}



      {/* QUIZ MODAL */}

      {quizOpen && (

        <div
          style={modalOverlay}
        >

          <div style={quizModal}>

            <div
              style={quizHeader}
            >

              <h2>
                🧠 AI Quiz
              </h2>

              <button
                style={closeBtn}
                onClick={() =>
                  setQuizOpen(
                    false
                  )
                }
              >
                ✖
              </button>

            </div>

            <div style={quizContent}>

             {/* TYPE SELECT */}

             <select
               value={quizType}
               onChange={(e) =>
                 setQuizType(
                   e.target.value
                 )
               }
               style={quizSelect}
             >

               <option value="">
                 Select Quiz Type
               </option>

               <option value="mcq">
                 Objective MCQ
               </option>

               <option value="subjective">
                 Subjective Questions
               </option>

               <option value="viva">
                 Viva Questions
               </option>

             </select>

             <input
               type="number"
               min="1"
               max="20"
               value={questionCount}
               onChange={(e) =>
                 setQuestionCount(
                   e.target.value
                 )
               }
               placeholder="Number of Questions"
               style={questionCountInput}
             />

             <button
               style={generateBtn}

               disabled={loadingQuiz}

               onClick={generateQuestions}
             >

               {
                 loadingQuiz
                   ? "Generating..."
                   : "Generate Questions"
               }

             </button>

             {quizData &&
               quizType === "mcq" &&
               Array.isArray(quizData) && (

                 <div>

                   {!quizFinished ? (

                     <div>

                       <h3>

                         Question {

                           currentQuestion + 1

                         } / {

                           quizData.length

                         }

                       </h3>
                       <div
                         style={{
                           marginTop: "15px",
                           fontWeight: "bold",
                           fontSize: "18px",

                           color:
                             timeLeft <= 10
                               ? "#ef4444"
                               : "#0f172a"
                         }}
                       >

                         ⏳ Time Left:
                         {timeLeft}s

                       </div>
<div
  style={{
    width: "100%",
    height: "12px",
    background: "#e2e8f0",
    borderRadius: "10px",
    marginTop: "15px",
    overflow: "hidden"
  }}
>

  <div
    style={{

      width: `${(

        (
          currentQuestion + 1
        ) /

        quizData.length

      ) * 100}%`,

      height: "100%",

      background:
        "linear-gradient(90deg,#7c3aed,#4f46e5)",

      transition:
        "0.3s ease"
    }}
  />

</div>
                       <p
                         style={{
                           fontWeight: "bold",
                           marginTop: "20px"
                         }}
                       >

                         {
                           quizData[
                             currentQuestion
                           ].question
                         }

                       </p>

                       <div
                         style={{
                           marginTop: "20px"
                         }}
                       >

                         {quizData[
                           currentQuestion
                         ].options.map(
                           (option, index) => (

                             <button
                               key={index}
                               style={{
                                 ...optionBtn,

                                 background:

                                   showResult &&

                                   option ===

                                   quizData[
                                     currentQuestion
                                   ].answer

                                     ? "#22c55e"

                                     : showResult &&

                                       selectedAnswer ===
                                       option &&

                                       selectedAnswer !==
                                       quizData[
                                         currentQuestion
                                       ].answer

                                     ? "#ef4444"

                                     : selectedAnswer ===
                                       option

                                     ? "#7c3aed"

                                     : "white",

                                color:

                                  selectedAnswer ===
                                  option ||

                                  (
                                    showResult &&
                                    option ===
                                    quizData[
                                      currentQuestion
                                    ].answer
                                  )

                                    ? "white"

                                    : "#0f172a"
                               }}

                               onClick={() => {

                                 setSelectedAnswer(
                                   option
                                 );

                                 setShowResult(true);

                               }}
                             >

                               {option}

                             </button>

                           )
                         )}

                       </div>

                       {showResult && (

                         <div
                           style={{
                             marginTop: "20px",
                             padding: "12px",
                             borderRadius: "10px",
                             background: "#dcfce7",
                             color: "#166534",
                             fontWeight: "bold"
                           }}
                         >

                           Correct Answer: {

                             quizData[
                               currentQuestion
                             ].answer

                           }

                         </div>

                       )}

                       {showResult && (

                         <div
                           style={{
                             marginTop: "15px",
                             fontWeight: "bold",
                             fontSize: "18px",

                             color:

                               selectedAnswer ===

                               quizData[
                                 currentQuestion
                               ].answer

                                 ? "#22c55e"

                                 : "#ef4444"
                           }}
                         >

                           {
                             selectedAnswer ===
                             quizData[
                               currentQuestion
                             ].answer

                               ? "✅ Correct Answer!"

                               : "❌ Wrong Answer"
                           }

                         </div>

                       )}

                       {showResult &&

                         quizData[
                           currentQuestion
                         ].explanation && (

                           <div
                             style={{
                               marginTop: "15px",
                               padding: "14px",
                               borderRadius: "10px",
                               background: "#ede9fe",
                               color: "#4c1d95",
                               textAlign: "left",
                               lineHeight: "1.6"
                             }}
                           >

                             <strong>
                               Explanation:
                             </strong>

                             <br /><br />

                             {

                               quizData[
                                 currentQuestion
                               ].explanation

                             }

                           </div>

                       )}
                       <button
                         style={{
                           ...nextBtn,

                           opacity:
                             !selectedAnswer
                               ? 0.5
                               : 1,

                           cursor:
                             !selectedAnswer
                               ? "not-allowed"
                               : "pointer"
                         }}

                         disabled={!selectedAnswer}

                         onClick={() => {

                           const correctAnswer =

                             quizData[
                               currentQuestion
                             ].answer;

                           if (
                             selectedAnswer ===
                             correctAnswer
                           ) {

                             setScore(
                               prev =>
                                 prev + 1
                             );

                           }

                           // RESET

                           setSelectedAnswer("");

                           setShowResult(false);
setTimeLeft(30);
                           // NEXT QUESTION

                           if (
                             currentQuestion + 1 <
                             quizData.length
                           ) {

                             setCurrentQuestion(
                               prev =>
                                 prev + 1
                             );

                           } else {

                             setQuizFinished(
                               true

                             );
                             setTimerActive(false);

                           }

                         }}
                       >

                         {
                           currentQuestion + 1 <
                           quizData.length

                             ? "Next Question"

                             : "Finish Quiz"
                         }

                       </button>
                     </div>

                   ) : (

                         <div
                           style={{
                             textAlign: "center"
                           }}
                         >

                           <h2>
                             🎉 Quiz Finished
                           </h2>

                           <h1>

                             {score} / {

                               quizData.length

                             }

                           </h1>

                           <h2
                             style={{
                               marginTop: "10px",
                               color: "#7c3aed"
                             }}
                           >

                             {

                               Math.round(

                                 (
                                   score /

                                   quizData.length
                                 ) * 100

                               )

                             }%

                           </h2>

                           <p
                             style={{
                               marginTop: "15px",
                               fontWeight: "bold",
                               fontSize: "18px"
                             }}
                           >

                             {

                               score ===
                               quizData.length

                                 ? "🏆 Perfect Score!"

                                 : score >=
                                   quizData.length * 0.7

                                 ? "🔥 Great Job!"

                                 : score >=
                                   quizData.length * 0.4

                                 ? "👍 Good Attempt!"

                                 : "📚 Keep Practicing!"

                             }

                           </p>

                           <button
                             style={{
                               ...nextBtn,
                               marginTop: "20px"
                             }}

                             onClick={() => {

                               setCurrentQuestion(0);

                               setScore(0);

                               setQuizFinished(false);

                               setSelectedAnswer("");

                               setShowResult(false);

                             }}
                           >

                             🔄 Retry Quiz

                           </button>

                         </div>

                       )}



                 </div>

             )}

             {quizData &&
               quizType !== "mcq" && (

                 <div
                   style={{
                     textAlign: "left"
                   }}
                 >

                   <ReactMarkdown>
                     {quizData}
                   </ReactMarkdown>

                 </div>

             )}
                 </div>

                       </div>

                     </div>

                   )}

      {/* TOAST */}
{
  viewerOpen && (

    <PdfViewerModal
      fileUrl={viewerFile}

      onClose={() =>
        setViewerOpen(false)
      }
    />

  )
}
      <ToastContainer
        position="top-right"
      />

    </div>

  );

}

// ================= STYLES =================

const container = {

  padding: "clamp(12px,3vw,22px)",

  background: "#f1f5f9",

  minHeight: "100vh",

  width: "100%",

  maxWidth: "1400px",

  margin: "0 auto",

  overflowX: "hidden",

  boxSizing: "border-box"

};

const header = {
  marginBottom: "18px"
};

const title = {

  color: "#0f172a",

  marginBottom: "5px",

  fontSize:
    "clamp(32px,6vw,52px)",

  fontWeight: "800",

  lineHeight: "1.1"

};

const subtitle = {
  color: "#64748b"
};

const uploadSection = {

  display: "flex",

  alignItems: "center",

  gap: "14px",

  flexWrap: "wrap",

  marginBottom: "22px",

  background: "white",

  padding: "22px",

  borderRadius: "24px",

  boxShadow:
    "0 4px 14px rgba(0,0,0,0.05)"

};

const input = {

  padding: "14px",

  borderRadius: "14px",

  border: "1px solid #dbeafe",

  minWidth: "220px",

  width: "100%",

  flex: 1,

  outline: "none",

  fontSize: "15px",

  background: "#f8fafc",

  boxSizing: "border-box"

};
const uploadBtn = {

  background:
    "linear-gradient(135deg,#2563eb,#4f46e5)",

  color: "white",

  border: "none",

  padding: "14px 24px",

  borderRadius: "14px",

  cursor: "pointer",

  fontWeight: "700",

  minHeight: "52px"

};

const searchBar = {

  width: "100%",

  minHeight: "58px",

  padding: "0 20px",

  borderRadius: "16px",

  border: "1px solid #dbeafe",

  background: "white",

  fontSize: "16px",

  outline: "none",

  boxShadow:
    "0 4px 12px rgba(0,0,0,0.04)",

  boxSizing: "border-box"

};
const searchRow = {

  display: "grid",

  gridTemplateColumns:
    "repeat(auto-fit,minmax(180px,1fr))",

  gap: "18px",

  alignItems: "stretch",

  marginBottom: "30px"

};
const miniStat = {

  background: "white",

  height: "58px",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  borderRadius: "16px",

  fontWeight: "700",

  fontSize: "18px",

  color: "#0f172a",

  boxShadow:
    "0 4px 12px rgba(0,0,0,0.05)",

  border:
    "1px solid #e2e8f0"

};

const emptyBox = {

  background: "white",

  padding: "clamp(26px,6vw,50px)",

  borderRadius: "24px",

  textAlign: "center",

  marginTop: "40px",

  boxShadow:
    "0 4px 10px rgba(0,0,0,0.08)"

};

const subjectSection = {
  marginTop: "40px"
};

const subjectHeading = {
  marginBottom: "18px",
  color: "#0f172a",
  fontSize: "24px",
  fontWeight: "700"
};

const grid = {

  display: "grid",

  gridTemplateColumns:
    "repeat(auto-fit,minmax(320px,1fr))",

  gap: "24px",

  alignItems: "stretch"

};


const questionCountInput = {
  width: "100%",
  padding: "12px",
  marginTop: "15px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1"
};

const resultBox = {

  marginTop: "35px",

  background: "white",

  padding: "clamp(18px,4vw,30px)",

  borderRadius: "24px",

  boxShadow:
    "0 4px 10px rgba(0,0,0,0.08)",

  overflowX: "auto",

  lineHeight: "1.8"

};

const loadingText = {
  marginTop: "20px"
};

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background:
    "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999
};

const quizModal = {

  width: "95%",

  maxWidth: "760px",

  maxHeight: "88vh",

  overflowY: "auto",

  background: "white",

  borderRadius: "24px",

  padding: "clamp(18px,4vw,28px)",

  boxShadow:
    "0 10px 30px rgba(0,0,0,0.2)"

};

const quizHeader = {
  display: "flex",
  justifyContent:
    "space-between",
  alignItems: "center",
  marginBottom: "20px"
};

const closeBtn = {
  border: "none",
  background: "#ef4444",
  color: "white",
  width: "35px",
  height: "35px",
  borderRadius: "50%",
  cursor: "pointer"
};

const quizContent = {
  lineHeight: "1.8"
};


const quizSelect = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  marginBottom: "15px"
};

const generateBtn = {
  width: "100%",
  background: "#7c3aed",
  color: "white",
  border: "none",
  padding: "12px",
  borderRadius: "10px",
  cursor: "pointer",
  marginBottom: "20px",
  fontWeight: "bold"
};
const optionBtn = {

  width: "100%",

  padding: "16px",

  marginTop: "12px",

  borderRadius: "14px",

  border: "1px solid #cbd5e1",

  cursor: "pointer",

  textAlign: "left",

  fontWeight: "bold",

  lineHeight: "1.6",

  wordBreak: "break-word"

};

const nextBtn = {
  width: "100%",
  background: "#22c55e",
  color: "white",
  border: "none",
  padding: "14px",
  borderRadius: "10px",
  cursor: "pointer",
  marginTop: "25px",
  fontWeight: "bold"
};



export default UploadPage;