"use client"

import { useState, useEffect } from "react"
import { GaugeCard } from "@/components/GaugeCard"
import { EnergySavingTips } from "@/components/EnergySavingTips"
import { DailyEnergyChart } from "@/components/DailyEnergyChart"
import { HourlyPowerChart } from "@/components/HourlyPowerChart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

// ThingSpeak configuration
const CHANNEL_ID = '3093022'
const READ_API_KEY = 'DQ9UEZPYZ9NDGHRK'

export default function DashboardPage() {
  const [powerData, setPowerData] = useState({
    totalPower: 0,
    totalCurrent: 0,
    avgVoltage: 0,
    totalEnergy: 0,
    systemStatus: 'Normal',
    statusColor: '#90EE90',
    efficiency: 'Good',
    costEstimate: 0
  })
  
  const [lastUpdated, setLastUpdated] = useState<string>("--")
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  
  // Electricity rate (₹ per kWh)
  const ELECTRICITY_RATE = 8.5
  
  const fetchThingSpeakData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds/last.json?api_key=${READ_API_KEY}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch data from ThingSpeak')
      }
      
      const data = await response.json()
      
      // Parse data from ThingSpeak
      const totalPower = parseFloat(data.field1 || 0)
      const totalCurrent = parseFloat(data.field2 || 0)
      const avgVoltage = parseFloat(data.field3 || 0)
      const totalEnergy = parseFloat(data.field4 || 0)
      
      // Calculate cost estimate
      const costEstimate = totalEnergy * ELECTRICITY_RATE
      
      // Determine system status
      let status = 'Normal'
      let statusColor = '#90EE90'
      
      if (totalPower > 3000) {
        status = 'High Usage'
        statusColor = '#FFB347'
      } else if (totalPower > 5000) {
        status = 'Critical'
        statusColor = '#FF6B6B'
      }
      
      // Determine efficiency
      const efficiency = totalPower < 2000 ? 'Excellent' : totalPower < 3000 ? 'Good' : 'Poor'
      
      setPowerData({
        totalPower,
        totalCurrent,
        avgVoltage,
        totalEnergy,
        systemStatus: status,
        statusColor,
        efficiency,
        costEstimate
      })
      
      setLastUpdated(new Date().toLocaleString())
      setLoading(false)
    } catch (error) {
      console.error('Error fetching ThingSpeak data:', error)
      setError('Failed to fetch power data. Please try again later.')
      setLoading(false)
    }
  }
  
  useEffect(() => {
    // Initial fetch
    fetchThingSpeakData()
    
    // Set up interval for periodic updates (every 5 seconds)
    const intervalId = setInterval(fetchThingSpeakData, 5000)
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId)
  }, [])
  
  const handleRefresh = () => {
    setRefreshing(true)
    fetchThingSpeakData()
      .then(() => {
        setTimeout(() => setRefreshing(false), 1000)
      })
      .catch(() => {
        setRefreshing(false)
      })
  }
  
  return (
    <div className="container mx-auto py-6 space-y-6 px-4">
      <div className="flex flex-col items-center justify-center mb-6">
        <h1 className="text-3xl font-bold mb-2">Smart Energy Meter Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Last updated: {lastUpdated}
        </p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>📊 Total Consumption</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-2 bg-slate-100 dark:bg-slate-800 rounded-md">
                <span className="font-medium">Total Power:</span>
                <span className="text-xl font-bold text-amber-500">{powerData.totalPower.toFixed(1)} W</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-slate-100 dark:bg-slate-800 rounded-md">
                <span className="font-medium">Total Current:</span>
                <span className="text-xl font-bold text-amber-500">{powerData.totalCurrent.toFixed(2)} A</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-slate-100 dark:bg-slate-800 rounded-md">
                <span className="font-medium">Average Voltage:</span>
                <span className="text-xl font-bold text-amber-500">{powerData.avgVoltage.toFixed(1)} V</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-slate-100 dark:bg-slate-800 rounded-md">
                <span className="font-medium">Total Energy:</span>
                <span className="text-xl font-bold text-amber-500">{powerData.totalEnergy.toFixed(4)} kWh</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <GaugeCard totalEnergy={powerData.totalEnergy} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DailyEnergyChart />
        <HourlyPowerChart />
      </div>
      
      <div className="flex justify-between items-center mt-6">
        <Link href="/suggestions">
          <Button className="gap-2">
            View Electricity Saving Suggestions <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        
        <Button 
          onClick={handleRefresh} 
          disabled={refreshing}
          variant="outline"
          className="flex items-center gap-2"
        >
          {refreshing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-500"></div>
              Refreshing...
            </>
          ) : (
            <>Refresh Data</>
          )}
        </Button>
      </div>
    </div>
  )
}