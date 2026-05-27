# Railway deployment guide

Deploy **Team Task Manager** as a single web service (API + React static build).

## Live deployment

| | URL |
|---|-----|
| **Application** | [https://web-production-871fd.up.railway.app](https://web-production-871fd.up.railway.app) |
| **Health check** | [https://web-production-871fd.up.railway.app/api/health](https://web-production-871fd.up.railway.app/api/health) |
| **Source code** | [https://github.com/Rishabhhraj/EtharaAIFinal](https://github.com/Rishabhhraj/EtharaAIFinal) |

---

## Prerequisites

- GitHub repo: [EtharaAIFinal](https://github.com/Rishabhhraj/EtharaAIFinal)
- [Railway](https://railway.app) account

---

## 1. Create Railway project

1. **New Project** → **Deploy from GitHub repo** → select **EtharaAIFinal**.
2. Railway detects `railway.json` and runs:
   - **Build:** `npm run install:all && npm run build`
   - **Start:** `npm start` (Express serves API + `frontend/dist`)

---

## 2. Add MongoDB

1. In the same project, **+ New** → **Database** → **MongoDB**.
2. Open the MongoDB service → **Variables** → copy `MONGO_URL` or `MONGODB_URI`.

---

## 3. Configure web service variables

On the **web** service (not the database), set:

| Variable | Value |
|----------|--------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | Paste connection string **or** reference `${{MongoDB.MONGO_URL}}` |
| `JWT_SECRET` | Long random string (32+ characters) |
| `CLIENT_URL` | `https://web-production-871fd.up.railway.app` |
| `ADMIN_INVITE_CODE` | Optional (extra admin signups) |
| `AUTH_RATE_LIMIT_MAX` | Optional; default `30` |

Do **not** set `USE_EMBEDDED_MONGO` in production.

---

## 4. Generate public domain

1. Web service → **Settings** → **Networking** → **Generate Domain**.
2. If your domain differs from the example above, update `CLIENT_URL` to match exactly (no trailing slash).
3. Redeploy after changing `CLIENT_URL`.

---

## 5. Verify deployment

1. [https://web-production-871fd.up.railway.app/api/health](https://web-production-871fd.up.railway.app/api/health) → `{"success":true,...}`
2. [https://web-production-871fd.up.railway.app](https://web-production-871fd.up.railway.app) → login/signup UI
3. Sign up (first user = admin) → create project → create task

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `FATAL: JWT_SECRET is required` | Set `JWT_SECRET` on **web** service |
| `FATAL: MONGODB_URI is required` | Set `MONGODB_URI` (paste full URL, not empty reference) |
| Build fails | Check deploy logs; Node 18+ required |
| CORS errors | `CLIENT_URL` must match browser URL exactly |
| Blank page | Confirm `frontend/dist` built in deploy logs |

---

## Submission

For assignment hand-in, see **[SUBMISSION.md](./SUBMISSION.md)** and **[README.md](./README.md)**.
