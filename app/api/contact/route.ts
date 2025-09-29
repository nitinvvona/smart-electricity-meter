import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const backend = process.env.BACKEND_URL
  const body = await req.json()
  try {
    if (backend) {
      const res = await fetch(`${backend}/api/contact`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error("Backend error")
      return NextResponse.json(await res.json())
    }
    // Mock accept
    return NextResponse.json({ status: "received" })
  } catch {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 })
  }
}
