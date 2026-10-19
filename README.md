# Employee Directory

Add, search, edit and delete employees. Admins manage their own employees and create view-only logins for their team.

## Tech stack

| Part     | Used                                                    |
| -------- | ------------------------------------------------------- |
| Frontend | React, Vite, Tailwind CSS, React Router, Axios          |
| Backend  | Node.js, Express                                        |
| Database | PostgreSQL (Neon)                                       |
| Auth     | JWT access token + refresh token (httpOnly cookie), bcrypt |
| Security | Helmet, CORS, rate limiting (express-rate-limit)        |
| Email    | Nodemailer (SMTP)                                       |

## Setup

### 1. Backend

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and fill in:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
DATABASE_URL=your-neon-connection-string
JWT_SECRET=any-long-random-text
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_DAYS=7
NODE_ENV=development
```

Create the tables and start the server:

```bash
npm run db:setup
npm run dev
```

The API runs on http://localhost:5000.

### 2. Frontend

```bash
cd Employee-Directory
npm install
npm run dev
```

Open http://localhost:5173.

### 3. Email (optional)

To email login details to new users, add this to `backend/.env` and restart the backend:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
MAIL_FROM=Employee Directory <your-email@gmail.com>
```

Without it, the password is shown on screen for the admin to share.

## How to use

1. Open **Create account**. Every account made there is an **admin**.
2. Add employees from the **Employees** page.
3. To give someone view-only access, go to **Users → Create Login**, then enter their name and email. They get a generated password.

## Features

- Search, filter by department, sort and paginate employees
- Add, edit, view and delete employees in popups
- Email and phone number must be unique for each admin
- Each admin sees only their own employees and users
- You stay logged in after a page refresh, for up to 7 days
- Rate limiting - (per IP, every 15 minutes):
  - 300 requests to the API
  - 10 login / sign up attempts
  - 150 session refreshes
- Responsive layout for mobile and desktop



