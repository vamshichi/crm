"use client"

import { useState, useEffect } from "react"
import LeadForm from "./LeadForm"

type Lead = {
  id: string
  name: string
  email: string
  phone: string
  status: "New" | "Contacted" | "Qualified" | "Lost" | "Closed"
  interests?: string
  notes?: string
}

type Category = "gmec" | "fps" | "ips" | "tascon"

export default function LeadManagement({ category }: { category: Category }) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [isAddingLead, setIsAddingLead] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)

  useEffect(() => {
    const fetchLeads = async () => {
      const response = await fetch(`/api/leads?category=${category}`)
      if (response.ok) {
        const data = await response.json()
        setLeads(data)
      }
    }

    fetchLeads()

    const eventSource = new EventSource(`/api/sse?category=${category}`)
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === "leads") {
        setLeads(data.data)
      }
    }

    return () => {
      eventSource.close()
    }
  }, [category])

  const addLead = async (lead: Omit<Lead, "id">) => {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...lead, category }),
    })

    if (response.ok) {
      const newLead = await response.json()
      setLeads([...leads, newLead])
      setIsAddingLead(false)
    }
  }

  const updateLead = async (updatedLead: Lead) => {
    const response = await fetch(`/api/leads/${updatedLead.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedLead),
    })

    if (response.ok) {
      setLeads(leads.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead)))
      setEditingLead(null)
    }
  }

  const deleteLead = async (id: string) => {
    const response = await fetch(`/api/leads/${id}`, {
      method: "DELETE",
    })

    if (response.ok) {
      setLeads(leads.filter((lead) => lead.id !== id))
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Lead Management</h2>
      <button
        onClick={() => setIsAddingLead(true)}
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Add New Lead
      </button>
      {isAddingLead && <LeadForm onSubmit={addLead} onCancel={() => setIsAddingLead(false)} />}
      {editingLead && (
  <LeadForm
    lead={editingLead}
    onSubmit={(updatedLead) => updateLead({ ...updatedLead, id: editingLead.id })}
    onCancel={() => setEditingLead(null)}
  />
)}

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td className="border p-2">{lead.name}</td>
              <td className="border p-2">{lead.email}</td>
              <td className="border p-2">{lead.phone}</td>
              <td className="border p-2">{lead.status}</td>
              <td className="border p-2">
                <button
                  onClick={() => setEditingLead(lead)}
                  className="mr-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteLead(lead.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

