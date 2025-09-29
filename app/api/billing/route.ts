import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  const backend = process.env.BACKEND_URL
  try {
    if (backend) {
      const res = await fetch(`${backend}/api/billing/current`, { cache: "no-store" })
      if (!res.ok) throw new Error("Backend error")
      return NextResponse.json(await res.json())
    }
    // Mock
    return NextResponse.json({
      customer_id: "demo-1",
      due_amount: 42.35,
      due_date: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
      last_payment_amount: 35.12,
      last_payment_date: new Date(Date.now() - 32 * 24 * 3600 * 1000).toISOString(),
    })
  } catch {
    return NextResponse.json({ error: "Failed to fetch billing" }, { status: 500 })
  }
}
