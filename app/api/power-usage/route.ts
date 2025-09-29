import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

export const dynamic = "force-dynamic"

// Mock data based on the CSV files in the analytics folder
const generateHourlyData = () => {
  const now = new Date()
  const data = []
  
  // Generate 24 hours of data for today
  for (let i = 0; i < 24; i++) {
    const date = new Date(now)
    date.setHours(i, 0, 0, 0)
    
    // Base values from september_2025_hourly_patterns.csv
    const baseValue = 300 + Math.sin(i * Math.PI / 12) * 300 // Simulate daily pattern
    
    data.push({
      timestamp: date.toISOString(),
      power: Math.max(100, baseValue + (Math.random() * 100 - 50)),
      ac_power: Math.max(50, baseValue * 0.7 + (Math.random() * 50 - 25)),
      fan_power: Math.max(30, 150 + (Math.random() * 50 - 25)),
      heater_power: i < 6 || i > 18 ? Math.max(0, 50 + (Math.random() * 30 - 15)) : 0
    })
  }
  
  return data
}

const generateDailyData = () => {
  const now = new Date()
  const data = []
  
  // Generate 30 days of data
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)
    
    // Base values from september_2025_daily_summary.csv
    const baseValue = 500 + Math.sin(i * Math.PI / 15) * 200 // Simulate monthly pattern
    
    data.push({
      timestamp: date.toISOString(),
      power: Math.max(300, baseValue + (Math.random() * 100 - 50)),
      ac_power: Math.max(200, baseValue * 0.6 + (Math.random() * 80 - 40)),
      fan_power: Math.max(100, baseValue * 0.3 + (Math.random() * 50 - 25)),
      heater_power: Math.max(0, baseValue * 0.1 + (Math.random() * 30 - 15))
    })
  }
  
  return data
}

const generateMonthlyData = () => {
  const now = new Date()
  const data = []
  
  // Generate 12 months of data
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now)
    date.setMonth(date.getMonth() - i, 1)
    date.setHours(0, 0, 0, 0)
    
    // Seasonal pattern with higher usage in summer and winter
    const month = (now.getMonth() - i + 12) % 12
    const seasonFactor = Math.cos((month - 6) * Math.PI / 6) * 200 + 500
    
    data.push({
      timestamp: date.toISOString(),
      power: Math.max(300, seasonFactor + (Math.random() * 100 - 50)),
      ac_power: month >= 4 && month <= 9 ? Math.max(200, seasonFactor * 0.6) : Math.max(50, seasonFactor * 0.2),
      fan_power: Math.max(100, 200 + (Math.random() * 50 - 25)),
      heater_power: month <= 2 || month >= 10 ? Math.max(100, seasonFactor * 0.4) : Math.max(0, seasonFactor * 0.1)
    })
  }
  
  return data
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const period = searchParams.get("period") || "day"
  
  let historicalData
  
  switch (period) {
    case "day":
      historicalData = generateHourlyData()
      break
    case "month":
      historicalData = generateDailyData()
      break
    case "year":
      historicalData = generateMonthlyData()
      break
    default:
      historicalData = generateHourlyData()
  }
  
  return NextResponse.json({
    historical: historicalData,
    current: historicalData[historicalData.length - 1]
  })
}