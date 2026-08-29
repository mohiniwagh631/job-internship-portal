# JobHub – Job & Internship Portal

JobHub is a full-stack MERN web application that helps job seekers find jobs and internships and apply for suitable opportunities.

## Features

### Candidate
- Register and Login
- Search and filter jobs
- View job details
- Apply for jobs
- Upload resume
- Track application status
- Candidate dashboard

### Admin
- Admin Login
- Admin Dashboard
- Create and manage jobs
- View registered users
- View applications
- Update application status
- View and download resumes

## Technologies

**Frontend:** React.js, JavaScript, HTML, CSS, React Router, Lucide React

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, Multer

## Project Structure

```text
job-internship-portal/
│
├── frontend/     # React frontend
│
└── backend/      # Node.js + Express backend

 Installation

Backend
cd backend
npm install
npm start

Create a .env file in the backend folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Frontend

Open another terminal:

cd frontend
npm install
npm start

Frontend runs on:

http://localhost:3000

Backend runs on:

http://localhost:5000
Database

JobHub uses MongoDB to store users, jobs, applications, and resume information.

## Application Flow

Register/Login
      ↓
Browse Jobs
      ↓
View Job Details
      ↓
Apply for Job
      ↓
Upload Resume
      ↓
Track Application
      ↓
Admin Reviews Application



Author

Mohini Wagh