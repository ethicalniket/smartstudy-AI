📚 SmartStudy AI
SmartStudy AI is a full-stack academic assistant platform that helps students upload study materials (PDFs), manage content securely, and later generate summaries, notes, and important questions using AI.
This repository contains both backend and frontend in a single structured project to clearly show project evolution from start to current stage.
🧩 Project Structure

smartstudy-ai/
│
├── backend/
│   └── smartstudy-backend/
│       ├── src/
│       ├── pom.xml
│       └── README.md
│
├── frontend/
│   └── smartstudy-ui/
│       ├── src/
│       ├── package.json
│       └── README.md
│
├── docs/
│   ├── dfd/
│   ├── er-diagram/
│   └── use-case/
│
├── .gitignore
└── README.md
🎯 Project Objectives
Secure user authentication (Register / Login)
Upload and manage PDF study materials
Backend API using Spring Boot
Frontend UI using React
PostgreSQL database integration
Clean system design suitable for academic evaluation
Future-ready for AI integration (summaries, notes, Q&A)
⚙️ Technology Stack
🔹 Backend
Java 17
Spring Boot
Spring Security (JWT based)
PostgreSQL
Maven
🔹 Frontend
React.js
Axios
React Router
HTML / CSS
🔹 Tools
Git & GitHub
Postman
pgAdmin
VS Code / IntelliJ IDEA
🔐 Features Implemented (Current Status)
✅ Backend
User Registration
User Login with JWT token
Password encryption (BCrypt)
PDF upload API
File storage on server
CORS & Security configuration
✅ Frontend
Login page
Register page
Protected Dashboard
PDF Upload module
File upload status handling
🗄️ Database Design (PostgreSQL)
Main entities used:
User – stores user credentials
UploadedFile – stores uploaded PDF metadata
Database is connected using Spring Data JPA.
🔄 System Flow (High Level)
User registers / logs in
JWT token generated on login
Token used to access protected APIs
User uploads PDF
PDF stored on server
(Future) AI processes PDF for summary & notes
🚀 How to Run the Project
▶ Backend
Bash
cd backend/smartstudy-backend
./mvnw spring-boot:run
Runs on: http://localhost:8080
▶ Frontend
Bash
cd frontend/smartstudy-ui
npm install
npm start
Runs on: http://localhost:3000
📌 Future Enhancements
AI-based summary generation
Important question generation
Notes extraction
File categorization
Role-based access
Cloud storage integration
👨‍🎓 Academic Context
This project is developed as a B.Tech CSE Minor Project, focusing on:
System Design
Backend architecture
Secure authentication
Real-world full stack development
👤 Author
Niket Nayan
B.Tech – Computer Science & Engineering
Project Report content
Viva questions + answers
बस बोलो: “next” 💪
