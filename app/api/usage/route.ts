import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  const backend = process.env.BACKEND_URL
  try {
    if (backend) {
      const res = await fetch(`${backend}/api/usage/latest`, { cache: "no-store" })
      if (!res.ok) throw new Error("Backend error")
      const data = await res.json()
      return NextResponse.json(data)
    }
    // Fallback mock
    const now = new Date()
    const kwh = 0.5 + Math.random() * 1.2
    const cost = kwh * 0.18
    return NextResponse.json({
      timestamp: now.toISOString(),
      customer_id: "demo-1",
      kwh,
      cost,
      voltage: 230 + Math.random() * 3,
      current: 5 + Math.random() * 1,
      notes: "mock",
    })
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch usage" }, { status: 500 })
  }
}
