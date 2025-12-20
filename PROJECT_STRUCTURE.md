# CareerFlow - Project Structure Documentation

This document provides a detailed explanation of the CareerFlow project structure, including the purpose of each directory and key files.

## 📐 Architecture Overview

CareerFlow follows a **full-stack MERN architecture** (MongoDB, Express, React, Node.js) with a clear separation between frontend and backend:

```
Careerflow/
├── frontend/          # React frontend application (client-side)
├── backend/           # Express.js backend application (server-side)
└── README.md          # Main project documentation
```

---

## 🎨 Frontend Structure (`/frontend`)

The frontend is a **React 19** application built with **Vite** for fast development and optimized builds.

### Root Level Files

- **`package.json`** - Frontend dependencies and scripts
- **`vite.config.js`** - Vite build tool configuration
- **`eslint.config.js`** - ESLint linting rules and configuration
- **`index.html`** - HTML entry point for the React application
- **`README.md`** - Frontend-specific documentation

### `/public` Directory

Contains static assets served directly:

- **`vite.svg`** - Vite logo (can be replaced with your own assets)

### `/src` Directory

The main source code directory for the React application.

#### **`main.jsx`**
- **Purpose**: Application entry point
- **Responsibilities**: 
  - Renders the root React component
  - Sets up the React application in the DOM
  - Imports global styles

#### **`App.jsx`**
- **Purpose**: Main application component with routing
- **Responsibilities**:
  - Sets up React Router for client-side navigation
  - Defines all application routes:
    - `/signup` - User registration page
    - `/login` - User authentication page
    - `/dashboard` - Main application dashboard
    - `/` - Redirects to login
  - Manages route protection and navigation

#### **`App.css`**
- **Purpose**: Component-specific styles for App.jsx
- **Usage**: Styles for the main app container and layout

#### **`index.css`**
- **Purpose**: Global styles and Tailwind CSS imports
- **Usage**: Base styles, CSS resets, and Tailwind utility classes

#### **`/assets`** Directory
- **`react.svg`** - React logo asset (can be used in components)

#### **`/components`** Directory

Reusable React components used across the application:

##### **`JobForm.jsx`**
- **Purpose**: Form component for creating and editing job postings
- **Used By**: Dashboard (for recruiters)
- **Features**:
  - Job creation form
  - Job editing functionality
  - Form validation
  - API integration for job CRUD operations

##### **`JobItem.jsx`**
- **Purpose**: Displays individual job posting as a card component
- **Used By**: Dashboard
- **Features**:
  - Job details display (company, position, location, type)
  - Apply button (for job seekers)
  - Edit/Delete buttons (for recruiters)
  - Status indicators

##### **`NotificationBell.jsx`**
- **Purpose**: Notification bell icon with unread count badge
- **Used By**: Dashboard
- **Features**:
  - Displays notification count
  - Opens notification dropdown
  - Marks notifications as read
  - Real-time notification updates

##### **`ProfileModal.jsx`**
- **Purpose**: Modal component for viewing and editing user profiles
- **Used By**: Dashboard
- **Features**:
  - Profile information display
  - Profile editing form
  - Resume upload functionality
  - Bio, skills, and experience management

#### **`/pages`** Directory

Page-level components representing different routes:

##### **`Login.jsx`**
- **Purpose**: User authentication page
- **Route**: `/login`
- **Features**:
  - Email/password login form
  - JWT token storage
  - Redirect to dashboard on success
  - Error handling

##### **`Signup.jsx`**
- **Purpose**: User registration page
- **Route**: `/signup`
- **Features**:
  - User registration form
  - Role selection (user/recruiter)
  - Password validation
  - Account creation with API

##### **`Dashboard.jsx`**
- **Purpose**: Main application dashboard (role-based)
- **Route**: `/dashboard`
- **Features**:
  - **For Recruiters**:
    - Job posting management
    - View applications for posted jobs
    - Update application statuses
    - Analytics dashboard
  - **For Job Seekers**:
    - Browse available jobs
    - Apply for jobs
    - Track application status
    - View application analytics
  - Profile management
  - Notification system
  - Protected route (requires authentication)

---

## ⚙️ Backend Structure (`/backend`)

The backend is an **Express.js** server with **MongoDB** database using **Mongoose** for data modeling.

### Root Level Files

- **`index.js`** - Server entry point and Express app configuration
- **`package.json`** - Backend dependencies and scripts
- **`seed.js`** - Database seeding script for sample data
- **`.env`** - Environment variables (not in repo, create locally)

### **`index.js`** (Server Entry Point)

- **Purpose**: Main server file that starts the Express application
- **Responsibilities**:
  - Initializes Express app
  - Configures middleware (CORS, JSON parsing)
  - Sets up static file serving for uploads
  - Registers API routes
  - Connects to MongoDB database
  - Starts the HTTP server
  - Error handling

### **`/config`** Directory

Configuration files for external services:

#### **`db.js`**
- **Purpose**: MongoDB database connection configuration
- **Responsibilities**:
  - Establishes connection to MongoDB
  - Handles connection errors
  - Exports connection function
  - Uses `MONGO_URI` from environment variables

