# FastAPI backend for Smart Electricity Meter
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import ingest, analytics, billing

app = FastAPI(title="Smart Electricity Meter API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ingest.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")
app.include_router(billing.router, prefix="/api")

@app.get("/health")
def health():
    return {"status": "ok"}
