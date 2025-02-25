"use client"

import type React from "react"
import { useRef } from "react"
import * as XLSX from "xlsx"

interface LeadFilterProps {
  selectedStatus: string | null
  fromDate: string | null
  toDate: string | null
  employeeId: string
  onStatusChange: (status: string | null) => void
  onFromDateChange: (date: string | null) => void
  onToDateChange: (date: string | null) => void
  onWeekFilter: () => void
  onExport: () => void
  onFileImport: (file: File) => void
}

const statuses = ["HOT", "COLD", "WARM", "SOLD", "CALL_BACK"] as const
type Status = (typeof statuses)[number]

interface ImportedLead {
  Name: string
  Email: string
  Company: string
  Phone: string
  City: string
  Message: string
  Status: Status
  "Call Back Time": string
}

const LeadFilter: React.FC<LeadFilterProps> = ({
  selectedStatus,
  fromDate,
  toDate,
  employeeId,
  onStatusChange,
  onFromDateChange,
  onToDateChange,
  onWeekFilter,
  onExport,
  onFileImport,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const data = e.target?.result
      if (!data) return

      const workbook = XLSX.read(data, { type: "binary" })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json<ImportedLead>(sheet)

      const formattedData = jsonData.map((lead) => ({
        name: lead.Name,
        email: lead.Email,
        company: lead.Company,
        phone: lead.Phone,
        city: lead.City,
        message: lead.Message,
        status: lead.Status,
        callBackTime: lead["Call Back Time"],
        employeeId: employeeId,
      }))

      onFileImport(new File([JSON.stringify(formattedData)], "importedLeads.json", { type: "application/json" }))
    }

    reader.readAsBinaryString(file)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const downloadTemplate = () => {
    const templateData = [
      ["Name", "Email", "Company", "Phone", "City", "Message", "Status", "Call Back Time"],
      ["John Doe", "john@example.com", "ABC Corp", "1234567890", "New York", "Interested", "HOT", "2025-02-24T10:00"],
    ]

    const worksheet = XLSX.utils.aoa_to_sheet(templateData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template")

    XLSX.writeFile(workbook, "Lead_Template.xlsx")
  }

  return (
    <div className="mb-4 flex flex-wrap gap-2 items-center">
      {statuses.map((status) => (
        <button
          key={status}
          onClick={() => onStatusChange(status === selectedStatus ? null : status)}
          className={`px-4 py-2 rounded-md border ${
            selectedStatus === status ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          {status}
        </button>
      ))}

      <button onClick={onWeekFilter} className="px-4 py-2 rounded-md border bg-green-500 text-white">
        This Week
      </button>

      <div className="flex items-center gap-2">
        <label htmlFor="from-date" className="text-sm font-semibold">
          From:
        </label>
        <input
          id="from-date"
          type="date"
          value={fromDate || ""}
          onChange={(e) => onFromDateChange(e.target.value || null)}
          className="px-4 py-2 border rounded-md"
        />
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="to-date" className="text-sm font-semibold">
          To:
        </label>
        <input
          id="to-date"
          type="date"
          value={toDate || ""}
          onChange={(e) => onToDateChange(e.target.value || null)}
          className="px-4 py-2 border rounded-md"
        />
      </div>

      <button onClick={onExport} className="px-4 py-2 rounded-md border bg-yellow-500 text-white">
        Export to Excel
      </button>

      <button onClick={triggerFileInput} className="px-4 py-2 rounded-md border bg-blue-500 text-white">
        Import Excel
      </button>
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".xlsx, .xls" className="hidden" />

      <button onClick={downloadTemplate} className="px-4 py-2 rounded-md border bg-purple-500 text-white">
        Download Template
      </button>
    </div>
  )
}

export default LeadFilter

