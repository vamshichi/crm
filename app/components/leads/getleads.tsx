"use client"

import type React from "react"
import { useEffect, useState } from "react"
import LeadFilter from "@/app/components/employee/LeadFilter"
import * as XLSX from "xlsx"

interface Lead {
  id: string
  name: string
  email: string
  status: string
  createdAt: string
  city: string
  message: string
  designaction: string
  phone: string
  company: string
  callBackTime: string
}

interface EmployeeLeadsProps {
  employeeId: string
}

const EmployeeLeads: React.FC<EmployeeLeadsProps> = ({ employeeId }) => {
  const [leads, setLeads] = useState<Lead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [fromDate, setFromDate] = useState<string | null>(null)
  const [toDate, setToDate] = useState<string | null>(null)

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await fetch(`/api/employee-leads?employeeId=${employeeId}`)
        if (!res.ok) {
          throw new Error("Failed to fetch leads")
        }
        const data = await res.json()
        setLeads(data)
        setFilteredLeads(data)
        setLoading(false)
      } catch (err) {
        setError((err as Error).message)
        setLoading(false)
      }
    }
    fetchLeads()
  }, [employeeId])

  useEffect(() => {
    let updatedLeads = leads

    if (selectedStatus) {
      updatedLeads = updatedLeads.filter((lead) => lead.status.toLowerCase() === selectedStatus.toLowerCase())
    }

    if (fromDate) {
      updatedLeads = updatedLeads.filter((lead) => new Date(lead.createdAt) >= new Date(fromDate))
    }

    if (toDate) {
      updatedLeads = updatedLeads.filter((lead) => new Date(lead.createdAt) <= new Date(toDate))
    }

    setFilteredLeads(updatedLeads)
  }, [selectedStatus, fromDate, toDate, leads])

  const totalLeads = filteredLeads.length
  const hotLeads = filteredLeads.filter((lead) => lead.status.toLowerCase() === "hot").length
  const soldLeads = filteredLeads.filter((lead) => lead.status.toLowerCase() === "sold").length
  const target = 50
  const remainingTarget = target > soldLeads ? target - soldLeads : 0

  const handleWeekFilter = () => {
    const today = new Date()
    const firstDayOfWeek = new Date(today)
    firstDayOfWeek.setDate(today.getDate() - today.getDay())
    const lastDayOfWeek = new Date(firstDayOfWeek)
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6)

    setFromDate(firstDayOfWeek.toISOString().split("T")[0])
    setToDate(lastDayOfWeek.toISOString().split("T")[0])
  }

  const handleExportToExcel = () => {
    if (filteredLeads.length === 0) {
      alert("No leads available to export.")
      return
    }

    const worksheet = XLSX.utils.json_to_sheet(filteredLeads)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads")

    XLSX.writeFile(workbook, "leads.xlsx")
  }

  const handleImportLeads = async (file: File) => {
    try {
      const response = await fetch("/api/leads/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: file,
      })

      if (response.ok) {
        alert("Leads imported successfully!")
        // Refresh leads after import
        const res = await fetch(`/api/employee-leads?employeeId=${employeeId}`)
        if (res.ok) {
          const data = await res.json()
          setLeads(data)
          setFilteredLeads(data)
        }
      } else {
        alert("Error importing leads")
      }
    } catch (error) {
      console.error("Error importing leads:", error)
      alert("Error importing leads")
    }
  }

  return (
    <div className="p-10 mt-10 bg-white shadow-lg rounded-lg">
      <div className="grid grid-cols-5 gap-4 mt-4 p-20">
        <div className="text-center p-4 bg-gray-100 rounded-lg">
          <p className="text-lg font-bold">{totalLeads}</p>
          <p className="text-sm text-gray-500">Total Leads</p>
        </div>
        <div className="text-center p-4 bg-yellow-100 rounded-lg">
          <p className="text-lg font-bold">{hotLeads}</p>
          <p className="text-sm text-gray-500">Hot Leads</p>
        </div>
        <div className="text-center p-4 bg-green-100 rounded-lg">
          <p className="text-lg font-bold">{soldLeads}</p>
          <p className="text-sm text-gray-500">Sold Leads</p>
        </div>
        <div className="text-center p-4 bg-blue-100 rounded-lg">
          <p className="text-lg font-bold">{target}</p>
          <p className="text-sm text-gray-500">Target</p>
        </div>
        <div className="text-center p-4 bg-red-100 rounded-lg">
          <p className="text-lg font-bold">{remainingTarget}</p>
          <p className="text-sm text-gray-500">Remaining Target</p>
        </div>
      </div>
      <h2 className="text-2xl font-semibold mb-4">Employee Leads</h2>

      <LeadFilter
        selectedStatus={selectedStatus}
        fromDate={fromDate}
        toDate={toDate}
        employeeId={employeeId}
        onStatusChange={setSelectedStatus}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onWeekFilter={handleWeekFilter}
        onExport={handleExportToExcel}
        onFileImport={handleImportLeads}
      />

      <div className="mt-6">
        {loading ? (
          <p>Loading leads...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filteredLeads.length === 0 ? (
          <p className="text-gray-500">No leads found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    City
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  designaction
                  </th> */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Note
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Call Back Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{lead.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{lead.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{lead.company}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{lead.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{lead.city}</td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">{lead.designaction}</td> */}
                    <td className="px-6 py-4 whitespace-nowrap">{lead.message}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{lead.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(lead.callBackTime).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default EmployeeLeads

