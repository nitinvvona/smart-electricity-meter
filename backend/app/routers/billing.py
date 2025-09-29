from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from ..db import get_session
from ..schemas import PaymentIn, ContactIn
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/billing/current")
async def billing_current(session: AsyncSession = Depends(get_session)):
    # Simplified demo: compute due amount from latest period totals minus payments
    # This example assumes single customer ID 1 for demo purposes
    res = await session.execute(text("""
      WITH usage_totals AS (
        SELECT DATE_TRUNC('month', ts) AS period, SUM(kwh) AS kwh
        FROM meter_readings WHERE customer_id = 1
        GROUP BY 1 ORDER BY 1 DESC LIMIT 1
      )
      SELECT 
        COALESCE((SELECT kwh FROM usage_totals), 0) * 0.18 AS due_amount
    """))
    due_amount = float(res.scalar() or 0.0)
    return {
      "customer_id": 1,
      "due_amount": round(due_amount, 2),
      "due_date": (datetime.utcnow() + timedelta(days=7)).isoformat(),
      "last_payment_amount": 0.0,
      "last_payment_date": None,
    }

@router.post("/payments")
async def create_payment(payload: PaymentIn, session: AsyncSession = Depends(get_session)):
    await session.execute(
        text("INSERT INTO payments (customer_id, amount, ts) VALUES (:cid, :amount, NOW())"),
        {"cid": payload.customer_id or 1, "amount": payload.amount},
    )
    await session.commit()
    return {"status": "ok"}

@router.post("/contact")
async def contact(payload: ContactIn, session: AsyncSession = Depends(get_session)):
    await session.execute(
        text("INSERT INTO contact_requests (name, email, message, ts) VALUES (:n,:e,:m,NOW())"),
        {"n": payload.name, "e": payload.email, "m": payload.message},
    )
    await session.commit()
    return {"status": "received"}
