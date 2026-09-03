# Weekly Report Generator & Team Dashboard

This is a full-stack web application that allows team members to submit structured weekly work reports and managers to review, analyze, and manage those reports across the team. 

## Tech Stack
* **Frontend:** React.js (Vite), TailwindCSS, Recharts (for Dashboard Visualizations)
* **Backend:** Spring Boot (Java), Spring Security (JWT)
* **Database:** MongoDB

---

## Setup Instructions

Please follow the steps below to set up and run the application locally.

### 1. Running database
This application uses MongoDB. You can run it locally or use MongoDB Atlas.
* **Local Setup:** Ensure MongoDB is installed and running on your machine (default port: `27017`).
* **Cloud (Atlas):** If using MongoDB Atlas, replace the `spring.data.mongodb.uri` value in the `backend/src/main/resources/application.properties` file with your connection string.

### 2. Installing dependencies
You need to install dependencies for both the frontend and backend.

**Frontend:**
Navigate to the `frontend` directory and install NPM packages:
```bash
cd frontend
npm install
