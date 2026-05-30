import React, {
  useEffect,
  useRef,
  useState
} from "react";
import {
  useOutletContext
} from "react-router-dom";
import ReactMarkdown from "react-markdown";

import {
  askAllPdfs,
  continueChat,
  getConversations,
  getConversation,
  deleteConversation
} from "../services/studyAssistantService";

function AIStudyAssistant() {

const {
  sidebarOpen
} = useOutletContext();

  const [question, setQuestion] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [mobile, setMobile] =
    useState(
      window.innerWidth < 768
    );

  const [showSidebar,
    setShowSidebar] =
    useState(false);

  const [
    conversations,
    setConversations
  ] = useState([]);

  const [
    currentConversationId,
    setCurrentConversationId
  ] = useState(null);

  const [
    messages,
    setMessages
  ] = useState([]);

  const messagesEndRef =
    useRef(null);

  useEffect(() => {

    loadConversations();

  }, []);

  useEffect(() => {

    const handleResize =
      () => {

        setMobile(
          window.innerWidth < 768
        );

      };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );

  }, []);

  useEffect(() => {

    messagesEndRef.current
      ?.scrollIntoView({
        behavior:
          "smooth"
      });

  }, [messages]);

  const loadConversations =
    async () => {

      try {

        const data =
          await getConversations();

        setConversations(
          data
        );

      } catch (e) {

        console.error(e);

      }
    };

  const openConversation =
    async (id) => {

      try {

        setCurrentConversationId(
          id
        );

        const data =
          await getConversation(
            id
          );

        setMessages(data);

        if (mobile) {

          setShowSidebar(
            false
          );

        }

      } catch (e) {

        console.error(e);

      }
    };

  const handleNewChat =
    () => {

      setCurrentConversationId(
        null
      );

      setMessages([]);

      setQuestion("");

      if (mobile) {

        setShowSidebar(
          false
        );

      }
    };

  const handleDelete =
    async (
      e,
      id
    ) => {

      e.stopPropagation();

      const ok =
        window.confirm(
          "Delete conversation?"
        );

      if (!ok) return;

      try {

        await deleteConversation(
          id
        );

        if (
          currentConversationId ===
          id
        ) {

          setCurrentConversationId(
            null
          );

          setMessages([]);
        }

        await loadConversations();

      } catch (e) {

        console.error(e);

      }
    };

  const handleAsk =
    async () => {

      if (
        !question.trim()
      ) return;

      try {

        setLoading(true);

        if (
          !currentConversationId
        ) {

          await askAllPdfs(
            question
          );

        } else {

          await continueChat(
            currentConversationId,
            question
          );

        }

        setQuestion("");

        await loadConversations();

        const latest =
          await getConversations();

        if (
          !currentConversationId &&
          latest.length > 0
        ) {

          const newest =
            latest[0];

          setCurrentConversationId(
            newest.id
          );

          const msgs =
            await getConversation(
              newest.id
            );

          setMessages(
            msgs
          );

        } else {

          const msgs =
            await getConversation(
              currentConversationId
            );

          setMessages(
            msgs
          );
        }

      } catch (e) {

        console.error(e);

      } finally {

        setLoading(false);

      }
    };

  const filteredChats =
    conversations.filter(
      (chat) =>
        chat.title
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  return (

    <div
      style={{
        display: "flex",
        height: "calc(100vh - 70px)",
        background:
          "#f8fafc",
        overflow:
          "hidden"
      }}
    >

     {mobile &&
      !sidebarOpen && (

       <button
         onClick={() =>
           setShowSidebar(
             !showSidebar
           )
         }
          style={{
            position:
              "fixed",
            left: 15,
            top: 90,
            zIndex: 9999,
            border: "none",
            borderRadius:
              "12px",
            padding:
              "10px 14px",
            background:
              "#2563eb",
            color:
              "#fff"
          }}
        >
          ☰ Chats
        </button>

      )}

      {/* SIDEBAR */}

      <div
        style={{

          width:
            mobile
              ? "280px"
              : "280px",

          position:
            mobile
              ? "fixed"
              : "relative",

          left:
            mobile
              ? (
                  showSidebar
                    ? "0"
                    : "-300px"
                )
              : "0",

         top:
           mobile
             ? "75px"
             : "0",
          height:
            mobile
              ? "calc(100vh - 75px)"
              : "100%",

          background:
            "#ffffff",

          zIndex:
            5,

          transition:
            "all 0.3s ease",

          borderRight:
            "1px solid #e5e7eb",

          overflowY:
            "auto",

          padding:
            "20px",

          boxShadow:
            mobile
              ? "0 0 20px rgba(0,0,0,0.15)"
              : "none"
        }}
      >

        <h2
          style={{
            marginTop: 0,
            marginBottom: "20px",
            fontSize: "24px",
            fontWeight: "700"
          }}
        >
          Conversations
        </h2>
        <button
          onClick={
            handleNewChat
          }
          style={{
            width: "100%",
            padding:
              "12px",
            border: "none",
            borderRadius:
              "12px",
            marginBottom:
              "15px",
            background:
              "#2563eb",
            color:
              "#fff",
            cursor:
              "pointer"
          }}
        >
          + New Chat
        </button>

        <input
          placeholder="Search chats..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding:
              "10px",
            marginBottom:
              "15px",
            borderRadius:
              "10px",
            border:
              "1px solid #ddd"
          }}
        />

        {

          filteredChats.map(
            (chat) => (

              <div
                key={chat.id}
                onClick={() =>
                  openConversation(
                    chat.id
                  )
                }
                style={{
                  padding:
                    "12px",
                  marginBottom:
                    "10px",
                  borderRadius:
                    "12px",
                  cursor:
                    "pointer",
                  background:
                    currentConversationId ===
                    chat.id
                      ? "#dbeafe"
                      : "#f8fafc",
                  border:
                    "1px solid #e5e7eb",
                  display:
                    "flex",
                  justifyContent:
                    "space-between"
                }}
              >

                <span>
                  {
                    chat.title
                  }
                </span>

                <button
                  onClick={(e) =>
                    handleDelete(
                      e,
                      chat.id
                    )
                  }
                  style={{
                    border:
                      "none",
                    background:
                      "transparent"
                  }}
                >
                  🗑
                </button>

              </div>

            )
          )

        }

      </div>

      {/* CHAT AREA */}

      <div
        style={{
          flex: 1,
          display:
            "flex",
          flexDirection:
            "column"
        }}
      >

        {/* HEADER */}

        <div
          style={{
            background:
              "#fff",
            borderBottom:
              "1px solid #e5e7eb",
            padding:
              "18px 25px",
            fontWeight:
              "700"
          }}
        >
         🤖 AI Study Assistant
        </div>

        {/* MESSAGES */}

        <div
          style={{
            flex: 1,
            overflowY:
              "auto",
            padding:
              "25px"
          }}
        >

          {

            messages.length === 0 && (

              <div
                style={{
                  maxWidth:
                    "700px",
                  margin:
                    "60px auto",
                  textAlign:
                    "center"
                }}
              >
                <h1>
                  What would you like to learn today?
                </h1>

                <p>
                  Ask anything from your uploaded notes.
                </p>

                <div>
                  • Dynamic Programming
                </div>

                <div>
                  • Deadlock
                </div>

                <div>
                  • Computer Networks
                </div>

                <div>
                  • DBMS
                </div>

              </div>

            )

          }

          {

            messages.map(
              (
                msg,
                index
              ) => (

                <div
                  key={index}
                  style={{
                    display:
                      "flex",
                    justifyContent:
                      msg.role ===
                      "USER"
                        ? "flex-end"
                        : "flex-start",
                    marginBottom:
                      "20px"
                  }}
                >

                 <div
                   style={{
                     maxWidth:
                       "80%",

                     padding:
                       "15px",

                     borderRadius:
                       "16px",

                     background:
                       msg.role ===
                       "USER"
                         ? "#2563eb"
                         : "#fff",

                     color:
                       msg.role ===
                       "USER"
                         ? "#fff"
                         : "#111",

                     border:
                       msg.role ===
                       "AI"
                         ? "1px solid #e5e7eb"
                         : "none",

                     overflow:
                       "hidden",

                     overflowWrap:
                       "break-word",

                     wordBreak:
                       "break-word"
                   }}
                 >
                    <ReactMarkdown
                      components={{
                        code({ children }) {
                          return (
                            <code
                              style={{
                                background: "#f1f5f9",
                                padding: "2px 6px",
                                borderRadius: "4px",
                                fontFamily: "monospace"
                              }}
                            >
                              {children}
                            </code>
                          );
                        }
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>

                  </div>

                </div>

              )
            )

          }

          {

            loading && (

              <div
                style={{
                  padding:
                    "15px"
                }}
              >
                🤖 Thinking...
              </div>

            )

          }

          <div
            ref={
              messagesEndRef
            }
          />

        </div>

        {/* INPUT */}

        <div
          style={{
            background:
              "#fff",
            borderTop:
              "1px solid #e5e7eb",
            padding:
              "15px"
          }}
        >

          <div
            style={{
              display:
                "flex",
              gap: "10px"
            }}
          >

            <textarea
              value={
                question
              }
              onChange={(e) =>
                setQuestion(
                  e.target.value
                )
              }
              placeholder="Ask anything..."
              rows={2}
              style={{
                flex: 1,
                resize:
                  "none",
                padding:
                  "12px",
                borderRadius:
                  "12px",
                border:
                  "1px solid #ddd"
              }}
            />

            <button
              onClick={
                handleAsk
              }
              disabled={
                loading
              }
              style={{
                padding:
                  "0 20px",
                border:
                  "none",
                borderRadius:
                  "12px",
                background:
                  "#2563eb",
                color:
                  "#fff",
                cursor:
                  "pointer"
              }}
            >
              Send
            </button>

          </div>

        </div>

      </div>

    </div>

  );
}

export default AIStudyAssistant;