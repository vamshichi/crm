import { useState } from "react"

type Lead = {
  id: string
  name: string
  email: string
  phone: string
  status: "New" | "Contacted" | "Qualified" | "Lost" | "Closed"
  interests?: string
  notes?: string
}

type LeadFormProps = {
  lead?: Lead
  onSubmit: (lead: Omit<Lead, "id">) => void
  onCancel: () => void
}

export default function LeadForm({ lead, onSubmit, onCancel }: LeadFormProps) {
  const [formData, setFormData] = useState<Omit<Lead, "id">>(
    lead || {
      name: "",
      email: "",
      phone: "",
      status: "New",
      interests: "",
      notes: "",
    },
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 bg-white p-4 rounded shadow">
      <div className="mb-2">
        <label htmlFor="name" className="block mb-1">
          Name:
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-2 py-1 border rounded"
        />
      </div>
      <div className="mb-2">
        <label htmlFor="email" className="block mb-1">
          Email:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-2 py-1 border rounded"
        />
      </div>
      <div className="mb-2">
        <label htmlFor="phone" className="block mb-1">
          Phone:
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full px-2 py-1 border rounded"
        />
      </div>
      <div className="mb-2">
        <label htmlFor="status" className="block mb-1">
          Status:
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-2 py-1 border rounded"
        >
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Lost">Lost</option>
          <option value="Closed">Closed</option>
        </select>
      </div>
      <div className="mb-2">
        <label htmlFor="interests" className="block mb-1">
          Interests:
        </label>
        <input
          type="text"
          id="interests"
          name="interests"
          value={formData.interests}
          onChange={handleChange}
          className="w-full px-2 py-1 border rounded"
        />
      </div>
      <div className="mb-2">
        <label htmlFor="notes" className="block mb-1">
          Notes:
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="w-full px-2 py-1 border rounded"
          rows={3}
        ></textarea>
      </div>
      <div className="flex justify-end">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2">
          {lead ? "Update" : "Add"} Lead
        </button>
        <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
          Cancel
        </button>
      </div>
    </form>
  )
}

