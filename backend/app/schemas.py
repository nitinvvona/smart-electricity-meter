from pydantic import BaseModel, Field
from typing import Optional, List

class IngestReading(BaseModel):
  api_key: str
  customer_id: int
  ts: str
  kwh: float
  voltage: Optional[float] = None
  current: Optional[float] = None

class LiveUsageOut(BaseModel):
  timestamp: str
  customer_id: int | str
  kwh: float
  cost: float
  voltage: float | None = None
  current: float | None = None
  notes: str | None = None

class AnalyticsPoint(BaseModel):
  period: str
  kwh: float
  cost: float

class AnalyticsOut(BaseModel):
  points: List[AnalyticsPoint]

class BillingOut(BaseModel):
  customer_id: int | str
  due_amount: float
  due_date: Optional[str] = None
  last_payment_amount: Optional[float] = None
  last_payment_date: Optional[str] = None

class PaymentIn(BaseModel):
  customer_id: int | None = None
  amount: float

class ContactIn(BaseModel):
  name: str
  email: str
  message: str
