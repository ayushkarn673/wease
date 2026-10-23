# Deploying Wease for free

Wease has three parts, and each goes to a free host that can run it:

| Part | Host | Why |
|---|---|---|
| Website (React, `frontend/`) | **Vercel** (Hobby plan) | Vercel serves static sites; it cannot run Java |
| API (Spring Boot, `backend/`) | **Render** free web service (Docker) | Runs the Java server from `backend/Dockerfile` |
| Database (MySQL) | **Aiven** free MySQL (or TiDB Cloud Serverless) | Hosted MySQL with a free plan |

> Free plans change over time. Check each provider's current limits before relying on them.
> Render's free service **sleeps after ~15 minutes without traffic**; the next request takes
> 30–60 seconds while it wakes up.

You create the accounts and paste the secrets yourself — nothing secret is stored in this repo.

---

## 0. Push the code to GitHub

Vercel and Render deploy from the GitHub repo (`ayushkarn673/wease`). Commit and push `main` first.
`backend/.env` and `*.local.md` are git-ignored, so local passwords and test logins stay on your PC.

## 1. Database (Aiven MySQL)

1. Sign up at aiven.io → **Create service** → **MySQL** → **Free plan**.
2. When it's running, open it and copy **Host**, **Port**, **User** (`avnadmin`) and **Password**.
3. Your JDBC URL is:
   ```
   jdbc:mysql://HOST:PORT/defaultdb?sslMode=REQUIRED&serverTimezone=UTC
   ```

The tables are created automatically on first start (`spring.jpa.hibernate.ddl-auto=update`).
On a new, empty database you do **not** need `db/manual/2026-10-22-add-firm-role.sql`; that was only
for the existing local database.

## 2. API (Render)

1. Sign up at render.com with GitHub → **New** → **Blueprint** → pick the `wease` repo.
   Render reads `render.yaml` and creates the `wease-api` web service (Docker, `backend/`, free).
2. Fill in the environment variables it asks for:

   | Key | Value |
   |---|---|
   | `DB_URL` | the JDBC URL from step 1 |
   | `DB_USERNAME` | `avnadmin` (or your DB user) |
   | `DB_PASSWORD` | the database password |
   | `JWT_SECRET` | a new random secret: run `openssl rand -base64 64` (don't reuse your local one) |
   | `CORS_ALLOWED_ORIGINS` | leave as `http://localhost:5173` for now; set in step 4 |
   | `FRONTEND_URL` | leave empty for now; set in step 4 |

3. Deploy. When it's live, open `https://<your-service>.onrender.com/api/workers` — you should see `[]`.

## 3. Website (Vercel)

1. Sign up at vercel.com with GitHub → **Add New… → Project** → import `wease`.
2. Set **Root Directory** to `frontend`. Framework preset: **Vite** (build `npm run build`, output `dist`).
3. Add the environment variable:

   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://<your-service>.onrender.com/api` |

4. Deploy. You'll get an address like `https://wease.vercel.app`.

`frontend/vercel.json` sends every page address to the app, so links such as `/workers/17` work on refresh.

## 4. Connect them

Back in Render → `wease-api` → **Environment**:

| Key | Value |
|---|---|
| `CORS_ALLOWED_ORIGINS` | `https://wease.vercel.app` (your Vercel address; add `,https://*.vercel.app` to also allow preview deployments) |
| `FRONTEND_URL` | `https://wease.vercel.app` (used in password-reset and verification email links) |

Save — Render redeploys. Then open your Vercel site, register, and try the app.

## 5. Google Sign-In and phone codes

**Google Sign-In** (free):
1. Go to console.cloud.google.com → create a project → **APIs & Services → OAuth consent screen**
   (External, app name "Wease", your email).
2. **Credentials → Create credentials → OAuth client ID → Web application.**
   Under **Authorized JavaScript origins** add `http://localhost:5173` and your Vercel address
   (e.g. `https://wease.vercel.app`).
3. Copy the **Client ID** and set it in two places:
   - Render → `GOOGLE_CLIENT_ID`
   - Vercel → `VITE_GOOGLE_CLIENT_ID` (then redeploy the site)

**Phone codes (OTP):** until an SMS provider is connected, codes are written to the Render log
(`SMS_PROVIDER=log`), which is fine for testing but **not for real users**. Before launch, sign up with an
Indian SMS provider such as MSG91 or Twilio, complete DLT registration (sender ID + OTP template), and add
its sender in `backend/src/main/java/com/wease/core/sms/` next to `LogSmsSender`.

## After deploying

- **Email:** without SMTP settings, verification and reset emails are only written to the Render log.
  Add the `spring.mail.*` and `MAIL_FROM` settings (see `backend/.env.example`) to send real emails.
- **Maps:** the app uses OpenStreetMap's free tiles and address search. That's fine for low traffic;
  for a busy site switch to a paid tile/geocoding provider.
- **Security:** the old local MySQL password is in this repo's git history. Change it on your PC,
  and never reuse it. Production uses the new Aiven password.
- **Data:** production starts empty — none of the local test accounts are copied.
