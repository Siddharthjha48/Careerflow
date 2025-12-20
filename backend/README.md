# CareerFlow Backend

A Node.js/Express backend API for a job application management system that connects recruiters and job seekers.

## Overview

The CareerFlow backend is built with Express.js and MongoDB, providing RESTful API endpoints for user authentication, job management, application tracking, and notifications. The system supports two user roles: **recruiters** (who post jobs) and **users** (who apply for jobs).

## Project Structure

```
backend/
├── config/              # Configuration files
│   └── db.js           # MongoDB connection setup
├── controllers/        # Request handlers (business logic)
│   ├── applicationController.js
│   ├── authController.js
│   ├── jobController.js
│   └── userController.js
├── middleware/         # Custom middleware functions
│   ├── authMiddleware.js    # JWT authentication
│   └── uploadMiddleware.js  # File upload handling
├── models/            # Mongoose schemas
│   ├── Application.js
│   ├── Job.js
│   ├── Notification.js
│   └── User.js
├── routes/            # API route definitions
│   ├── applicationRoutes.js
│   ├── authRoutes.js
│   ├── jobRoutes.js
│   └── userRoutes.js
├── utils/             # Utility functions
│   └── emailService.js    # Email sending service
├── uploads/           # Uploaded files storage
│   └── resumes/       # Resume files
├── index.js           # Application entry point
├── seed.js            # Database seeding script
└── package.json       # Dependencies and scripts
```

## Directory Details

### `/config`
Contains configuration files for the application.

- **`db.js`**: MongoDB connection setup using Mongoose
  - Handles database connection with error handling
  - Includes connection event listeners
  - Provides troubleshooting tips on connection failure

### `/controllers`
Contains controller functions that handle business logic for each route.

- **`authController.js`**: Handles user authentication
  - User registration (signup)
  - User login with JWT token generation

- **`jobController.js`**: Manages job postings
  - Create, read, update, delete jobs
  - Job filtering and search functionality

- **`applicationController.js`**: Handles job applications
  - Submit job applications
  - Get applications (for both users and recruiters)
  - Update application status (recruiter only)
  - Get analytics/statistics
  - Notification management

- **`userController.js`**: Manages user profiles
  - Get and update user information
  - Profile management

### `/middleware`
Custom middleware functions that process requests before they reach controllers.

- **`authMiddleware.js`**: JWT authentication middleware
  - `protect`: Verifies JWT tokens from Authorization header
  - Attaches user object to request if authenticated
  - Used to protect private routes

- **`uploadMiddleware.js`**: File upload handling using Multer
  - Configures storage for resume uploads
  - Validates file types (PDF, DOC, DOCX)
  - Saves files to `uploads/resumes/` directory

### `/models`
Mongoose schemas defining the data structure for MongoDB collections.

- **`User.js`**: User model
  - Fields: name, email, password, role (recruiter/user), bio, skills, experience, resume
  - Roles: `recruiter` or `user`
  - Timestamps enabled

- **`Job.js`**: Job posting model
  - Fields: company, position, status, jobType, jobLocation, createdBy
  - Status: pending, interview, declined, offer
  - Job types: full-time, part-time, remote, internship
  - References User model (createdBy)

- **`Application.js`**: Job application model
  - Fields: job, applicant, recruiter, status
  - Status: applied, shortlisted, interview, rejected, hired
  - References Job and User models
  - Unique index on job + applicant (prevents duplicate applications)

- **`Notification.js`**: Notification model
  - Fields: recipient, message, type, read, relatedId
  - Types: application_received, status_change, interview_scheduled, system
  - References User model (recipient)

### `/routes`
Route definitions that map HTTP endpoints to controller functions.

- **`authRoutes.js`**: Authentication routes
  - `POST /api/auth/signup` - User registration
  - `POST /api/auth/login` - User login

- **`jobRoutes.js`**: Job management routes
  - Protected routes for creating, reading, updating, and deleting jobs

- **`applicationRoutes.js`**: Application routes
  - `POST /api/applications` - Submit application
  - `GET /api/applications` - Get applications
  - `PATCH /api/applications/:id/status` - Update status
  - `GET /api/applications/analytics` - Get statistics

- **`userRoutes.js`**: User profile routes
  - Protected routes for user profile management

### `/utils`
Utility functions and services.

- **`emailService.js`**: Email sending service using Nodemailer
  - Uses Ethereal Email for testing (development)
  - Sends emails for application notifications and status updates
  - Can be configured for production SMTP

### `/uploads`
Directory for storing uploaded files.

- **`resumes/`**: Stores uploaded resume files (PDF, DOC, DOCX)

### Root Files

- **`index.js`**: Main application entry point
  - Sets up Express server
  - Configures middleware (CORS, JSON parsing, static file serving)
  - Connects to MongoDB
  - Registers all API routes
  - Starts the server on configured port

- **`seed.js`**: Database seeding script (if present)
  - Used to populate database with initial/test data

## API Routes

### Base URL
All API routes are prefixed with `/api`

### Authentication Routes (`/api/auth`)
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Job Routes (`/api/jobs`)
- Protected routes for job CRUD operations

### Application Routes (`/api/applications`)
- `POST /api/applications` - Apply for a job (User only)
- `GET /api/applications` - Get applications (User or Recruiter)
- `PATCH /api/applications/:id/status` - Update application status (Recruiter only)
- `GET /api/applications/analytics` - Get analytics/statistics

### User Routes (`/api/users`)
- Protected routes for user profile management

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB with Mongoose 9.0.0
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Password Hashing**: bcrypt 6.0.0
- **File Upload**: Multer 2.0.2
- **Email**: Nodemailer 7.0.11
- **Environment Variables**: dotenv 17.2.3
- **CORS**: cors 2.8.5

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   - Create a `.env` file in the backend directory
   - Add your MongoDB connection string and JWT secret

3. **Start the Server**
   ```bash
   npm start
   ```

4. **Access the API**
   - Server runs on `http://localhost:3000` (or your configured PORT)
   - API base URL: `http://localhost:3000/api`

## Features

- ✅ User authentication with JWT
- ✅ Role-based access control (Recruiter/User)
- ✅ Job posting and management
- ✅ Job application system
- ✅ Application status tracking
- ✅ Email notifications
- ✅ In-app notifications
- ✅ Resume file uploads
- ✅ Analytics and statistics
- ✅ Protected API routes

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

The `authMiddleware.js` protects routes by verifying the JWT token and attaching the user object to the request.

## File Uploads

Resume uploads are handled via Multer middleware. Files are validated to accept only PDF, DOC, and DOCX formats. Uploaded files are stored in the `uploads/resumes/` directory and can be accessed via the `/uploads` static route.

## Email Service

The email service uses Nodemailer with Ethereal Email for development/testing. In production, configure it with your SMTP credentials. Emails are sent for:
- New application notifications (to recruiters)
- Application status updates (to applicants)

## Database Models Relationships

- **User** → **Job** (One-to-Many: A user can create multiple jobs)
- **User** → **Application** (One-to-Many: A user can submit multiple applications)
- **Job** → **Application** (One-to-Many: A job can have multiple applications)
- **User** → **Notification** (One-to-Many: A user can have multiple notifications)