### **`/models`** Directory

Mongoose schemas defining the database structure:

#### **`User.js`**
- **Purpose**: User model schema
- **Fields**:
  - `name` - User's full name
  - `email` - Unique email address
  - `password` - Hashed password
  - `role` - User role (user/recruiter)
  - `bio` - User biography
  - `skills` - User skills
  - `experience` - Work experience
  - `resume` - Path to uploaded resume file
- **Methods**: Password hashing, JWT token generation

#### **`Job.js`**
- **Purpose**: Job posting model schema
- **Fields**:
  - `company` - Company name
  - `position` - Job position title
  - `status` - Job status (pending, interview, declined, offer)
  - `jobType` - Type of job (full-time, part-time, remote, internship)
  - `jobLocation` - Job location
  - `createdBy` - Reference to User (recruiter)
  - `createdAt`, `updatedAt` - Timestamps
- **Indexes**: Optimized queries by status, jobType, location

#### **`Application.js`**
- **Purpose**: Job application model schema
- **Fields**:
  - `job` - Reference to Job
  - `applicant` - Reference to User (job seeker)
  - `recruiter` - Reference to User (recruiter)
  - `status` - Application status (applied, shortlisted, interview, rejected, hired)
  - `createdAt`, `updatedAt` - Timestamps
- **Indexes**: Prevents duplicate applications, optimizes queries

#### **`Notification.js`**
- **Purpose**: Notification model schema
- **Fields**:
  - `user` - Reference to User (notification recipient)
  - `message` - Notification message
  - `type` - Notification type
  - `relatedApplication` - Reference to Application (if applicable)
  - `read` - Read/unread status
  - `createdAt` - Timestamp

### **`/routes`** Directory

API route definitions that map URLs to controller functions:

#### **`authRoutes.js`**
- **Purpose**: Authentication-related routes
- **Endpoints**:
  - `POST /api/auth/signup` - User registration
  - `POST /api/auth/login` - User login
- **Middleware**: None (public routes)

#### **`jobRoutes.js`**
- **Purpose**: Job management routes
- **Endpoints**:
  - `GET /api/jobs` - Get all jobs (filtered by role)
  - `POST /api/jobs` - Create new job (recruiter only)
  - `PATCH /api/jobs/:id` - Update job (recruiter only, owner)
  - `DELETE /api/jobs/:id` - Delete job (recruiter only, owner)
- **Middleware**: `authMiddleware` (authentication required)

#### **`applicationRoutes.js`**
- **Purpose**: Application management routes
- **Endpoints**:
  - `POST /api/applications` - Apply for a job (user only)
  - `GET /api/applications` - Get all applications (filtered by role)
  - `PATCH /api/applications/:id/status` - Update status (recruiter only)
  - `GET /api/applications/analytics` - Get application statistics
  - `GET /api/applications/notifications` - Get user notifications
  - `PATCH /api/applications/notifications/:id/read` - Mark notification as read
- **Middleware**: `authMiddleware` (authentication required)

#### **`userRoutes.js`**
- **Purpose**: User profile management routes
- **Endpoints**:
  - `GET /api/users/profile` - Get current user profile
  - `PATCH /api/users/profile` - Update user profile
  - `POST /api/users/upload-resume` - Upload resume file
- **Middleware**: `authMiddleware` (authentication required)

### **`/controllers`** Directory

Business logic for handling requests and responses:

#### **`authController.js`**
- **Purpose**: Authentication logic
- **Functions**:
  - `signup` - Register new user, hash password, generate JWT
  - `login` - Authenticate user, verify password, return JWT
- **Error Handling**: Validation errors, duplicate email, invalid credentials

#### **`jobController.js`**
- **Purpose**: Job CRUD operations
- **Functions**:
  - `getAllJobs` - Fetch jobs (filtered by user role)
  - `createJob` - Create new job posting (recruiter only)
  - `updateJob` - Update job details (owner only)
  - `deleteJob` - Delete job posting (owner only)
- **Authorization**: Role-based and ownership checks

#### **`applicationController.js`**
- **Purpose**: Application management logic
- **Functions**:
  - `applyForJob` - Create new application (user only)
  - `getAllApplications` - Fetch applications (role-based filtering)
  - `updateApplicationStatus` - Update status (recruiter only)
  - `getAnalytics` - Calculate application statistics
  - `getNotifications` - Fetch user notifications
  - `markNotificationRead` - Mark notification as read
- **Features**: Duplicate prevention, notification creation

#### **`userController.js`**
- **Purpose**: User profile management
- **Functions**:
  - `getProfile` - Get current user profile
  - `updateProfile` - Update user information
  - `uploadResume` - Handle resume file upload
- **File Handling**: Multer for file uploads

### **`/middleware`** Directory

Express middleware functions:

#### **`authMiddleware.js`**
- **Purpose**: JWT authentication middleware
- **Functionality**:
  - Verifies JWT token from Authorization header
  - Attaches user information to request object
  - Protects routes requiring authentication
  - Handles invalid/expired tokens

