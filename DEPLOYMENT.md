# SkillGap — Deployment Guide

This guide covers deploying the **SkillGap** application to:

- **Frontend** → [Vercel](https://vercel.com) (static React/Vite build)
- **Backend** → [Render](https://render.com) (Node.js Express API)
- **Database** → [Neon](https://neon.tech) (serverless PostgreSQL)

> **Order of operations:** Deploy the backend first, copy its URL, then deploy the frontend.

---

## Prerequisites

- A [Neon](https://neon.tech) account with a database created (Steps 1–6 of this project).
- A [Render](https://render.com) account.
- A [Vercel](https://vercel.com) account.
- The repository pushed to GitHub (Render and Vercel connect via GitHub).

---

## 1. Neon Database

Your existing Neon database is already set up. You need the connection string.

1. Open [Neon Console](https://console.neon.tech).
2. Select your project → **Connection Details**.
3. Copy the **pooled connection string** (ends with `?sslmode=require`).
4. Keep it available for the Render environment variables step below.

**Run migrations before first deploy** (from your local machine):

```bash
cd backend
npx prisma migrate deploy
```

> ⚠️ Always use `migrate deploy` (not `migrate dev` or `db push`) in production.

---

## 2. Backend — Render

### Create a new Web Service

1. Go to [Render Dashboard](https://dashboard.render.com) → **New** → **Web Service**.
2. Connect your GitHub repository.
3. Configure the service:

| Setting | Value |
|---|---|
| **Name** | `skillgap-backend` (or any name) |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npx prisma generate` |
| **Start Command** | `npm start` |
| **Instance Type** | Free (or as needed) |

### Environment Variables (set in Render dashboard)

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `10000` (Render's default; or leave for Render to assign) |
| `DATABASE_URL` | Your Neon connection string (with `?sslmode=require`) |
| `JWT_SECRET` | A securely generated, random secret string (e.g. 32+ characters) |
| `FRONTEND_URL` | Your Vercel frontend URL — set this after deploying the frontend |
| `AI_PROVIDER` | `gemini` or `openai` (optional — falls back to deterministic if unset) |
| `AI_API_KEY` | Your AI provider API key (optional — leave empty for deterministic fallback) |
| `AI_MODEL` | `gemini-1.5-flash` or equivalent (optional) |

> ⚠️ **JWT_SECRET Security:**
> - `JWT_SECRET` must be a cryptographically strong, randomly generated secret string.
> - Keep it strictly private; **never commit it to Git** or share it publicly.
> - Note that modifying or rotating `JWT_SECRET` immediately invalidates all active JWT tokens, requiring users to log in again.

> ⚠️ Set `FRONTEND_URL` to the exact Vercel URL (e.g., `https://skillgap.vercel.app`) with **no trailing slash**. This is required for CORS.

### After Deploy

- Your backend URL will be something like `https://skillgap-backend.onrender.com`.
- Test health: `GET https://skillgap-backend.onrender.com/api/health`

Expected response:
```json
{ "backend": "Connected", "database": "Connected" }
```

---

## 3. Frontend — Vercel

### Create a new Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) → **Add New** → **Project**.
2. Import your GitHub repository.
3. Configure the project:

| Setting | Value |
|---|---|
| **Framework Preset** | `Vite` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

### Environment Variables (set in Vercel dashboard)

| Variable | Value |
|---|---|
| `VITE_API_BASE_URL` | Your Render backend URL — e.g., `https://skillgap-backend.onrender.com` (no trailing slash) |

> ℹ️ Vercel exposes only `VITE_`-prefixed variables to the browser bundle. Do **not** add `DATABASE_URL` or `AI_API_KEY` here.

### After Deploy

- Your frontend URL will be something like `https://skillgap.vercel.app`.
- Go back to Render and set `FRONTEND_URL` = `https://skillgap.vercel.app`.
- Trigger a manual redeploy on Render to apply the CORS update.

---

## 4. Verify End-to-End

1. Open the frontend URL in your browser.
2. The top status bar should show **API ✓** and **Neon ✓**.
3. Upload a resume → enter a job description → run analysis.
4. Confirm results appear (score, matched/missing skills, AI recommendations, roadmap).
5. Open **History** tab → confirm the analysis is saved.
6. Click a history entry → confirm detail view loads.

---

## 5. Running Locally (Development)

No `VITE_API_BASE_URL` is needed locally. The Vite dev proxy forwards `/api` → `localhost:5000`.

```bash
# Terminal 1 — Backend
cd backend
cp .env.example .env        # fill in real values
npm install
npx prisma migrate dev      # (first time only)
npm run dev

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
```

---

## 6. Troubleshooting

### CORS errors in the browser console
- Verify `FRONTEND_URL` on Render exactly matches your Vercel URL (no trailing slash, correct `https://`).
- Redeploy backend after changing the variable.

### `@prisma/client did not initialize` on Render
- Ensure the **Build Command** includes `npx prisma generate`.
- Check Render build logs for errors during generation.

### API calls returning 404 in production
- Verify `VITE_API_BASE_URL` is set in Vercel environment variables (no trailing slash).
- Redeploy the Vercel frontend after adding the variable.
- Confirm the backend health endpoint returns 200.

### Database connection errors
- Confirm `DATABASE_URL` includes `?sslmode=require` at the end.
- Check that the Neon project is not suspended (free tier suspends after inactivity).

### AI features not working (returning deterministic results)
- This is expected if `AI_API_KEY` is not set or the key is invalid.
- The deterministic fallback is fully functional and requires no configuration.
- To enable AI: set `AI_PROVIDER`, `AI_API_KEY`, and `AI_MODEL` on Render and redeploy.

### Render service starts but is unreachable
- The server binds to `0.0.0.0` (fixed in Step 11A). Confirm the latest code is deployed.

---

## 7. Environment Variable Reference

### Backend (`backend/.env.example`)

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://username:password@host/neondb?sslmode=require
JWT_SECRET=your_jwt_secret_here
AI_PROVIDER=gemini
AI_API_KEY=your_ai_api_key_here
AI_MODEL=gemini-1.5-flash
```

### Frontend (`frontend/.env.example`)

```env
VITE_API_BASE_URL=https://your-skillgap-backend.onrender.com
```
