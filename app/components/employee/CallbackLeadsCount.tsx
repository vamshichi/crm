"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Bell, ChevronDown, ChevronUp, Clock, Phone, User } from "lucide-react"
import { useEffect, useState } from "react"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"

interface CallbackLeadsCountProps {
  employeeId: string
}

interface Lead {
  id: string
  name: string
  // phone: string
  callBackTime?: string
}

export default function CallbackLeadsCount({ employeeId }: CallbackLeadsCountProps) {
  const [count, setCount] = useState<number>(0)
  const [maxLeads, setMaxLeads] = useState<number>(50)
  const [loading, setLoading] = useState<boolean>(true)
  const [showLeads, setShowLeads] = useState<boolean>(false)
  const [leads, setLeads] = useState<Lead[]>([])

  useEffect(() => {
    if (!employeeId) {
      console.error("❌ No Employee ID provided!")
      return
    }

    async function fetchCallbackLeadsCount() {
      try {
        console.log(`🔍 Fetching count for Employee ID: ${employeeId}`)
        const response = await fetch(`/api/leads/callback-count?employeeId=${employeeId}`)
        const data = await response.json()
        console.log("✅ API Response:", data)

        setCount(data.callbackLeadsCount || 0)
        setMaxLeads(data.maxLeads || 50)
      } catch (error) {
        console.error("❌ Error fetching callback leads count:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCallbackLeadsCount()
  }, [employeeId])

  // Function to fetch callback leads details when clicked
  const fetchLeads = async () => {
    if (!showLeads) {
      try {
        const response = await fetch(`/api/leads/callback-details?employeeId=${employeeId}`)
        const data = await response.json()
        setLeads(data.leads || [])
      } catch (error) {
        console.error("❌ Error fetching callback leads details:", error)
      }
    }
    setShowLeads((prev) => !prev)
  }

  // Function to determine status color
  const getStatusColor = (count: number, maxLeads: number) => {
    const percentage = (count / maxLeads) * 100
    if (percentage < 30) return "bg-emerald-500"
    if (percentage < 70) return "bg-amber-500"
    return "bg-rose-500"
  }

  // Format callback time
  const formatCallbackTime = (timeString?: string) => {
    if (!timeString) return "No scheduled time"

    try {
      const date = new Date(timeString)
      const today = new Date()

      // Check if it's today
      if (date.toDateString() === today.toDateString()) {
        return `Today at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
      }

      // Check if it's tomorrow
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      if (date.toDateString() === tomorrow.toDateString()) {
        return `Tomorrow at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
      }

      // Otherwise show full date
      return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      return "Invalid date"
    }
  }

  return (
    <Card className="w-full max-w-md shadow-lg border-0 overflow-hidden bg-white transition-all duration-300 hover:shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-white" />
            <h3 className="text-lg font-semibold text-white">Callback Leads</h3>
          </div>
          <Badge variant="outline" className="bg-white/20 text-white border-0 backdrop-blur-sm">
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div
          className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
          onClick={fetchLeads}
        >
          <div className="flex items-center gap-4">
            {loading ? (
              <div className="w-16 h-16 rounded-full border-4 border-blue-500 border-dashed animate-spin flex items-center justify-center">
                <span className="sr-only">Loading...</span>
              </div>
            ) : ( 
              <div className="relative w-16 h-16">
                <CircularProgressbar
                  value={(count / maxLeads) * 100}
                  text={`${count}`}
                  styles={buildStyles({
                    textSize: "28px",
                    pathColor: count < maxLeads / 2 ? "#10b981" : count < maxLeads * 0.8 ? "#f59e0b" : "#ef4444",
                    textColor: "#1e293b",
                    trailColor: "#e2e8f0",
                  })}
                />
                <div
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${getStatusColor(count, maxLeads)} border-2 border-white`}
                ></div>
              </div>
            )}

            <div>
              <p className="font-medium text-slate-800">{count} pending callbacks</p>
              {/* <p className="text-sm text-slate-500">{maxLeads - count} slots available</p> */}
            </div>
          </div>

          <div className="text-slate-400">
            {showLeads ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        </div>

        {showLeads && (
          <>
            <Separator />
            <div className="p-4">
              <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">Pending Callbacks</h4>

              <div className="max-h-80 overflow-y-auto pr-1 space-y-3">
                {leads.length > 0 ? (
                  leads.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                          <User className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-800 truncate">{lead.name}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {/* <span>{lead.phone}</span> */}
                            </div>
                            <span className="text-slate-300">•</span>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatCallbackTime(lead.callBackTime)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-slate-500">No pending callbacks found</p>
                    <p className="text-sm text-slate-400 mt-1">All caught up!</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

