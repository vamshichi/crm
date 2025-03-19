"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import {
  User,
  Mail,
  Building,
  Phone,
  MapPin,
  MessageCircle,
  Calendar,
  Loader2,
  Briefcase,
  DollarSign,
  X,
} from "lucide-react"

export default function LeadForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    city: "",
    message: "",
    status: "HOT",
    employeeId: "",
    callBackTime: "",
    designaction: "",
    soldAmount: "0",
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [showSoldPopup, setShowSoldPopup] = useState(false)

  const pathname = usePathname()

  useEffect(() => {
    const pathSegments = pathname.split("/")
    const employeeId = pathSegments[pathSegments.length - 1]
    if (employeeId) {
      setFormData((prev) => ({ ...prev, employeeId }))
    }
  }, [pathname])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === "status" && value === "SOLD") {
      setShowSoldPopup(true)
    }

    setFormData({ ...formData, [name]: value })
  }

  const handleSoldAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, soldAmount: e.target.value })
  }

  const handleSoldAmountSubmit = () => {
    setShowSoldPopup(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const submissionData = {
        ...formData,
        soldAmount: formData.status === "SOLD" ? formData.soldAmount : undefined,
      }

      const response = await fetch("/api/addLead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      })

      const data = await response.json()
      if (response.ok) {
        setMessage("Lead added successfully!")
        setFormData({
          name: "",
          email: "",
          company: "",
          phone: "",
          city: "",
          message: "",
          status: "HOT",
          employeeId: formData.employeeId,
          callBackTime: "",
          designaction: "",
          soldAmount: "0",
        })
      } else {
        setMessage(data.error || "Failed to add lead.")
      }
    } catch (error) {
      console.error("Error adding lead:", error)
      setMessage("An error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto bg-white shadow-md rounded-lg p-4 md:p-6 relative">
      <h2 className="text-xl font-semibold mb-4">Add Lead</h2>
      {message && <div className="mb-4 p-2 bg-green-100 text-green-700 rounded-md">{message}</div>}

      {showSoldPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Enter Sold Amount</h3>
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
                className="w-full p-2 pl-10 border rounded"
                onChange={handleSoldAmountChange}
                value={formData.soldAmount}
                required
              />
            </div>

            <button
              onClick={handleSoldAmountSubmit}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-500" size={18} />
            <input
              type="text"
              name="name"
              placeholder="Lead Name"
              className="w-full p-2 pl-10 border rounded"
              onChange={handleChange}
              value={formData.name}
              required
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-500" size={18} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-2 pl-10 border rounded"
              onChange={handleChange}
              value={formData.email}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Building className="absolute left-3 top-3 text-gray-500" size={18} />
            <input
              type="text"
              name="company"
              placeholder="Company"
              className="w-full p-2 pl-10 border rounded"
              onChange={handleChange}
              value={formData.company}
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-3 text-gray-500" size={18} />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              className="w-full p-2 pl-10 border rounded"
              onChange={handleChange}
              value={formData.phone}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-500" size={18} />
            <input
              type="text"
              name="city"
              placeholder="City"
              className="w-full p-2 pl-10 border rounded"
              onChange={handleChange}
              value={formData.city}
            />
          </div>

          <div className="relative">
            <Briefcase className="absolute left-3 top-3 text-gray-500" size={18} />
            <input
              type="text"
              name="designaction"
              placeholder="Designation"
              className="w-full p-2 pl-10 border rounded"
              onChange={handleChange}
              value={formData.designaction}
            />
          </div>
        </div>

        <div className="relative">
          <MessageCircle className="absolute left-3 top-3 text-gray-500" size={18} />
          <textarea
            name="message"
            placeholder="Message"
            className="w-full p-2 pl-10 border rounded min-h-[80px]"
            onChange={handleChange}
            value={formData.message}
            required
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select name="status" className="w-full p-2 border rounded" onChange={handleChange} value={formData.status}>
            <option value="HOT">Hot</option>
            <option value="COLD">Cold</option>
            <option value="WARM">Warm</option>
            <option value="SOLD">Sold</option>
            <option value="CALL_BACK">Call Back</option>
          </select>

          <div className="relative">
            <Calendar className="absolute left-3 top-3 text-gray-500" size={18} />
            <input
              type="datetime-local"
              name="callBackTime"
              className="w-full p-2 pl-10 border rounded"
              onChange={handleChange}
              value={formData.callBackTime}
            />
          </div>
        </div>

        {formData.status === "SOLD" && (
          <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
            <DollarSign className="text-blue-500" size={18} />
            <span>Sold Amount: ${formData.soldAmount}</span>
            <button
              type="button"
              onClick={() => setShowSoldPopup(true)}
              className="ml-auto text-blue-500 hover:text-blue-700 text-sm underline"
            >
              Edit
            </button>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded flex justify-center items-center gap-2 transition-colors"
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : null}
          {loading ? "Submitting..." : "Submit Lead"}
        </button>
      </form>
    </div>
  )
}

