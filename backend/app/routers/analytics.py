from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from ..db import get_session
from ..schemas import AnalyticsOut

router = APIRouter()

@router.get("/usage/latest")
async def latest(session: AsyncSession = Depends(get_session)):
    # Simplified: latest reading with derived cost
    res = await session.execute(text("""
      SELECT mr.ts as timestamp, mr.customer_id, mr.kwh, 
             COALESCE(mo.predicted_cost, mr.kwh * 0.18) as cost,
             mr.voltage, mr.current, mo.notes
      FROM meter_readings mr
      LEFT JOIN ml_outputs mo ON mo.reading_id = mr.id
      ORDER BY mr.ts DESC LIMIT 1
    """))
    row = res.mappings().first()
    if not row:
        return {
          "timestamp": "",
          "customer_id": "n/a",
          "kwh": 0.0,
          "cost": 0.0,
          "voltage": None,
          "current": None,
          "notes": None
        }
    return dict(row)

@router.get("/analytics", response_model=AnalyticsOut)
async def analytics(
    granularity: str = Query("daily", pattern="^(daily|monthly|yearly)$"),
    session: AsyncSession = Depends(get_session)
):
    bucket = {
      "daily": "DATE_TRUNC('day', ts)",
      "monthly": "DATE_TRUNC('month', ts)",
      "yearly": "DATE_TRUNC('year', ts)",
    }[granularity]

    res = await session.execute(text(f"""
      SELECT TO_CHAR({bucket}, CASE 
        WHEN '{granularity}'='daily' THEN 'YYYY-MM-DD'
        WHEN '{granularity}'='monthly' THEN 'YYYY-MM'
        ELSE 'YYYY'
      END) AS period,
      SUM(kwh) AS kwh,
      SUM(COALESCE(mo.predicted_cost, mr.kwh*0.18)) AS cost
      FROM meter_readings mr
      LEFT JOIN ml_outputs mo ON mo.reading_id = mr.id
      GROUP BY 1 ORDER BY 1 ASC
    """))
    points = [dict(r) for r in res.mappings().all()]
    return {"points": points}
