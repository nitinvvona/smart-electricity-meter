"use client"

import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type LiveUsagePayload = {
  timestamp: string
  customer_id: string
  kwh: number
  cost: number
  voltage?: number
  current?: number
  notes?: string
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function LiveUsage() {
  const { data, isLoading } = useSWR<LiveUsagePayload>("/api/usage", fetcher, {
    refreshInterval: 2000,
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Realtime Usage</CardTitle>
        <Badge variant="secondary">{isLoading ? "Syncing…" : "Live"}</Badge>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Metric label="Total Power" value={(data?.voltage ?? 230) * (data?.current ?? 5)} suffix=" W" />
        <Metric label="kWh (now)" value={data?.kwh ?? 0} suffix=" kWh" />
        <Metric label="Cost (now)" value={data?.cost ?? 0} prefix="₹" />
        <Metric label="Current" value={data?.current ?? 5} suffix=" A" />
      </CardContent>
    </Card>
  )
}

function Metric({
  label,
  value,
  prefix = "",
  suffix = "",
}: {
  label: string
  value: number
  prefix?: string
  suffix?: string
}) {
  return (
    <div className="space-y-1">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-2xl font-semibold">
        {prefix}
        {value.toFixed(2)}
        {suffix}
      </div>
    </div>
  )
}
