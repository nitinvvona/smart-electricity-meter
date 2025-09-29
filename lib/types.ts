// Basic shared types for API payloads

export type AnalyticsPoint = {
  period: string // e.g., '2025-09-28' or '2025-09'
  kwh: number
  cost: number
}

export type AnalyticsResponse = {
  points: AnalyticsPoint[]
}

export type LiveUsageResponse = {
  timestamp: string
  customer_id: string
  kwh: number
  cost: number
  voltage?: number
  current?: number
  notes?: string
}

export type BillingResponse = {
  customer_id: string
  due_amount: number
  due_date?: string
  last_payment_amount?: number
  last_payment_date?: string
}
