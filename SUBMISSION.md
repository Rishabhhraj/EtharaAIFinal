# Assignment submission — Team Task Manager (EtharaAI)

Use this document when submitting the full-stack MERN assignment. All primary links are listed below.

---

## Required deliverables

| # | Deliverable | Link / status |
|---|-------------|---------------|
| 1 | **Live deployed application** | [https://web-production-871fd.up.railway.app](https://web-production-871fd.up.railway.app) |
| 2 | **GitHub source code** | [https://github.com/Rishabhhraj/EtharaAIFinal](https://github.com/Rishabhhraj/EtharaAIFinal) |
| 3 | **README** (setup, API, features) | [README.md](./README.md) in repository |
| 4 | **Deployment documentation** | [DEPLOYMENT.md](./DEPLOYMENT.md) |
| 5 | **Demo video** (2–5 minutes) | _Add your video URL here after recording_ |

**API health (verify deployment):**  
[https://web-production-871fd.up.railway.app/api/health](https://web-production-871fd.up.railway.app/api/health)

---

## Project summary

**Team Task Manager** is a MERN application that lets teams organize work into **projects** and **tasks** with clear **admin** and **member** roles.

- **Admins** create projects, manage teams, create tasks, multi-assign members, set priority, approve status requests, archive projects, and view full dashboards.
- **Members** access assigned projects, work on tasks assigned to them, submit status change requests for admin approval, comment on tasks, and receive in-app notifications.

**Stack:** MongoDB, Express, React (Vite), Node.js — deployed on **Railway** with MongoDB plugin.

**Author:** Rishabhhraj — [GitHub profile](https://github.com/Rishabhhraj)

---

## Requirements coverage

| Requirement | Implementation |
|-------------|----------------|
| User authentication | JWT signup/login, protected routes, session expiry handling |
| Role-based access | `admin` / `member` roles with middleware and project-level checks |
| Project management | CRUD, team members, archive/restore |
| Task management | CRUD, status (`todo`, `in_progress`, `done`), priority, due dates |
| Task assignment | Single and **multi-assign**; reassign after creation |
| Member status workflow | Status change requests with admin approve/reject |
| Dashboard | Stats, overdue, due in 3 days, priority sorting |
| Notifications | Bell icon; assignment, approval, comments |
| Comments | Per-task threads |
| User profile | Dedicated `/profile` page |
| Production deploy | Railway — single service, env-configured MongoDB |
| Security | bcrypt, JWT, validation, rate limit, CORS, admin invite code |

---

## Suggested demo video script (2–5 min)

Record against the **live site**: [https://web-production-871fd.up.railway.app](https://web-production-871fd.up.railway.app)

1. **Intro (15 s)** — App name, live URL, your name.
2. **Admin signup (30 s)** — Register, note first user is admin.
3. **Project & team (45 s)** — Create project, add a member (second account or pre-created).
4. **Tasks (60 s)** — Create task, set priority/due date, **multi-assign** members, change priority after create.
5. **Member flow (45 s)** — Log in as member, request status change, show pending badge.
6. **Admin approval (30 s)** — Approve request, show notification bell.
7. **Dashboard & profile (30 s)** — Stats, overdue/due soon; open profile page.
8. **Extras (optional)** — Comment on task, archive project (read-only), logout.

Paste your video link below when ready:

```
Demo video: <YOUR_YOUTUBE_OR_DRIVE_LINK>
```

---

## How to run locally (for graders)

```bash
git clone https://github.com/Rishabhhraj/EtharaAIFinal.git
cd EtharaAIFinal
npm run install:all
cp backend/.env.example backend/.env
# Edit backend/.env — set MONGODB_URI and JWT_SECRET
npm run dev:backend   # terminal 1
npm run dev:frontend  # terminal 2
```

Open [http://localhost:3000](http://localhost:3000).

Details: [README.md](./README.md)

---

## Production environment (Railway)

| Variable | Set on web service |
|----------|-------------------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | From Railway MongoDB plugin |
| `JWT_SECRET` | Strong random secret |
| `CLIENT_URL` | `https://web-production-871fd.up.railway.app` |

Redeploy guide: [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## Repository commits

Main branch: `main` at [EtharaAIFinal](https://github.com/Rishabhhraj/EtharaAIFinal)

Includes: auth, RBAC, projects, tasks, status requests, notifications, comments, profile, multi-assign, security hardening, and Railway configuration.

---

## Contact

**GitHub:** [Rishabhhraj](https://github.com/Rishabhhraj)  
**Repository:** [EtharaAIFinal](https://github.com/Rishabhhraj/EtharaAIFinal)  
**Live app:** [web-production-871fd.up.railway.app](https://web-production-871fd.up.railway.app)
