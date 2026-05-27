# Team Task Manager (EtharaAI)

A full-stack **MERN** team task management application with **JWT authentication**, **admin/member RBAC**, projects, multi-assign tasks, status approval workflow, notifications, comments, and a production deployment on **Railway**.

---

## Quick links (submission)

| Resource | URL |
|----------|-----|
| **Live application** | [https://web-production-871fd.up.railway.app](https://web-production-871fd.up.railway.app) |
| **API health check** | [https://web-production-871fd.up.railway.app/api/health](https://web-production-871fd.up.railway.app/api/health) |
| **GitHub repository** | [https://github.com/Rishabhhraj/EtharaAIFinal](https://github.com/Rishabhhraj/EtharaAIFinal) |
| **Deployment guide** | [DEPLOYMENT.md](./DEPLOYMENT.md) |
| **Submission packet** | [SUBMISSION.md](./SUBMISSION.md) |

**Author:** Rishabhhraj ([GitHub](https://github.com/Rishabhhraj))

---

## Features

| Feature | Description |
|---------|-------------|
| **Authentication** | Signup/login with JWT; bcrypt password hashing; session-expired redirect |
| **RBAC** | **Admin** — full project/task control. **Member** — project access when added; dashboard shows **only their assigned tasks** |
| **Projects & teams** | Admins create projects, add/remove members, archive/restore projects |
| **Tasks** | Create, update priority/status, due dates, delete; **multi-assign / reassign** after creation |
| **Status requests** | Members request status changes; admins approve or reject (confirm on reject) |
| **Dashboard** | Stats, status bars, overdue tasks, **due in 3 days**, priority-sorted lists |
| **Notifications** | In-app bell: assigned, status approved/rejected, new comments |
| **Comments** | Per-task threads for admin ↔ member communication |
| **User profile** | `/profile` — account details, stats, project list |
| **Project archive** | `active` / `archived` (archived = read-only) |
| **Task priority** | `low` \| `medium` \| `high` |
| **UX** | Toasts, loading skeletons, password show/hide + strength hint, responsive layout |

---

## Tech stack

- **MongoDB** + Mongoose
- **Express** — REST API, validation, rate limiting, CORS
- **React** (Vite) + React Router
- **Node.js** 18+
- **Railway** — hosting (single service: API + static frontend)

---

## Project structure

```
├── backend/           # Express API, models, controllers, middleware
├── frontend/          # React (Vite) SPA
├── scripts/           # Local MongoDB helpers (Windows)
├── railway.json       # Railway build/start config
├── DEPLOYMENT.md      # Railway setup steps
├── SUBMISSION.md      # Assignment submission summary
└── README.md
```

---

## Getting started locally

### Prerequisites

- Node.js 18+
- MongoDB (local, portable script, Atlas, or embedded — see below)

### 1. Clone

```bash
git clone https://github.com/Rishabhhraj/EtharaAIFinal.git
cd EtharaAIFinal
```

### 2. Install

```bash
npm run install:all
```

### 3. Environment

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` (see [backend/.env.example](./backend/.env.example)):

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/team-task-manager
USE_EMBEDDED_MONGO=false
JWT_SECRET=your_local_secret
NODE_ENV=development
CLIENT_URL=http://localhost:3000
ADMIN_INVITE_CODE=your_optional_admin_code
AUTH_RATE_LIMIT_MAX=30
```

### 4. MongoDB (Windows options)

**Portable (recommended):**

```powershell
powershell -ExecutionPolicy Bypass -File scripts/setup-portable-mongo.ps1
powershell -ExecutionPolicy Bypass -File scripts/start-mongo.ps1
```

**Atlas:** set `MONGODB_URI` to your Atlas connection string.

**Embedded (no install, data lost on restart):** `USE_EMBEDDED_MONGO=true`

### 5. Run

```bash
# Terminal 1
npm run dev:backend

# Terminal 2
npm run dev:frontend
```

Open [http://localhost:3000](http://localhost:3000).

### Demo workflow

1. **Sign up** — first account becomes **admin**.
2. **Sign up** a second user as **member** (incognito / different email).
3. **Admin:** create project → add member → create tasks → multi-assign assignees → set priority/due date.
4. **Member:** open project → request status change → admin approves.
5. **Dashboard**, **Profile**, **notifications**, **comments**, **archive** a project.

---

## API reference

Base URL (local): `http://localhost:5000/api`  
Base URL (production): `https://web-production-871fd.up.railway.app/api`

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Sign up (first user = admin; optional `adminInviteCode`) |
| POST | `/auth/login` | Login |
| GET | `/auth/me` | Current user |
| GET | `/auth/profile` | Profile + stats + projects |

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/projects` | List projects |
| POST | `/projects` | Create (admin) |
| GET | `/projects/:id` | Details |
| PUT | `/projects/:id` | Update; `status`: `active` \| `archived` |
| DELETE | `/projects/:id` | Delete (admin) |
| POST | `/projects/:id/members` | Add members |
| DELETE | `/projects/:id/members/:memberId` | Remove member |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks/project/:projectId` | List tasks |
| POST | `/tasks/project/:projectId` | Create (admin); body: `assigneeIds[]`, `priority`, `dueDate` |
| PUT | `/tasks/:id` | Update (admin); `assigneeIds[]` for multi-assign/reassign |
| DELETE | `/tasks/:id` | Delete (admin) |

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | Stats, overdue, due soon (3 days), recent tasks |

### Status requests

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/status-requests/project/:id/pending` | Pending (admin) |
| GET | `/status-requests/project/:id` | Member’s requests |
| POST | `/status-requests/task/:taskId` | Submit request |
| PATCH | `/status-requests/:id/approve` | Approve |
| PATCH | `/status-requests/:id/reject` | Reject |

### Notifications & comments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notifications` | List + unread count |
| PATCH | `/notifications/:id/read` | Mark read |
| PATCH | `/notifications/read-all` | Mark all read |
| GET | `/comments/task/:taskId` | List comments |
| POST | `/comments/task/:taskId` | Add comment |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/members` | List members (admin) |

---

## Admin vs member

| Area | Admin | Member |
|------|--------|--------|
| Projects | Create, archive, delete, manage team | View projects they belong to |
| Tasks | Create, multi-assign, priority, status, delete | View all tasks; **status change via request** on assigned tasks only |
| Dashboard | All tasks in their projects | **Only tasks where they are an assignee** |
| Archived project | Can restore | Read-only |

---

## Production deployment (Railway)

Deployed as one service (API + React build). Full steps: **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

**Production URL:** [https://web-production-871fd.up.railway.app](https://web-production-871fd.up.railway.app)

Required env vars on the **web** service:

| Variable | Purpose |
|----------|---------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | Railway MongoDB connection string |
| `JWT_SECRET` | Strong secret |
| `CLIENT_URL` | `https://web-production-871fd.up.railway.app` |

Build/start (from `railway.json`):

- `npm run install:all && npm run build`
- `npm start`

---

## Security

- Bcrypt password hashing
- JWT authentication on protected routes
- RBAC + project membership checks
- `express-validator` input validation
- ObjectId validation on route params
- Auth rate limiting (`/api/auth/*`)
- CORS restricted via `CLIENT_URL` in production
- Admin signup gated by first-user rule + optional `ADMIN_INVITE_CODE`

---

## Assignment submission

See **[SUBMISSION.md](./SUBMISSION.md)** for the complete checklist, demo script, and links for your instructor.

---

## License

MIT
