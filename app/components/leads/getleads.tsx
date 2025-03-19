"use client"

import LeadFilter from "@/app/components/employee/LeadFilter"
import type React from "react"
import { useEffect, useState } from "react"
import * as XLSX from "xlsx"
import { DollarSign, Edit, X } from "lucide-react"
import LeadSearchPage from "./search/page"
// import GlobalSearch from "../employee/global-search"

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
  soldAmount: string,
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
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [formData, setFormData] = useState<Partial<Lead>>({})
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [showSoldPopup, setShowSoldPopup] = useState(false)

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
    const { name, value } = e.target;
  
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
  
      // If status is changing from "SOLD" to anything else, reset soldAmount
      if (name === "status" && prevData.status === "SOLD" && value !== "SOLD") {
        updatedData.soldAmount = "0";
      }
  
      return updatedData;
    });
  };
  

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
    } catch (e) {
      return "Invalid Date"
    }
  }

 const handleSoldAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, soldAmount: e.target.value })
  }

  const handleSoldAmountSubmit = () => {
    setShowSoldPopup(false)
  }
  return (
    <div className="p-4 sm:p-6 md:p-10 mt-4 sm:mt-6 md:mt-10 bg-white shadow-lg rounded-lg">
      <LeadSearchPage/>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4 mb-6">
        <div className="text-center p-2 sm:p-4 bg-gray-100 rounded-lg">
          <p className="text-base sm:text-lg font-bold">{totalLeads}</p>
          <p className="text-xs sm:text-sm text-gray-500">Total Leads</p>
        </div>
        <div className="text-center p-2 sm:p-4 bg-yellow-100 rounded-lg">
          <p className="text-base sm:text-lg font-bold">{hotLeads}</p>
          <p className="text-xs sm:text-sm text-gray-500">Hot Leads</p>
        </div>
        <div className="text-center p-2 sm:p-4 bg-green-100 rounded-lg">
          <p className="text-base sm:text-lg font-bold">{soldLeads}</p>
          <p className="text-xs sm:text-sm text-gray-500">Sold Leads</p>
        </div>
        <div className="text-center p-2 sm:p-4 bg-blue-100 rounded-lg">
          <p className="text-base sm:text-lg font-bold">{target}</p>
          <p className="text-xs sm:text-sm text-gray-500">Target</p>
        </div>
        <div className="text-center p-2 sm:p-4 bg-red-100 rounded-lg">
          <p className="text-base sm:text-lg font-bold">{remainingTarget}</p>
          <p className="text-xs sm:text-sm text-gray-500">Remaining Target</p>
        </div>
      </div>

      <h2 className="text-xl sm:text-2xl font-semibold mb-4">Employee Leads</h2>

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
          <>
            {/* Desktop Table - Hidden on mobile */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      City
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Note
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Call Back
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Designation
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  Sold Amount
</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id}>
                      <td className="px-4 py-3 whitespace-nowrap">{lead.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{lead.email}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{lead.company}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{lead.phone}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{lead.city}</td>
                      <td className="px-4 py-3 whitespace-nowrap max-w-[150px] truncate">{lead.message}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            lead.status === "HOT"
                              ? "bg-red-100 text-red-800"
                              : lead.status === "WARM"
                                ? "bg-yellow-100 text-yellow-800"
                                : lead.status === "COLD"
                                  ? "bg-blue-100 text-blue-800"
                                  : lead.status === "SOLD"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs">{formatDate(lead.callBackTime)}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{lead.designaction}</td>
                      <td className="px-4 py-3 whitespace-nowrap font-medium text-green-600">
  ₹{lead.soldAmount}
</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          onClick={() => handleEditClick(lead)}
                          className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm flex items-center gap-1"
                        >
                          <Edit size={14} />
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
            </div>

            {/* Mobile Card View - Visible only on mobile */}
            <div className="md:hidden space-y-4">
              {filteredLeads.map((lead) => (
                <div key={lead.id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
                  <div
                    className="p-4 flex justify-between items-center cursor-pointer"
                    onClick={() => toggleRowExpansion(lead.id)}
                  >
                    <div>
                      <h3 className="font-medium">{lead.name}</h3>
                      <p className="text-sm text-gray-500">{lead.company}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          lead.status === "HOT"
                            ? "bg-red-100 text-red-800"
                            : lead.status === "WARM"
                              ? "bg-yellow-100 text-yellow-800"
                              : lead.status === "COLD"
                                ? "bg-blue-100 text-blue-800"
                                : lead.status === "SOLD"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {lead.status}
                        
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditClick(lead)
                        }}
                        className="p-1.5 bg-blue-500 text-white rounded-full"
                      >
                        <Edit size={14} />
                      </button>
                    </div>
                  </div>

                  {expandedRow === lead.id && (
                    <div className="px-4 pb-4 pt-2 border-t border-gray-100 space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-gray-500 text-xs">Email:</p>
                          <p className="break-all">{lead.email}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Phone:</p>
                          <p>{lead.phone}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-gray-500 text-xs">City:</p>
                          <p>{lead.city}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Designation:</p>
                          <p>{lead.designaction}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-gray-500 text-xs">Call Back Time:</p>
                        <p>{formatDate(lead.callBackTime)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Sold Amount:</p>
                        <p>  ₹{(lead.soldAmount)}</p>
                      </div>

                      <div>
                        <p className="text-gray-500 text-xs">Note:</p>
                        <p>{lead.message}</p>
                      </div>
                    </div>
                  )}
                </div>
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
            <span className="text-gray-900 font-medium">Sold Amount: ${formData.soldAmount}</span>
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
        <button
          onClick={() => setSelectedLead(null)}
          className="px-5 py-2 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleUpdateLead}
          className="px-5 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  )
}

export default EmployeeLeads

