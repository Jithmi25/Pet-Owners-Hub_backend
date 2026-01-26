# Pet Owners Hub — Backend

A Node.js/Express + MongoDB API powering the Pet Owners Hub application. Provides user auth, listings, clinics, shops, admin dashboards, reports, and system settings.

## Overview

- **Server**: Express with ES Modules (type: module)
- **Database**: MongoDB via Mongoose
- **Auth**: JWT-ready (middleware present), bcrypt for passwords
- **Email**: Nodemailer (SMTP configurable)
- **CORS**: Enabled for `http://127.0.0.1:5500` by default
- **Seed Data**: Clinics, Pets, and Shops auto-seeded on first run

## Prerequisites

- **Node.js**: v18+ recommended
- **MongoDB**: Local instance or MongoDB Atlas connection string

## Quick Start

```bash
# Install dependencies
npm install

# Create environment file
copy .env.example .env  # On Windows PowerShell use: Copy-Item .env.example .env

# Start the server
npm start
# or with auto-reload (if needed)
npx nodemon index.js
```

## Environment Variables

Create a `.env` in the project root with at least:

- **MONGO_DB_URL**: Mongo connection string (required)
- **PORT**: Port to run the server (default: 5000)
- Optional (if using auth/email features):
  - **JWT_SECRET**: Secret for signing JWTs
  - **SMTP_HOST**, **SMTP_PORT**, **SMTP_USER**, **SMTP_PASS**: Nodemailer SMTP creds

CORS origin is set in [index.js](index.js#L17-L28). Update if your frontend runs elsewhere.

## Running & Health

- Starts Express server and connects to MongoDB.
- Health check: `GET /` → `{ status: "ok", message: "Pet Owners Hub API" }` (see [index.js](index.js#L41-L45)).

## Data Seeding

On successful DB connection, seeders run once if collections are empty:

- Clinics: [Data/seedDatabase.js](Data/seedDatabase.js)
- Pets: [Data/seedPets.js](Data/seedPets.js)
- Shops: [Data/seedShops.js](Data/seedShops.js)

To avoid duplicates, seeders check collection counts before inserting.

## API Routes (Summary)

Base paths are mounted in [index.js](index.js#L47-L57):

- **`/api/users`** ([Routes/userRouter.js](Routes/userRouter.js))
  - `POST /register`, `POST /login`
- **`/api/auth`** ([Routes/authRouter.js](Routes/authRouter.js))
  - `POST /logout`
- **`/api/clinics`** ([Routes/clinicRouter.js](Routes/clinicRouter.js))
  - `GET /` (list, filters), `GET /search`, `GET /emergency`, `GET /location/:location`
  - `GET /:id`, `GET /:id/slots`
  - `POST /:id/book`, `POST /:id/rate`
  - Admin: `POST /`, `PUT /:id`, `DELETE /:id`
- **`/api/shops`** ([Routes/shopRouter.js](Routes/shopRouter.js))
  - `GET /`, `GET /stats`, `GET /:id`, `POST /`
  - Admin: `GET /pending`, `PUT /:id`, `DELETE /:id`, `PATCH /:id/approve`, `PATCH /:id/reject`
- **`/api/listings`** ([Routes/listingRouter.js](Routes/listingRouter.js))
  - `GET /`, `GET /stats`, `GET /:id`, `POST /`, `POST /:id/inquiry`
  - Admin: `GET /pending`, `PUT /:id`, `DELETE /:id`, `PATCH /:id/approve`, `PATCH /:id/reject`, `PATCH /:id/sold`
- **`/api/admin`** ([Routes/adminRouter.js](Routes/adminRouter.js))
  - Dashboard: `GET /dashboard-stats`
  - Users: CRUD, status, bulk delete, export, reset password
  - Clinics/Shops: CRUD, verify, stats
- **`/api/admin/pets`** ([Routes/petRouter.js](Routes/petRouter.js))
  - `GET /stats`
  - `GET /`, `POST /`
  - Bulk: `POST /bulk-delete`
  - Single: `GET /:id`, `PUT /:id`, `DELETE /:id`
  - Special: `DELETE /:id/permanent`, `PATCH /:id/status`, `PATCH /:id/restore`
- **`/api/admin/reports`** ([Routes/reportsRouter.js](Routes/reportsRouter.js))
  - `GET /all`, `GET /summary`, `GET /user-activity`, `GET /pet-listings`, `GET /transactions`, `GET /user-growth`, `GET /pet-types`, `GET /export`
- **`/api/admin/settings`** ([Routes/systemSettingsRouter.js](Routes/systemSettingsRouter.js))
  - `GET /`, `GET /section/:section`
  - `PUT /general|regional|notifications|security|appearance|backup`
  - `POST /clear-cache`, `POST /reset-to-default`, `POST /delete-all-data`

Note: Admin/auth middleware exist but are commented for easier local testing. See [Routes/adminRouter.js](Routes/adminRouter.js) and [Routes/reportsRouter.js](Routes/reportsRouter.js).

## Scripts

Defined in [package.json](package.json):

- **start**: `node index.js`
- Dev tip: use `npx nodemon index.js` for auto-restart during development.

## Development Notes

- **ESM**: Project uses ES Modules; import syntax is `import ... from ...`.
- **Error Handling**: Basic try/catch in seeders; controllers/middleware should handle validation and errors.
- **Validation**: Clinic middleware validates IDs, booking/rating payloads.

## Troubleshooting

- **Missing `MONGO_DB_URL`**: Server throws an error at startup; set it in `.env`.
- **CORS Issues**: Update allowed origin in [index.js](index.js#L17-L28).
- **Seeds Not Appearing**: Ensure the DB is empty (seeders skip if documents exist).

## License

Proprietary or TBD. Update this section as needed.
