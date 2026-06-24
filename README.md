# Attendance Management System

A full-stack Attendance Management System developed as part of the InnoViast Full-Stack Product Engineering Internship.

## Overview

The Attendance Management System provides a role-based attendance workflow for educational institutes, bootcamps, and organizations. The platform enables administrators and instructors to manage classes, record attendance, generate reports, and track attendance history.

## Features

### Authentication & Authorization

* Role-based access control
* Admin, Instructor, and Student roles
* Secure authentication (JWT) *(Planned)*

### Attendance Management

* Create classes and sessions
* Mark attendance (Present, Absent, Late)
* Attendance history tracking
* Attendance analytics *(Planned)*

### Reporting

* Filter attendance by date
* Filter by class
* Filter by user
* Filter by attendance status
* CSV export *(Planned)*

### Dashboard

* Admin dashboard *(Planned)*
* Instructor dashboard *(Planned)*
* Student dashboard *(Planned)*

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router
* React Hook Form
* Zod

### Backend

* Node.js
* Express.js
* TypeScript
* MongoDB
* JWT Authentication
* Zod Validation

### Architecture

* Monorepo (pnpm Workspaces)
* Feature-Based Frontend Architecture
* Shared Validation Schemas
* Shared Types

## Project Structure

```text
apps/
├── web
└── api

packages/
├── shared-types
└── shared-zod

docs/
```

## Setup Instructions

### Clone Repository

```bash
git clone <repository-url>
cd Attendance-System-InnoViast
```

### Install Dependencies

```bash
pnpm install
```

### Start Frontend

```bash
cd apps/web
pnpm dev
```

### Start Backend

```bash
cd apps/api
pnpm dev
```

## Database Schema

### User

```ts
{
  name: string;
  email: string;
  password: string;
  role: "admin" | "instructor" | "student";
}
```

### Class

```ts
{
  title: string;
  instructor: ObjectId;
  students: ObjectId[];
}
```

### Attendance

```ts
{
  sessionId: ObjectId;
  studentId: ObjectId;
  status: "present" | "absent" | "late";
}
```

## Screenshots

### Login Page

Coming Soon

### Dashboard

Coming Soon

### Attendance Management

Coming Soon

## Deployment Link

Coming Soon

## Current Progress

### Week 1

* [x] Monorepo setup
* [x] React + TypeScript setup
* [x] Tailwind CSS setup
* [x] React Router setup
* [ ] Authentication
* [ ] Backend API
* [ ] Database Integration
* [ ] Attendance Module
* [ ] Reports Module
* [ ] Deployment

## Author

Haseeb Ali
