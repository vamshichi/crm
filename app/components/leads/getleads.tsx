"use client"

import LeadFilter from "@/app/components/employee/LeadFilter"
import type React from "react"
import { useEffect, useState } from "react"
import * as XLSX from "xlsx"
import { DollarSign, Edit, Filter, MoreHorizontal, X } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import LeadSearchPage from "./search/page"


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
  soldAmount: string
}

interface EmployeeLeadsProps {
  employeeId: string
}

const EmployeeLeads: React.FC<EmployeeLeadsProps> = ({ employeeId }) => {
  const [leads, setLeads] = useState<Lead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, ] = useState("")

  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [fromDate, setFromDate] = useState<string | null>(null)
  const [toDate, setToDate] = useState<string | null>(null)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [formData, setFormData] = useState<Partial<Lead>>({})
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [showSoldPopup, setShowSoldPopup] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

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

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      updatedLeads = updatedLeads.filter(
        (lead) =>
          lead.name.toLowerCase().includes(search) ||
          lead.email.toLowerCase().includes(search) ||
          lead.company.toLowerCase().includes(search) ||
          lead.phone.includes(search),
      )
    }

    // Apply status filter
    if (selectedStatus) {
      updatedLeads = updatedLeads.filter((lead) => lead.status.toLowerCase() === selectedStatus.toLowerCase())
    }

    // Apply date filters
    if (fromDate) {
      updatedLeads = updatedLeads.filter((lead) => new Date(lead.createdAt) >= new Date(fromDate))
    }

    if (toDate) {
      updatedLeads = updatedLeads.filter((lead) => new Date(lead.createdAt) <= new Date(toDate))
    }

    setFilteredLeads(updatedLeads)
  }, [selectedStatus, fromDate, toDate, leads, searchTerm])

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

  const handleUpdateLead = async () => {
    if (!selectedLead) return

    try {
      const response = await fetch(`/api/editlead`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const text = await response.text()
      const responseData = text ? JSON.parse(text) : {}

      if (!response.ok) {
        console.error("Server Error Response:", responseData)
        throw new Error("Failed to update lead")
      }

      setLeads((prevLeads) => prevLeads.map((lead) => (lead.id === responseData.id ? responseData : lead)))

      setFilteredLeads((prevLeads) => prevLeads.map((lead) => (lead.id === responseData.id ? responseData : lead)))

      setSelectedLead(null)
      alert("Lead Updated Successfully!")
    } catch (error) {
      console.error("Error updating lead:", error)
      alert("Error updating lead")
    }
  }

  const handleEditClick = (lead: Lead) => {
    setSelectedLead(lead)
    setFormData(lead)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value }

      // If status is changing from "SOLD" to anything else, reset soldAmount
      if (name === "status" && prevData.status === "SOLD" && value !== "SOLD") {
        updatedData.soldAmount = "0"
      }

      return updatedData
    })
  }

  const toggleRowExpansion = (leadId: string) => {
    if (expandedRow === leadId) {
      setExpandedRow(null)
    } else {
      setExpandedRow(leadId)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    try {
      return new Date(dateString).toLocaleString("en-IN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return "Invalid Date"
    }
  }

  const handleSoldAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, soldAmount: e.target.value })
  }

  const handleSoldAmountSubmit = () => {
    setShowSoldPopup(false)
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      HOT: "bg-red-100 text-red-800",
      WARM: "bg-yellow-100 text-yellow-800",
      COLD: "bg-blue-100 text-blue-800",
      SOLD: "bg-green-100 text-green-800",
      CALL_BACK: "bg-purple-100 text-purple-800",
    }

    const color = statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"

    return (
      <Badge variant="outline" className={`${color} border-0 whitespace-nowrap`}>
        {status}
      </Badge>
    )
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-0">
        <div className="flex flex-col gap-4">
                <LeadSearchPage/>
              
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-semibold">Employee Leads</h2>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="icon"
                className="flex-shrink-0"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={18} />
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
            <Card className="border border-gray-100 shadow-sm">
              <CardContent className="p-3 text-center">
                <p className="text-lg font-bold">{totalLeads}</p>
                <p className="text-xs text-gray-500">Total Leads</p>
              </CardContent>
            </Card>
            <Card className="border border-yellow-100 bg-yellow-50 shadow-sm">
              <CardContent className="p-3 text-center">
                <p className="text-lg font-bold">{hotLeads}</p>
                <p className="text-xs text-gray-500">Hot Leads</p>
              </CardContent>
            </Card>
            <Card className="border border-green-100 bg-green-50 shadow-sm">
              <CardContent className="p-3 text-center">
                <p className="text-lg font-bold">{soldLeads}</p>
                <p className="text-xs text-gray-500">Sold Leads</p>
              </CardContent>
            </Card>
            <Card className="border border-blue-100 bg-blue-50 shadow-sm">
              <CardContent className="p-3 text-center">
                <p className="text-lg font-bold">{target}</p>
                <p className="text-xs text-gray-500">Target</p>
              </CardContent>
            </Card>
            <Card className="border border-red-100 bg-red-50 shadow-sm">
              <CardContent className="p-3 text-center">
                <p className="text-lg font-bold">{remainingTarget}</p>
                <p className="text-xs text-gray-500">Remaining Target</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="bg-gray-50 p-4 rounded-lg mt-2">
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
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center p-6 text-red-500">{error}</div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center p-10 text-gray-500">
            <p className="text-lg font-medium">No leads found</p>
            <p className="text-sm mt-1">Try adjusting your filters or search criteria</p>
          </div>
        ) : (
          <>
            {/* Desktop Table - Hidden on mobile */}
            <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-100">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-medium">Name</TableHead>
                    <TableHead className="font-medium">Company</TableHead>
                    <TableHead className="font-medium">Contact</TableHead>
                    <TableHead className="font-medium">Status</TableHead>
                    <TableHead className="font-medium">Call Back</TableHead>
                    <TableHead className="font-medium">Amount</TableHead>
                    <TableHead className="font-medium w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow key={lead.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <p className="font-medium">{lead.name}</p>
                          <p className="text-xs text-gray-500">{lead.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{lead.company}</p>
                          <p className="text-xs text-gray-500">{lead.city}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p>{lead.phone}</p>
                        <p className="text-xs text-gray-500">{lead.designaction}</p>
                      </TableCell>
                      <TableCell>{getStatusBadge(lead.status)}</TableCell>
                      <TableCell className="text-xs">{formatDate(lead.callBackTime)}</TableCell>
                      <TableCell className="font-medium text-green-600">
                        {lead.soldAmount ? `₹${lead.soldAmount}` : "-"}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditClick(lead)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Lead
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View - Visible only on mobile */}
            <div className="md:hidden space-y-4">
              {filteredLeads.map((lead) => (
                <Card key={lead.id} className="overflow-hidden border border-gray-100">
                  <CardContent className="p-0">
                    <div
                      className="p-4 flex justify-between items-center cursor-pointer"
                      onClick={() => toggleRowExpansion(lead.id)}
                    >
                      <div>
                        <h3 className="font-medium">{lead.name}</h3>
                        <p className="text-sm text-gray-500">{lead.company}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(lead.status)}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditClick(lead)
                          }}
                        >
                          <Edit size={16} />
                        </Button>
                      </div>
                    </div>

                    {expandedRow === lead.id && (
                      <div className="px-4 pb-4 pt-2 border-t border-gray-100 space-y-3 text-sm">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-gray-500 text-xs">Email:</p>
                            <p className="break-all">{lead.email}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Phone:</p>
                            <p>{lead.phone}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-gray-500 text-xs">City:</p>
                            <p>{lead.city}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Designation:</p>
                            <p>{lead.designaction}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-gray-500 text-xs">Call Back Time:</p>
                            <p>{formatDate(lead.callBackTime)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Sold Amount:</p>
                            <p className="font-medium text-green-600">
                              {lead.soldAmount ? `₹${lead.soldAmount}` : "-"}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-gray-500 text-xs">Note:</p>
                          <p>{lead.message}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Edit Lead Modal */}
        {selectedLead && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center p-4 z-50 transition-opacity duration-300">
            <div className="bg-white/90 p-6 sm:p-8 rounded-xl w-full max-w-lg sm:max-w-xl md:max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh] transition-transform transform scale-95 animate-fadeIn">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Edit Lead</h2>
                <button onClick={() => setSelectedLead(null)} className="p-2 rounded-full hover:bg-gray-200 transition">
                  <X size={22} className="text-gray-700" />
                </button>
              </div>

              {/* Sold Amount Popup */}
              {showSoldPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Enter Sold Amount</h3>
                      <button onClick={() => setShowSoldPopup(false)} className="text-gray-500 hover:text-gray-700">
                        <X size={20} />
                      </button>
                    </div>

                    <div className="relative mb-4">
                      <DollarSign className="absolute left-3 top-3 text-gray-500" size={18} />
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        name="soldAmount"
                        placeholder="Sold Amount"
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        onChange={handleSoldAmountChange}
                        value={formData.soldAmount}
                        required
                      />
                    </div>

                    <button
                      onClick={handleSoldAmountSubmit}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg transition-transform transform hover:scale-105"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-4 overflow-y-auto max-h-[60vh] p-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleFormChange}
                      className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ""}
                      onChange={handleFormChange}
                      className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company || ""}
                      onChange={handleFormChange}
                      className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone || ""}
                      onChange={handleFormChange}
                      className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                  <textarea
                    name="message"
                    value={formData.message || ""}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      name="status"
                      value={formData.status || ""}
                      onChange={handleFormChange}
                      className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="HOT">HOT</option>
                      <option value="WARM">WARM</option>
                      <option value="COLD">COLD</option>
                      <option value="SOLD">SOLD</option>
                      <option value="CALL_BACK">CALL BACK</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Call Back Time</label>
                    <input
                      type="datetime-local"
                      name="callBackTime"
                      value={formData.callBackTime || ""}
                      onChange={handleFormChange}
                      className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {formData.status === "SOLD" && (
                  <div className="flex items-center gap-2 p-3 bg-blue-100 rounded-lg">
                    <DollarSign className="text-blue-600" size={20} />
                    <span className="text-gray-900 font-medium">Sold Amount: ₹{formData.soldAmount}</span>
                    <button
                      type="button"
                      onClick={() => setShowSoldPopup(true)}
                      className="ml-auto text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>

              {/* Footer Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                <Button variant="secondary" onClick={() => setSelectedLead(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateLead}>Save Changes</Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default EmployeeLeads

