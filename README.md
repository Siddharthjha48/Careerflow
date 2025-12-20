# CareerFlow

A modern, full-stack job application platform that connects recruiters with job seekers. CareerFlow provides a seamless experience for posting jobs, browsing opportunities, managing applications, and tracking career progress.

![CareerFlow](https://img.shields.io/badge/CareerFlow-v1.0.0-blue)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933)
![MongoDB](https://img.shields.io/badge/MongoDB-9.0.0-47A248)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [User Roles](#user-roles)
- [Features in Detail](#features-in-detail)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

CareerFlow is a comprehensive job application management system designed to streamline the hiring process. The platform supports two distinct user roles:

- **Recruiters**: Post jobs, manage applications, track candidates, and update application statuses
- **Job Seekers**: Browse available positions, apply for jobs, track application status, and manage their profile

The application features a modern, responsive UI built with React and Tailwind CSS, powered by a robust Express.js backend with MongoDB for data persistence.

## ✨ Features

### For Recruiters
- ✅ Create, edit, and delete job postings
- ✅ View all applications for posted jobs
- ✅ Update application status (applied → shortlisted → interview → rejected/hired)
- ✅ View applicant profiles and resumes
- ✅ Analytics dashboard with application statistics
- ✅ Real-time notifications for new applications
- ✅ Profile management with company information

### For Job Seekers
- ✅ Browse all available job postings
- ✅ Apply for jobs with one click
- ✅ Track application status in real-time
- ✅ View application history and analytics
- ✅ Profile management with bio, skills, and experience
- ✅ Resume upload and management
- ✅ Receive notifications on application status updates

### General Features
- 🔐 Secure authentication with JWT tokens
- 📊 Analytics dashboard with status breakdown
- 🔔 Real-time notification system
- 📱 Fully responsive design
- 🎨 Modern, dark-themed UI
- ⚡ Fast and optimized performance

## 🛠 Tech Stack

### Frontend
- **React 19.2.0** - Modern UI library
- **Vite 7.2.5** - Fast build tool and dev server
- **React Router DOM 7.9.6** - Client-side routing
- **Tailwind CSS 4.1.17** - Utility-first CSS framework
- **ESLint** - Code linting and quality

### Backend
- **Node.js** - JavaScript runtime
- **Express 5.1.0** - Web application framework
- **MongoDB 9.0.0** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT (jsonwebtoken)** - Authentication tokens
- **bcrypt** - Password hashing
- **Multer** - File upload handling
- **Nodemailer** - Email functionality
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📁 Project Structure

```
Careerflow/
├── frontend/                 # React frontend application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   │   ├── JobForm.jsx         # Job creation/edit form
│   │   │   ├── JobItem.jsx         # Individual job card component
│   │   │   ├── NotificationBell.jsx # Notification component
│   │   │   └── ProfileModal.jsx    # User profile modal
│   │   ├── pages/           # Page components
│   │   │   ├── Dashboard.jsx       # Main dashboard
│   │   │   ├── Login.jsx           # Login page
│   │   │   └── Signup.jsx          # Registration page
│   │   ├── App.jsx          # Main app component with routing
│   │   ├── main.jsx         # Application entry point
│   │   └── index.css        # Global styles
│   ├── package.json
│   ├── vite.config.js       # Vite configuration
│   └── eslint.config.js     # ESLint configuration
│
├── backend/                 # Express backend application
│   ├── config/
│   │   └── db.js            # MongoDB connection configuration
│   ├── controllers/         # Route controllers
│   │   ├── authController.js        # Authentication logic
│   │   ├── jobController.js         # Job CRUD operations
│   │   ├── applicationController.js # Application management
│   │   └── userController.js        # User profile management
│   ├── middleware/
│   │   └── authMiddleware.js        # JWT authentication middleware
│   ├── models/              # Mongoose schemas
│   │   ├── User.js                  # User model
│   │   ├── Job.js                   # Job model
│   │   ├── Application.js           # Application model
│   │   └── Notification.js          # Notification model
│   ├── routes/              # API routes
│   │   ├── authRoutes.js            # Authentication routes
│   │   ├── jobRoutes.js             # Job routes
│   │   ├── applicationRoutes.js     # Application routes
│   │   └── userRoutes.js            # User routes
│   ├── utils/               # Utility functions
│   ├── uploads/             # Uploaded files (resumes, etc.)
│   ├── index.js             # Server entry point
│   ├── seed.js              # Database seeding script
│   └── package.json
│
└── README.md                # This file
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MongoDB** (v5.0 or higher) - [Download](https://www.mongodb.com/try/download/community)
  - Or use MongoDB Atlas (cloud database) - [Sign up](https://www.mongodb.com/cloud/atlas)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Careerflow
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Install Backend Dependencies

```bash
cd ../backend
npm install
```

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=3000

# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/careerflow
# Or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/careerflow?retryWrites=true&w=majority

# JWT Secret (generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Email Configuration (optional, for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Frontend Configuration

The frontend is configured to connect to `http://localhost:3000` by default. If your backend runs on a different port, update the API URLs in the frontend components:

- `frontend/src/pages/Dashboard.jsx`
- `frontend/src/pages/Login.jsx`
- `frontend/src/pages/Signup.jsx`
- `frontend/src/components/JobItem.jsx`
- `frontend/src/components/JobForm.jsx`
- `frontend/src/components/ProfileModal.jsx`
- `frontend/src/components/NotificationBell.jsx`

## 🏃 Running the Application

### Start MongoDB

If using local MongoDB:

```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
# or
mongod --dbpath /path/to/data
```

### Start the Backend Server

```bash
cd backend
npm start
```

The backend server will start on `http://localhost:3000` (or the port specified in your `.env` file).

### Start the Frontend Development Server

Open a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173` (Vite's default port).

### Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/signup`
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user" // or "recruiter"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### POST `/api/auth/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Job Endpoints

All job endpoints require authentication (Bearer token in Authorization header).

#### GET `/api/jobs`
Get all jobs (filtered by user role).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "jobs": [
    {
      "_id": "job_id",
      "company": "Tech Corp",
      "position": "Software Engineer",
      "status": "pending",
      "jobType": "full-time",
      "jobLocation": "San Francisco, CA",
      "createdBy": "user_id",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST `/api/jobs`
Create a new job (recruiter only).

**Request Body:**
```json
{
  "company": "Tech Corp",
  "position": "Software Engineer",
  "status": "pending",
  "jobType": "full-time",
  "jobLocation": "San Francisco, CA"
}
```

#### PATCH `/api/jobs/:id`
Update a job (recruiter only, must be job owner).

**Request Body:**
```json
{
  "company": "Updated Company",
  "position": "Senior Software Engineer",
  "status": "interview",
  "jobType": "remote"
}
```

#### DELETE `/api/jobs/:id`
Delete a job (recruiter only, must be job owner).

### Application Endpoints

All application endpoints require authentication.

#### POST `/api/applications`
Apply for a job (user role only).

**Request Body:**
```json
{
  "jobId": "job_id"
}
```

#### GET `/api/applications`
Get all applications (filtered by user role).

**Response:**
```json
{
  "applications": [
    {
      "_id": "application_id",
      "job": {
        "_id": "job_id",
        "company": "Tech Corp",
        "position": "Software Engineer"
      },
      "applicant": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "resume": "uploads/resume.pdf"
      },
      "recruiter": "recruiter_id",
      "status": "applied",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### PATCH `/api/applications/:id/status`
Update application status (recruiter only).

**Request Body:**
```json
{
  "status": "shortlisted" // applied, shortlisted, interview, rejected, hired
}
```

#### GET `/api/applications/analytics`
Get application analytics.

**Response:**
```json
{
  "stats": {
    "totalApplications": 10,
    "statusBreakdown": [
      { "_id": "applied", "count": 5 },
      { "_id": "shortlisted", "count": 2 },
      { "_id": "interview", "count": 2 },
      { "_id": "rejected", "count": 1 }
    ]
  }
}
```

### Notification Endpoints

#### GET `/api/applications/notifications`
Get all notifications for the authenticated user.

#### PATCH `/api/applications/notifications/:id/read`
Mark a notification as read.

### User Endpoints

#### GET `/api/users/profile`
Get current user profile.

#### PATCH `/api/users/profile`
Update user profile.

**Request Body:**
```json
{
  "name": "Updated Name",
  "bio": "Software developer with 5 years of experience",
  "skills": "JavaScript, React, Node.js",
  "experience": "5 years in web development"
}
```

#### POST `/api/users/upload-resume`
Upload a resume (multipart/form-data).

## 👥 User Roles

### Recruiter Role
- Can create, edit, and delete job postings
- Can view all applications for their posted jobs
- Can update application statuses
- Can view applicant profiles and resumes
- Has access to application analytics

### User Role (Job Seeker)
- Can browse all available job postings
- Can apply for jobs
- Can view their own applications
- Can track application status
- Can manage their profile and upload resume

## 🎨 Features in Detail

### Authentication & Authorization
- Secure password hashing using bcrypt
- JWT-based authentication
- Protected routes with middleware
- Role-based access control

### Job Management
- Full CRUD operations for jobs
- Job status tracking (pending, interview, declined, offer)
- Job type filtering (full-time, part-time, remote, internship)
- Location-based job listings

### Application System
- One-click job application
- Application status tracking
- Duplicate application prevention
- Application history and analytics

### Notifications
- Real-time notification system
- Status change notifications
- Application received notifications
- Read/unread status tracking

### Analytics Dashboard
- Total applications count
- Status breakdown visualization
- Role-specific analytics
- Real-time statistics

### Profile Management
- User profile with bio, skills, and experience
- Resume upload and management
- Profile editing capabilities
- Role-based profile views

## 🧪 Development

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```

The production build will be in the `frontend/dist` directory.

**Backend:**
The backend is ready for production. Ensure environment variables are properly configured.

### Linting

**Frontend:**
```bash
cd frontend
npm run lint
```

### Database Seeding

To seed the database with sample data:

```bash
cd backend
node seed.js
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📝 License

This project is licensed under the ISC License.

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check your `MONGO_URI` in the `.env` file
- Verify network connectivity if using MongoDB Atlas

**Port Already in Use:**
- Change the `PORT` in backend `.env` file
- Update frontend API URLs accordingly

**CORS Errors:**
- Ensure CORS is enabled in the backend
- Check that frontend and backend URLs are correct

**Authentication Issues:**
- Verify JWT_SECRET is set in `.env`
- Check token expiration
- Ensure tokens are being sent in request headers

## 📞 Support

For issues, questions, or contributions, please open an issue on the GitHub repository.

## 🎯 Future Enhancements

Potential features for future releases:

- [ ] Advanced job search and filtering
- [ ] Email notifications
- [ ] Resume parsing and analysis
- [ ] Interview scheduling system
- [ ] Company profiles and branding
- [ ] Job recommendations based on profile
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Advanced analytics and reporting
- [ ] Integration with job boards

---

**Built with ❤️ using React, Node.js, and MongoDB**

