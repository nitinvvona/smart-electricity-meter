"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Lightbulb, Zap, BarChart3, Info } from "lucide-react"

export default function SuggestionsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  
  // Educational content about electricity usage
  const educationalContent = [
    {
      id: "understanding-usage",
      title: "Understanding Your Electricity Usage",
      icon: <BarChart3 className="h-5 w-5 text-blue-500" />,
      content: (
        <div className="space-y-3">
          <p>Your electricity bill is calculated based on kilowatt-hours (kWh) consumed. One kWh is the amount of energy used by a 1,000-watt appliance running for one hour.</p>
          <p>The average Indian household consumes approximately 250-300 kWh per month. Your usage patterns show peaks during evening hours (6-9 PM) and higher consumption from air conditioning units during summer months.</p>
          <p>Understanding your usage patterns is the first step toward reducing consumption and saving money.</p>
        </div>
      )
    },
    {
      id: "peak-hours",
      title: "Managing Peak Hour Consumption",
      icon: <Zap className="h-5 w-5 text-amber-500" />,
      content: (
        <div className="space-y-3">
          <p>Electricity demand is highest during peak hours, typically 6-10 PM in most regions. During these hours, power generation costs are higher and the grid is under more stress.</p>
          <p>Your data shows significant usage during these peak hours, particularly from AC units and heating devices.</p>
          <p>Shifting energy-intensive activities to off-peak hours can reduce your electricity costs and help balance the load on the power grid.</p>
        </div>
      )
    },
    {
      id: "energy-efficiency",
      title: "Energy Efficiency Basics",
      icon: <Lightbulb className="h-5 w-5 text-green-500" />,
      content: (
        <div className="space-y-3">
          <p>Energy efficiency means using less energy to perform the same task. This reduces both energy consumption and costs.</p>
          <p>The most energy-efficient appliances are rated with BEE (Bureau of Energy Efficiency) star ratings in India. Higher star ratings indicate better efficiency.</p>
          <p>Simple changes like using LED bulbs instead of incandescent ones can reduce lighting energy use by up to 80%.</p>
        </div>
      )
    }
  ]
  
  // Energy saving suggestions from the energy_advisor.py analysis
  const suggestions = [
    {
      id: 1,
      device: "AC Unit",
      category: "critical",
      issue: "Simultaneous use of AC and Heater",
      action: "Avoid using AC and heater simultaneously. This creates conflicting energy demands.",
      savings: "Up to 30% reduction in energy waste"
    },
    {
      id: 2,
      device: "AC Unit",
      category: "high",
      issue: "Peak hour usage",
      action: "Reduce AC usage during peak hours (6-9 PM). Consider using fans instead.",
      savings: "15-20% on electricity bills"
    },
    {
      id: 3,
      device: "Heater",
      category: "high",
      issue: "Excessive usage",
      action: "Lower heater temperature by 2°C and use warm clothing instead.",
      savings: "10% per degree reduction"
    },
    {
      id: 4,
      device: "All Devices",
      category: "medium",
      issue: "Standby power consumption",
      action: "Unplug devices when not in use or use smart power strips.",
      savings: "Up to 10% on total electricity usage"
    },
    {
      id: 5,
      device: "Fan",
      category: "medium",
      issue: "Continuous operation",
      action: "Use timers to automatically turn off fans when not needed.",
      savings: "5-8% on fan electricity usage"
    },
    {
      id: 6,
      device: "AC Unit",
      category: "general",
      issue: "Inefficient temperature setting",
      action: "Set AC to 24-26°C for optimal efficiency.",
      savings: "7-10% on cooling costs"
    },
    {
      id: 7,
      device: "Lighting",
      category: "general",
      issue: "Inefficient lighting",
      action: "Replace conventional bulbs with LED lighting.",
      savings: "Up to 80% on lighting costs"
    },
    {
      id: 8,
      device: "All Devices",
      category: "general",
      issue: "Unmonitored usage patterns",
      action: "Regularly check the smart meter dashboard to identify unusual consumption.",
      savings: "5-15% through awareness and behavioral changes"
    },
  ]
  
  const filteredSuggestions = selectedCategory === "all" 
    ? suggestions 
    : suggestions.filter(s => s.category === selectedCategory)
  
  const getCategoryColor = (category: string) => {
    switch(category) {
      case "critical": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "high": return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
      case "medium": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "general": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }
  
  return (
    <div className="container mx-auto py-6 space-y-8 px-4">
      <div className="flex flex-col items-center justify-center mb-6">
        <h1 className="text-3xl font-bold mb-2">Energy Saving Suggestions</h1>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-2xl">
          Based on analysis of your September 2025 power usage data, here are personalized recommendations to help reduce your electricity consumption.
        </p>
      </div>
      
      {/* Educational Content Section */}
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            Educational Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {educationalContent.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.title}</span>
                </AccordionTrigger>
                <AccordionContent>
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
      
      {/* Personalized Suggestions Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Personalized Recommendations</h2>
        <Tabs defaultValue="all" onValueChange={setSelectedCategory}>
          <TabsList className="grid grid-cols-5 w-full max-w-2xl mx-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="critical">Critical</TabsTrigger>
            <TabsTrigger value="high">High</TabsTrigger>
            <TabsTrigger value="medium">Medium</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSuggestions.map(suggestion => (
          <Card key={suggestion.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{suggestion.device}</CardTitle>
                <Badge className={getCategoryColor(suggestion.category)}>
                  {suggestion.category.charAt(0).toUpperCase() + suggestion.category.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">Issue:</h3>
                  <p>{suggestion.issue}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Recommended Action:</h3>
                  <p>{suggestion.action}</p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded-md">
                  <h3 className="font-semibold text-lg text-amber-700 dark:text-amber-300">Potential Savings:</h3>
                  <p className="text-amber-700 dark:text-amber-300">{suggestion.savings}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}