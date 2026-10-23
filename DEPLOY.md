# Deploying Wease for free

Wease has three parts. The website and the API both go to Render; the database goes to a hosted MySQL:

| Part | Host | How |
|---|---|---|
| Website (React, `frontend/`) | **Render Static Site** (free) | Built with `npm run build`, served from `frontend/dist` |
| API (Spring Boot, `backend/`) | **Render** free web service (Docker) | Runs the Java server from `backend/Dockerfile` |
| Database (MySQL) | **Aiven** free MySQL (or TiDB Cloud Serverless) | Hosted MySQL with a free plan |

Both Render services are defined in `render.yaml`, so one **Blueprint** creates them together.

> Free plans change over time. Check each provider's current limits before relying on them.
> Render's free API service **sleeps after ~15 minutes without traffic**; the next request takes
> 30–60 seconds while it wakes up. The static website does not sleep.

You create the accounts and paste the secrets yourself — nothing secret is stored in this repo.

---

## 0. Push the code to GitHub

Render deploys from the GitHub repo (`ayushkarn673/wease`). Commit and push `main` first.
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

## 2. API and website (Render Blueprint)

1. Sign up at render.com with GitHub → **New** → **Blueprint** → pick the `wease` repo.
   Render reads `render.yaml` and creates two services:
   - `wease-api` — the API (address like `https://wease-api.onrender.com`)
   - `wease-web` — the website (address like `https://wease-web.onrender.com`)

   If a name is taken, Render adds a suffix; use the real addresses it shows below.
2. Fill in the environment variables it asks for:

   | Service | Key | Value |
   |---|---|---|
   | wease-api | `DB_URL` | the JDBC URL from step 1 |
   | wease-api | `DB_USERNAME` | `avnadmin` (or your DB user) |
   | wease-api | `DB_PASSWORD` | the database password |
   | wease-api | `JWT_SECRET` | a new random secret: run `openssl rand -base64 64` (don't reuse your local one) |
   | wease-api | `CORS_ALLOWED_ORIGINS` | `https://wease-web.onrender.com` |
   | wease-api | `FRONTEND_URL` | `https://wease-web.onrender.com` (used in email links) |
   | wease-api | `GOOGLE_CLIENT_ID` | leave empty for now; see step 3 |
   | wease-web | `VITE_API_URL` | `https://wease-api.onrender.com/api` |
   | wease-web | `VITE_GOOGLE_CLIENT_ID` | leave empty for now; see step 3 |

3. **Apply.** When both are live:
   - `https://wease-api.onrender.com/api/workers` shows `[]`
   - `https://wease-web.onrender.com` shows the Wease home page

If Render gave different addresses than the ones above, update `CORS_ALLOWED_ORIGINS`, `FRONTEND_URL`
and `VITE_API_URL` to match. A change to a `VITE_` variable needs a new deploy of `wease-web`
(**Manual Deploy → Deploy latest commit**), because it is built into the website.

## 3. Google Sign-In and phone codes

**Google Sign-In** (free) — needed for new visitors to sign up until SMS is connected:
1. Go to console.cloud.google.com → create a project → **APIs & Services → OAuth consent screen**
   (External, app name "Wease", your email).
2. **Credentials → Create credentials → OAuth client ID → Web application.**
   Under **Authorized JavaScript origins** add `http://localhost:5173` and your website address
   (e.g. `https://wease-web.onrender.com`).
3. Copy the **Client ID** and set it in two places on Render:
   - `wease-api` → `GOOGLE_CLIENT_ID`
   - `wease-web` → `VITE_GOOGLE_CLIENT_ID` (then redeploy the website)

**Phone codes (OTP):** until an SMS provider is connected, codes are written to the `wease-api` log
(`SMS_PROVIDER=log`), which is fine for testing but **not for real users**. Before launch, sign up with an
SMS provider such as MSG91 or Twilio (Indian numbers need DLT registration: sender ID + OTP template),
and add its sender in `backend/src/main/java/com/wease/core/sms/` next to `LogSmsSender`.

## After deploying

- **Email:** without SMTP settings, verification and reset emails are only written to the Render log.
  Add the `spring.mail.*` and `MAIL_FROM` settings (see `backend/.env.example`) to send real emails.
- **Maps:** the app uses OpenStreetMap's free tiles and address search. That's fine for low traffic;
  for a busy site switch to a paid tile/geocoding provider.
- **Security:** the old local MySQL password is in this repo's git history. Change it on your PC,
  and never reuse it. Production uses the new Aiven password.
- **Data:** production starts empty — none of the local test accounts are copied.
