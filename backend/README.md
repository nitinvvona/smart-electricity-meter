# Smart Electricity Meter API

A FastAPI backend with TimescaleDB/PostgreSQL.

Environment:
- DATABASE_URL (e.g., postgresql+asyncpg://user:pass@host:5432/db)
- INGEST_API_KEY (shared secret for /api/ingest)

Run locally:
- Create DB and run SQL in ../scripts/sql/001_init.sql
- `pip install -r requirements.txt`
- `uvicorn app.main:app --reload --port 8000`

Endpoints:
- POST /api/ingest (secure, x-api-key in body)
- GET  /api/usage/latest
- GET  /api/analytics?granularity=daily|monthly|yearly
- GET  /api/billing/current
- POST /api/payments
- POST /api/contact
