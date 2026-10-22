# Wease

**Book trusted local professionals and labour crews — with transparent, approve-first pricing.**

Wease is a home-services marketplace for India. Customers find electricians, plumbers, carpenters,
painters and other professionals within 10 km of them, see the visiting charge upfront, and approve an
itemised quote before any repair is charged. For bigger jobs, customers can hire a crew from a labour
firm at a known daily rate.

Built with **Spring Boot** (Java 21) and **React** (Vite + Tailwind CSS), backed by **MySQL**.

---

## Features

### For customers
- **Browse without an account** — sign in only when you book.
- **Find professionals near you** — set your location (GPS, address search or a map pin) and see
  everyone whose 10 km service area covers you, nearest first, on a list or a map.
- **Upfront visiting charge** — each professional sets their own, and whether it counts towards the
  repair bill or is charged separately.
- **Approve-first quotes** — after inspecting, the professional sends an itemised quote (labour,
  materials, other). Nothing beyond the visiting charge is charged until you approve it. Extra work
  needs a separate approval and is added to the bill.
- **Clear bills and payments** — the final bill is calculated from what you approved, never typed in.
  Cash payments are recorded against the booking.
- **Labour crews** — request N workers × N days from a labour firm and see the estimate before
  sending. Firms can bill fewer worker-days than agreed, never more.
- **Ratings & reviews** — rate professionals and firms after a completed job.

### For professionals
- Dashboard with new requests, upcoming jobs and take-home earnings.
- Set a visiting charge and policy, and a base location for the 10 km service area.
- Accept or decline requests, send quotes and revised quotes, complete jobs and record cash.

### For labour firms
- Company profile with daily rates per skill, team size, optional GSTIN and the cities served.
- Accept crew requests, then complete them with the worker-days actually supplied.

### Trust and privacy
- Only customers with a completed job can leave a rating — one per booking or crew request.
- Customers see a professional's base only to about 1 km; distances are checked on the server.
- Phone numbers are shared only after a request is accepted.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS 4, React Router 7, Radix UI, Framer Motion |
| Maps | Leaflet + OpenStreetMap tiles, Nominatim address search |
| Backend | Spring Boot 3.4 (Java 21), Spring Security with JWT, Spring Data JPA (Hibernate) |
| Database | MySQL 8 |
| Email | Spring Mail (SMTP) — falls back to the server log when not configured |

```
React app (frontend/)  ──HTTP/JSON──▶  Spring Boot API (backend/)  ──JPA──▶  MySQL
        │                                       │
        └── OpenStreetMap tiles & search        └── JWT auth, role-based access
```

---

## Getting started (local)

### Prerequisites
- Java 21
- Node.js 20+
- MySQL 8 running locally

### 1. Backend

```bash
cd backend
cp .env.example .env      # then fill in DB_PASSWORD and JWT_SECRET
./mvnw spring-boot:run    # on Windows: mvnw.cmd spring-boot:run
```

The API starts on `http://localhost:8080`. Tables are created automatically in a `wease` database.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

### Configuration

Backend settings come from `backend/.env` (git-ignored) or environment variables:

| Variable | Purpose | Default |
|---|---|---|
| `DB_URL` | JDBC URL of the database | local MySQL `wease` database |
| `DB_USERNAME` / `DB_PASSWORD` | Database login | `root` / — |
| `JWT_SECRET` | Base64 key for signing logins (`openssl rand -base64 64`) | — |
| `CORS_ALLOWED_ORIGINS` | Sites allowed to call the API (comma-separated) | `http://localhost:5173` |
| `FRONTEND_URL` | Base URL used in email links | `http://localhost:5173` |
| `PLATFORM_COMMISSION_PERCENT` | Commission on labour for completed jobs | `5` |
| `spring.mail.*`, `MAIL_FROM` | SMTP for real emails | emails go to the log |

Frontend: set `VITE_API_URL` (see `frontend/.env.example`) — defaults to `http://localhost:8080/api`.

---

## Project structure

```
backend/   Spring Boot API
  src/main/java/com/wease/
    auth/      registration, login, email verification, password reset
    booking/   bookings, bill calculation
    quote/     itemised quotes and approvals
    payment/   cash payment records
    worker/    professional profiles, pricing, service area, dashboard
    firm/      labour firm profiles and rates
    crew/      crew requests to firms
    review/    ratings and reviews
    user/      accounts and city preference
    core/      security, CORS, errors, shared utilities
frontend/  React app
  src/
    pages/       customer, worker, firm, auth and public pages
    components/  booking, map, review, firm and shared UI
    services/    API calls
    context/     auth and location state
```

---

## API overview

All endpoints are under `/api`. Browsing is public; everything else needs a login token.

| Area | Endpoints |
|---|---|
| Auth | `POST /auth/register`, `/auth/login`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/verify-email` |
| Professionals | `GET /workers` (filter by `profession`, `q`, `city`, or `lat`+`lng` for the 10 km search), `GET /workers/{id}`, `GET /workers/{id}/reviews` |
| Worker account | `GET/POST/PUT /workers/profile`, `PUT /workers/pricing`, `PUT /workers/location`, `PUT /workers/availability` |
| Bookings | `POST /bookings`, `GET /bookings/{id}`, `/bookings/customer`, `/bookings/worker`, `PUT /bookings/{id}/accept · reject · complete · cancel` |
| Quotes & payments | `GET/POST /bookings/{id}/quotes`, `PUT /bookings/{id}/quotes/{quoteId}/accept · reject`, `GET /bookings/{id}/payments`, `POST /bookings/{id}/payments/cash` |
| Firms & crews | `GET /firms`, `GET /firms/{id}`, `GET /firms/{id}/reviews`, `GET/POST/PUT /firms/profile`, `POST /crew-requests`, `PUT /crew-requests/{id}/accept · reject · complete · cancel` |
| Ratings | `POST /bookings/{id}/review`, `POST /crew-requests/{id}/review` |
| Account | `GET/PUT /user/profile`, `PUT /user/city` |

---

## Deployment

The website deploys to **Vercel**, the API to **Render** (Docker) and the database to a hosted MySQL
such as **Aiven**, all on free plans. See **[DEPLOY.md](DEPLOY.md)** for the step-by-step guide.

---

## Roadmap

- Online payments (UPI / cards) via a payment gateway
- Phone number + OTP login and SMS / WhatsApp notifications
- Admin panel: worker verification, disputes, review moderation
- Worker photos and portfolios
- Installable mobile app (PWA)
