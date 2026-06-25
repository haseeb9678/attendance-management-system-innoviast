# 📚 Attendance Management System

A modern, scalable full-stack Attendance Management System developed during the **InnoViast Full-Stack Product Engineering Internship**. The project follows a production-oriented monorepo architecture and demonstrates modern web development practices using React, Node.js, TypeScript, MongoDB, and shared packages.

---

## 🚀 Project Overview

The Attendance Management System is designed to simplify attendance management for educational institutes, bootcamps, and organizations.

It provides a secure, role-based platform where administrators, instructors, and students can efficiently manage classes, record attendance, and monitor attendance records.

This project emphasizes scalability, maintainability, and code reusability by using a monorepo architecture with shared types and validation schemas.

---

# ✨ Features

## Authentication & Authorization

* JWT-based Authentication
* Role-Based Access Control (RBAC)
* Secure Password Hashing
* Refresh Token Authentication *(Planned)*

## Attendance Management

* Create and Manage Classes
* Create Attendance Sessions
* Mark Attendance
* Present, Absent & Late Status
* Attendance History
* Attendance Analytics *(Planned)*

## User Management

* Admin Management
* Instructor Management
* Student Management
* Profile Management *(Planned)*

## Reporting

* Attendance Reports
* Date Filtering
* Class Filtering
* Student Filtering
* CSV Export *(Planned)*

## Dashboard

* Admin Dashboard
* Instructor Dashboard
* Student Dashboard

---

# 🛠 Tech Stack

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router
* React Hook Form
* Zod
* Axios

## Backend

* Node.js
* Express.js
* TypeScript
* MongoDB
* Mongoose
* JWT
* Zod
* Argon2

## Architecture

* PNPM Workspaces
* Monorepo Architecture
* Feature-Based Folder Structure
* Shared Type Definitions
* Shared Zod Validation Schemas
* REST API

---

# 📂 Project Structure

```text
attendance-management-system/
│
├── apps/
│   ├── api/
│   └── web/
│
├── packages/
│   ├── shared-types/
│   └── shared-zod/
│
└── docs/
```

---

# ⚙️ Getting Started

## Clone Repository

```bash
git clone <repository-url>
cd AttendanceManagementSystem-InnoViast
```

## Install Dependencies

```bash
pnpm install
```

## Start Backend

```bash
cd apps/api
pnpm dev
```

## Start Frontend

```bash
cd apps/web
pnpm dev
```

---

# 🗄 Database Models

## User

```ts
{
  name: string;
  email: string;
  password: string;
  role: "admin" | "instructor" | "student";
  refreshTokenHash: string;
}
```

## Class

```ts
{
  title: string;
  instructor: ObjectId;
  students: ObjectId[];
}
```

## Attendance

```ts
{
  sessionId: ObjectId;
  studentId: ObjectId;
  status: "present" | "absent" | "late";
}
```

---

# 📌 Current Development Status

## ✅ Completed

* Monorepo Setup (PNPM Workspaces)
* React + Vite Setup
* Express.js Backend Setup
* TypeScript Configuration
* Shared Types Package
* Shared Zod Validation Package
* Project Folder Architecture
* Environment Configuration
* Basic Server Configuration
* Tailwind CSS Setup
* React Router Setup

## 🚧 In Progress

* Authentication API
* Authorization Middleware
* Database Models
* JWT Authentication
* User Management

## 📅 Planned

* Attendance Module
* Dashboard
* Reports & Analytics
* File Export
* Testing
* Deployment

---

# 📸 Screenshots

Screenshots will be added as development progresses.

---

# 🚀 Deployment

Coming Soon

---

# 👨‍💻 Author

**Haseeb Ali**

Full-Stack Developer Intern @ InnoViast
