"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

type Recommendation = {
  category: string
  device: string
  issue: string
  recommendation: string[]
  potential_savings: string
}

const recommendations: Recommendation[] = [
  {
    category: "Critical",
    device: "AC and Heater",
    issue: "Simultaneous Usage",
    recommendation: [
      "Avoid using AC and heater simultaneously",
      "Use temperature sensors to automate device switching",
      "Consider using a programmable thermostat to prevent overlapping operation"
    ],
    potential_savings: "0.50 kWh per occurrence"
  },
  {
    category: "High Priority",
    device: "AC Unit",
    issue: "High Energy Consumption",
    recommendation: [
      "Set AC temperature 1-2 degrees higher and use fans for air circulation",
      "Clean or replace AC filters monthly",
      "Use window coverings to reduce solar heat gain"
    ],
    potential_savings: "5-10% on AC energy consumption"
  },
  {
    category: "Medium Priority",
    device: "All Devices",
    issue: "Standby Power Waste",
    recommendation: [
      "Use smart power strips to completely turn off devices when not in use",
      "Identify and unplug devices with high standby power consumption",
      "Enable power-saving modes on all electronic devices"
    ],
    potential_savings: "2.50 kWh per month"
  },
  {
    category: "High Priority",
    device: "All Devices",
    issue: "Peak Hour Usage",
    recommendation: [
      "Shift non-essential device usage away from peak hours (11, 12, 13, 14, 15)",
      "Use timer switches to automatically control device operation during peak hours",
      "Pre-cool spaces before peak hours in summer"
    ],
    potential_savings: "10-15% on energy bills"
  },
  {
    category: "General",
    device: "All Devices",
    issue: "Overall Energy Efficiency",
    recommendation: [
      "Conduct regular energy audits to identify inefficiencies",
      "Consider installing a home energy monitoring system",
      "Use natural light when possible during daytime"
    ],
    potential_savings: "15-20% on overall energy consumption"
  }
]

// Add a limit parameter to the component props
export function EnergySavingTips({ limit }: { limit?: number }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  
  const filteredRecommendations = selectedCategory === "all" 
    ? recommendations 
    : recommendations.filter(rec => rec.category === selectedCategory)
  
  const categories = ["all", ...new Set(recommendations.map(rec => rec.category))]
  
  return (
    <Card className="bg-white dark:bg-slate-950 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex flex-row items-center justify-between">
          <CardTitle>💡 Energy Saving Suggestions</CardTitle>
          <div className="flex space-x-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 text-sm rounded-full ${selectedCategory === category 
                  ? 'bg-amber-500 text-white' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredRecommendations.map((rec, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-md border-l-4 ${getCategoryColor(rec.category)}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{rec.device}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{rec.issue}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded ${getCategoryBadgeColor(rec.category)}`}>
                  {rec.category}
                </span>
              </div>
              <ul className="list-disc pl-5 space-y-1 mb-2">
                {rec.recommendation.map((item, i) => (
                  <li key={i} className="text-sm">{item}</li>
                ))}
              </ul>
              <div className="text-sm font-medium text-green-600 dark:text-green-400">
                Potential Savings: {rec.potential_savings}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function getCategoryColor(category: string): string {
  switch (category.toLowerCase()) {
    case 'critical':
      return 'border-red-500 bg-red-50 dark:bg-red-900/20'
    case 'high priority':
      return 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
    case 'medium priority':
      return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
    case 'general':
      return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
    case 'behavioral':
      return 'border-green-500 bg-green-50 dark:bg-green-900/20'
    default:
      return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20'
  }
}

function getCategoryBadgeColor(category: string): string {
  switch (category.toLowerCase()) {
    case 'critical':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    case 'high priority':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
    case 'medium priority':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    case 'general':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    case 'behavioral':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
  }
}