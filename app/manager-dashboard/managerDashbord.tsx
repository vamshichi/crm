"use client"

import CircularProgress from "@/app/components/ui/CircularProgress"
import { Eye, Loader } from "lucide-react"
import { useRouter } from "next/navigation"

interface DashboardStatsProps {
  department: {
    id: string
    name: string
    target?: number
    totalLeads: number
    soldLeads: number
    managers?: Array<{
      id: string
      name: string
      leads: Array<{
        id: string
        status: string
        createdAt: string
      }>
    }>
  } | null
  error: string | null
  loading: boolean
}

export default function DashboardStats({ department, error, loading }: DashboardStatsProps) {
  const router = useRouter()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-center mx-4 my-6">{error}</div>
    )
  }

  if (!department) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-lg text-center mx-4 my-6">
        No department data found. Please contact an administrator.
      </div>
    )
  }

  const target = department.target || 0
  const totalLeadsPercentage = target > 0 ? Math.min(Math.round((department.totalLeads / target) * 100), 100) : 0
  const soldLeadsPercentage = target > 0 ? Math.min(Math.round((department.soldLeads / target) * 100), 100) : 0
  const remaining = target > 0 ? Math.max(target - department.soldLeads, 0) : 0
  const remainingPercentage = target > 0 ? Math.min(Math.round((remaining / target) * 100), 100) : 0

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h3 className="text-xl sm:text-2xl font-semibold text-center">{department.name} Department</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-4 sm:py-6">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28">
            <CircularProgress value={totalLeadsPercentage} text={`${department.totalLeads}`} />
          </div>
          <p className="text-center mt-2 text-sm text-gray-600">Total Leads</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28">
            <CircularProgress value={soldLeadsPercentage} text={`${department.soldLeads}`} />
          </div>
          <p className="text-center mt-2 text-sm text-gray-600">Sold Leads</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28">
            <CircularProgress value={remainingPercentage} text={`${remaining}`} />
          </div>
          <p className="text-center mt-2 text-sm text-gray-600">Remaining</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h4 className="text-lg font-semibold text-center mb-4">Managers</h4>
        {department.managers && department.managers.length > 0 ? (
          <div className="space-y-2">
            {department.managers.map((manager) => (
              <div
                key={manager.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg"
              >
                <span className="font-medium mb-2 sm:mb-0">{manager.name}</span>
                <button
                  onClick={() => router.push(`/manager/${manager.id}`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 rounded flex items-center justify-center gap-1 text-sm w-full sm:w-auto"
                >
                  <Eye size={16} /> <span>View Details</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">No managers found.</p>
        )}
      </div>
    </div>
  )
}

