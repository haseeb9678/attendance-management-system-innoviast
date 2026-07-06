<div align="center">

# 📚 Attendix

### A modern, role-based Attendance Management System

*Built during the InnoViast Full-Stack Product Engineering Internship*

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![PNPM](https://img.shields.io/badge/PNPM-F69220?style=for-the-badge&logo=pnpm&logoColor=white)

<br/>

![Status](https://img.shields.io/badge/status-active--development-blueviolet?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-black?style=flat-square)
![Architecture](https://img.shields.io/badge/architecture-monorepo-informational?style=flat-square)

</div>

---

## ✨ Overview

**Attendix** centralizes attendance operations for educational institutes, academies, bootcamps, and organizations into a single, elegant platform — with dedicated experiences for **Admins**, **Instructors**, and **Students**.

Built with a **monorepo architecture**, sharing types and validation logic across the full stack, Attendix is designed to feel production-grade from day one: consistent contracts, modular domains, and analytics-ready data at every layer.

<table>
<tr>
<td width="33%" valign="top">

### 🛡️ Admin
Manage departments, classes, subjects, users, and teacher assignments. Full system-wide visibility with live analytics.

</td>
<td width="33%" valign="top">

### 🎓 Instructor
Manage assigned classes, create attendance sessions, mark attendance, and track session history.

</td>
<td width="33%" valign="top">

### 🧑‍🎓 Student
View personal attendance records and academic activity through a focused, simple dashboard.

</td>
</tr>
</table>

---

## 🧩 Core Capabilities

| Domain | What it does |
|---|---|
| 🔐 **Auth & Access** | JWT-based authentication, RBAC, protected routes, Argon2 password hashing, shared Zod validation |
| 👥 **User Management** | Admin / Instructor / Student management, filtering, status control, role-specific access |
| 🏫 **Academic Structure** | Departments, Classes, Subjects, Teacher Assignments |
| 🗓️ **Attendance Engine** | Session creation, attendance marking (Present / Absent / Late / Excused), history & summaries |
| 📊 **Dashboards** | Role-specific dashboards with charts, trends, and recent-activity feeds |
| 📈 **Analytics** | Aggregated attendance stats, chart-ready API responses, session insights |

---

## 🖥️ Dashboards at a Glance

**Admin** — system-wide overview cards, attendance distribution charts, role distribution, monthly trends, recent users/sessions/assignments

**Instructor** — assigned classes & subjects, student/session counts, upcoming & recent sessions, class summaries

**Student** — personal attendance overview and academic activity, streamlined for quick access

---

## 🏗️ Architecture

Attendix uses a **PNPM-powered monorepo**, keeping frontend, backend, and shared logic in one coherent codebase.

```text
Attendix/
│
├── apps/
│   ├── api/                     → Express + TypeScript backend
│   └── web/                     → React + TypeScript frontend
│
├── packages/
│   ├── shared-types/            → Shared TypeScript contracts
│   └── shared-zod/              → Shared Zod validation schemas
│
└── docs/                        → Architecture notes & diagrams
```

**Why it matters:** one source of truth for types and validation means the frontend and backend can never silently drift apart — a bug class most full-stack apps never fully eliminate.

---

## 🛠️ Tech Stack

<table>
<tr>
<td valign="top" width="50%">

**Frontend**
- React + TypeScript + Vite
- Tailwind CSS
- React Router DOM
- React Hook Form + Zod
- TanStack-style data flows via Axios
- Recharts (analytics visualizations)
- Framer Motion (UI motion)
- Lucide React (icons)

</td>
<td valign="top" width="50%">

**Backend**
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- JWT (access + refresh token flow)
- Argon2 password hashing
- Zod (shared validation)
- Upstash QStash (scheduled/session jobs)

</td>
</tr>
</table>

**Monorepo tooling:** PNPM Workspaces · Shared Types Package · Shared Zod Package

---

## 🗄️ Data Model (Simplified)

<details>
<summary><strong>Click to expand core schemas</strong></summary>

```ts
// User
{
  fullName: string;
  email: string;
  password: string;
  role: "admin" | "instructor" | "student";
  status: "active" | "inactive";
}

// Department
{ name: string; code: string; }

// Class
{ name: string; code: string; department: ObjectId; }

// Subject
{ name: string; code: string; }

// TeacherAssignment
{
  instructor: ObjectId;
  class: ObjectId;
  subject: ObjectId;
  department: ObjectId;
  status: "active" | "inactive";
}

// Session
{
  teacherAssignment: ObjectId;
  date: Date;
  startTime: string;
  endTime: string;
  room: string;
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
}

// Attendance
{
  session: ObjectId;
  student: ObjectId;
  status: "present" | "absent" | "late" | "excused";
}
```

</details>

---

## ⚙️ Getting Started

**1. Clone the repository**
```bash
git clone <repository-url>
cd Attendix
```

**2. Install dependencies**
```bash
pnpm install
```

**3. Run the backend**
```bash
cd apps/api
pnpm dev
```

**4. Run the frontend**
```bash
cd apps/web
pnpm dev
```

---

## 🔐 Environment Variables

Create a `.env` file inside `apps/api` with the following keys:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_connection_string

# Client
CLIENT_URL=http://localhost:5173

# Auth — Access Token
JWT_ACCESS_SECRET=your_access_token_secret
JWT_ACCESS_EXPIRES_IN=15m

# Auth — Refresh Token
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRES_IN=7d

# Cookie Expiry (ms)
ACCESS_COOKIE_MAX_AGE=900000    # 15 minutes
REFRESH_COOKIE_MAX_AGE=604800000 # 7 days

# Scheduled Jobs
CRON_SECRET=your_cron_job_secret
```

And inside `apps/web`:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

> ⚠️ Never commit real `.env` values. Use `.env.example` files with placeholder keys only — exactly as shown above.

---

## 📊 Implementation Status

<table>
<tr>
<td valign="top" width="50%">

### ✅ Completed
- Monorepo & shared package architecture
- React + Vite + Tailwind frontend foundation
- Express + TypeScript backend foundation
- JWT auth flow with RBAC
- Users, Departments, Classes, Subjects, Assignments, Sessions, Attendance modules
- Admin & Instructor dashboard APIs
- Attendance analytics aggregation
- Chart-ready dashboard responses

</td>
<td valign="top" width="50%">

### 🚧 In Progress
- Student dashboard enhancements
- Advanced attendance analytics & filters
- CSV / Excel export
- Refresh token flow improvements
- Additional dashboard visualizations

### 📅 Planned
- Email notifications & reminders
- Audit logs
- Automated testing (unit/integration)
- CI/CD pipeline
- Dark mode

</td>
</tr>
</table>

---

## 🚀 Deployment

| Layer | Platform |
|---|---|
| Frontend | Vercel / Netlify |
| Backend | Render / Railway / VPS |
| Database | MongoDB Atlas |
| Scheduled Jobs | Upstash QStash |

---

## 👨‍💻 Author

**Haseeb Ali**
Full-Stack Developer Intern @ InnoViast

Focused on scalable architecture, reusable shared packages, and production-style code organization in modern dashboard-driven applications.

<p align="left">
<a href="https://github.com/haseeb9678" target="_blank"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" /></a>
<a href="https://linkedin.com/in/haseeb963" target="_blank"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" /></a>
</p>

---

<div align="center">

*This project is actively evolving — the README reflects current architecture and implemented modules as development continues.*

</div>