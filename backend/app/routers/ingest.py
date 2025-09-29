from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from ..db import get_session
from ..schemas import IngestReading, LiveUsageOut
from ..ml import estimate_cost, detect_anomaly
import os

router = APIRouter()

API_KEY = os.getenv("INGEST_API_KEY", "dev-key")

@router.post("/ingest", response_model=dict)
async def ingest(payload: IngestReading, session: AsyncSession = Depends(get_session)):
    if payload.api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")

    # Insert raw reading
    await session.execute(
        text("""
          INSERT INTO meter_readings (customer_id, ts, kwh, voltage, current)
          VALUES (:customer_id, :ts, :kwh, :voltage, :current)
        """),
        payload.model_dump(),
    )
    await session.commit()

    # Run placeholder ML and store result
    cost = estimate_cost(payload.kwh)
    anomaly, notes = detect_anomaly(payload.kwh)
    await session.execute(
        text("""
          INSERT INTO ml_outputs (reading_id, predicted_cost, anomaly, notes)
          VALUES (
            currval(pg_get_serial_sequence('meter_readings','id')),
            :cost, :anomaly, :notes
          )
        """),
        {"cost": cost, "anomaly": anomaly, "notes": notes},
    )
    await session.commit()
    return {"status": "ok"}
