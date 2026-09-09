# Sisenco Reports - Weekly Report Generator & Team Dashboard

A full-stack web application designed for software engineering teams to seamlessly submit weekly progress reports and for managers to review team activity, track compliance, and manage workflows efficiently.

## 🚀 Tech Stack

* **Frontend:** React.js, Tailwind CSS, Framer Motion
* **Backend:** Spring Boot, Java 25, RESTful APIs, Spring Security (JWT Authentication)
* **Database:** MongoDB (NoSQL)
* **AI Integration:** Google Gemini API

## ✨ Key Features

* **Role-Based Access Control (RBAC):** Distinct dashboards and permissions for Team Members and Managers.
* **Review & Correction Workflow:** Dynamic report statuses (`Draft` -> `Submitted` -> `Needs Correction` -> `Approved`).
* **Report Version History:** Preserves previous report data and manager comments using MongoDB embedded arrays, preventing data overwriting.
* **Team Comparison Dashboard:** A centralized, side-by-side view for managers to quickly identify team blockers and key achievements.
* **AI Chat Assistant (Bonus):** Context-aware Gemini AI that analyzes database reports and allows managers to instantly export AI-generated summaries into downloadable Microsoft Word (`.docx`) documents.

## 🛠️ How to Run Locally

### Prerequisites
* Node.js
* Java (JDK) & Maven
* MongoDB Instance

### Frontend Setup
1. Navigate to the `frontend` folder: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

### Backend Setup
1. Navigate to the `backend` folder: `cd backend`
2. Update the `application.properties` file with your MongoDB URI, JWT Secret, and Gemini API Key.
3. Build and run the Spring Boot application: `mvn spring-boot:run`

---
*Developed by Dusan Navidu*
