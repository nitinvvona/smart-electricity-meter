"use client"

import { useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

type BillingPayload = {
  customer_id: string
  due_amount: number
  due_date?: string
  last_payment_amount?: number
  last_payment_date?: string
}

type Point = { period: string; kwh: number; cost: number }

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function BillingSummary() {
  const { toast } = useToast()
  const {
    data: billingData,
    mutate: mutateBilling,
    isLoading: isBillingLoading,
  } = useSWR<BillingPayload>("/api/billing", fetcher, {
    refreshInterval: 0,
  })

  // Pull monthly analytics to compute total cost due to pay
  const { data: monthly } = useSWR<{ points: Point[] }>("/api/analytics?granularity=monthly", fetcher, {
    revalidateOnFocus: false,
  })

  const monthlyTotal = (monthly?.points ?? []).reduce((sum, p) => sum + (p.cost || 0), 0)
  // Prefer computed monthly total if available, fallback to backend due_amount
  const dueToDisplay = Number.isFinite(monthlyTotal) && monthlyTotal > 0 ? monthlyTotal : (billingData?.due_amount ?? 0)

  const [amount, setAmount] = useState<number | "">("")

  async function pay() {
    const amt = typeof amount === "number" ? amount : dueToDisplay || 0
    const res = await fetch("/api/payments", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ amount: amt }),
    })
    if (res.ok) {
      toast({ title: "Payment submitted", description: "Thanks! This was a mock payment." })
      mutateBilling()
      setAmount("")
    } else {
      toast({ title: "Payment failed", description: "Please try again.", variant: "destructive" })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Balance</CardTitle>
        <CardDescription>Pay your bill using the mock flow.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Due Amount</div>
          <div className="text-3xl font-semibold">₹{isBillingLoading ? "—" : dueToDisplay.toFixed(2)}</div>
          {billingData?.due_date && (
            <div className="text-sm text-muted-foreground">
              Due by {new Date(billingData.due_date).toLocaleDateString()}
            </div>
          )}
        </div>
        <div className="space-y-3">
          <Label htmlFor="amount">Pay Custom Amount (optional)</Label>
          <Input
            id="amount"
            type="number"
            min={0}
            step="0.01"
            placeholder="e.g. 25.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
          />
          <Button onClick={pay} className="w-full">
            Pay Now
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
