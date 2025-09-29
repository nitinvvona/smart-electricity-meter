from sqlalchemy.orm import declarative_base, relationship, Mapped, mapped_column
from sqlalchemy import String, Integer, Float, DateTime, ForeignKey, Text, Boolean

Base = declarative_base()

class Customer(Base):
    __tablename__ = "customers"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(255))

class MeterReading(Base):
    __tablename__ = "meter_readings"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id"), index=True)
    ts: Mapped["DateTime"] = mapped_column(DateTime, index=True)
    kwh: Mapped[float] = mapped_column(Float)
    voltage: Mapped[float | None] = mapped_column(Float)
    current: Mapped[float | None] = mapped_column(Float)

class MlOutput(Base):
    __tablename__ = "ml_outputs"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    reading_id: Mapped[int] = mapped_column(ForeignKey("meter_readings.id"), index=True)
    predicted_cost: Mapped[float] = mapped_column(Float)
    anomaly: Mapped[bool] = mapped_column(Boolean, default=False)
    notes: Mapped[str | None] = mapped_column(Text)

class Billing(Base):
    __tablename__ = "billing"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id"), index=True)
    period: Mapped[str] = mapped_column(String(20))  # e.g. 2025-09
    kwh_total: Mapped[float] = mapped_column(Float)
    cost_total: Mapped[float] = mapped_column(Float)
    due_amount: Mapped[float] = mapped_column(Float, default=0.0)
    paid: Mapped[bool] = mapped_column(Boolean, default=False)

class Payment(Base):
    __tablename__ = "payments"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id"), index=True)
    amount: Mapped[float] = mapped_column(Float)
    ts: Mapped["DateTime"] = mapped_column(DateTime)

class ContactRequest(Base):
    __tablename__ = "contact_requests"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
    email: Mapped[str] = mapped_column(String(255))
    message: Mapped[str] = mapped_column(Text)
    ts: Mapped["DateTime"] = mapped_column(DateTime)