#### **`uploadMiddleware.js`**
- **Purpose**: File upload configuration
- **Functionality**:
  - Configures Multer for file uploads
  - Handles resume file uploads
  - File validation and storage
  - Sets upload destination and file naming

### **`/utils`** Directory

Utility functions and helper modules:

#### **`emailService.js`**
- **Purpose**: Email sending functionality
- **Features**:
  - Nodemailer configuration
  - Email templates
  - Notification emails
  - Status update emails
- **Note**: Requires email credentials in `.env`

### **`/uploads`** Directory

Storage for uploaded files:

- **`/resumes`** - Uploaded resume files (PDFs, DOCX, etc.)
- **Note**: This directory is created automatically and should be in `.gitignore`

---

## 🔄 Data Flow

### Authentication Flow

1. User submits login/signup form → `Login.jsx` / `Signup.jsx`
2. Frontend sends request → `POST /api/auth/login` or `/api/auth/signup`
3. Backend processes → `authController.js`
4. JWT token returned → Stored in localStorage
5. Token included in subsequent requests → `authMiddleware.js` validates

### Job Application Flow

1. **Job Seeker**:
   - Views jobs → `Dashboard.jsx` fetches from `GET /api/jobs`
   - Clicks apply → `JobItem.jsx` sends `POST /api/applications`
   - `applicationController.js` creates application
   - Notification created for recruiter
   - Status tracked in `Dashboard.jsx`

2. **Recruiter**:
   - Creates job → `JobForm.jsx` sends `POST /api/jobs`
   - Views applications → `GET /api/applications` (filtered by recruiter)
   - Updates status → `PATCH /api/applications/:id/status`
   - Notification created for applicant

### File Upload Flow

1. User selects resume → `ProfileModal.jsx`
2. FormData sent → `POST /api/users/upload-resume`
3. `uploadMiddleware.js` processes file
4. File saved to `/uploads/resumes`
5. File path stored in User model
6. File served statically via `/uploads` route

---

## 🔐 Security Architecture

### Authentication
- **JWT Tokens**: Stateless authentication
- **Password Hashing**: bcrypt with salt rounds
- **Token Storage**: localStorage (frontend)
- **Token Validation**: Middleware on protected routes

### Authorization
- **Role-Based Access Control (RBAC)**:
  - `user` role: Can apply for jobs, view own applications
  - `recruiter` role: Can create jobs, manage applications
- **Ownership Checks**: Recruiters can only modify their own jobs

### File Upload Security
- File type validation
- File size limits
- Secure file naming
- Static file serving with proper headers

---

## 📦 Dependencies Overview

### Frontend Key Dependencies
- `react` - UI library
- `react-router-dom` - Client-side routing
- `vite` - Build tool and dev server
- `tailwindcss` - CSS framework

### Backend Key Dependencies
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT authentication
- `bcrypt` - Password hashing
- `multer` - File upload handling
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management
- `nodemailer` - Email functionality

---

## 🗂️ Environment Variables

### Backend `.env` File Structure

```env
PORT=3000                          # Server port
MONGO_URI=mongodb://...            # MongoDB connection string
JWT_SECRET=your_secret_key         # JWT signing secret
EMAIL_HOST=smtp.gmail.com          # Email server (optional)
EMAIL_PORT=587                     # Email port (optional)
EMAIL_USER=your_email@gmail.com    # Email username (optional)
EMAIL_PASS=your_app_password       # Email password (optional)
```

---

## 🚀 Development Workflow

### Starting Development

1. **Backend**:
   ```bash
   cd backend
   npm install
   # Create .env file
   npm start
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### File Organization Principles

- **Separation of Concerns**: Frontend and backend are completely separate
- **Component-Based**: React components are modular and reusable
- **MVC Pattern**: Backend follows Model-View-Controller pattern
- **RESTful API**: Backend provides RESTful endpoints
- **Single Responsibility**: Each file has a clear, single purpose

---

## 📝 Notes

- The frontend and backend run on different ports (5173 and 3000 by default)
- CORS is enabled to allow frontend-backend communication
- All API routes are prefixed with `/api`
- Protected routes require JWT token in Authorization header
- File uploads are stored in `backend/uploads` directory
- Database models use Mongoose schemas with validation
- Error handling is implemented at both controller and middleware levels

---

## 🔍 Quick Reference

### Finding Files by Functionality

- **Authentication**: `frontend/src/pages/Login.jsx`, `backend/controllers/authController.js`
- **Job Management**: `frontend/src/components/JobForm.jsx`, `backend/controllers/jobController.js`
- **Applications**: `frontend/src/components/JobItem.jsx`, `backend/controllers/applicationController.js`
- **User Profile**: `frontend/src/components/ProfileModal.jsx`, `backend/controllers/userController.js`
- **Notifications**: `frontend/src/components/NotificationBell.jsx`, `backend/models/Notification.js`
- **Database Models**: `backend/models/`
- **API Routes**: `backend/routes/`
- **Middleware**: `backend/middleware/`

---

**Last Updated**: Based on CareerFlow v1.0.0 structure

