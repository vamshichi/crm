"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // Using usePathname instead of useRouter

export default function LeadForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    city: "",
    message: "",
    status: "HOT",
    employeeId: "", // Set dynamically from URL
    callBackTime: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const pathname = usePathname(); // Get the current URL path

  useEffect(() => {
    const pathSegments = pathname.split("/");
    const employeeId = pathSegments[pathSegments.length - 1]; // Extract last part of URL
    if (employeeId) {
      setFormData((prev) => ({ ...prev, employeeId })); // Update employeeId dynamically
    }
  }, [pathname]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/addLead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Lead added successfully!");
        setFormData({
          name: "",
          email: "",
          company: "",
          phone: "",
          city: "",
          message: "",
          status: "HOT",
          employeeId: formData.employeeId, // Keep employeeId
          callBackTime: "",
        });
      } else {
        setMessage(data.error || "Failed to add lead.");
      }
    } catch (error) {
      console.error("Error adding lead:", error);
      setMessage("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Add Lead</h2>
      {message && <p className="text-green-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Lead Name"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          value={formData.name}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          value={formData.email}
          required
        />
        <input
          type="text"
          name="company"
          placeholder="Company"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          value={formData.company}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          value={formData.phone}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          value={formData.city}
        />
        <textarea
          name="message"
          placeholder="Message"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          value={formData.message}
          required
        ></textarea>
        <select
          name="status"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          value={formData.status}
        >
          <option value="HOT">Hot</option>
          <option value="COLD">Cold</option>
          <option value="WARM">Warm</option>
          <option value="SOLD">Sold</option>
          <option value="CALL_BACK">Call Back</option>
        </select>
        <input
          type="datetime-local"
          name="callBackTime"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          value={formData.callBackTime}
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Lead"}
        </button>
      </form>
    </div>
  );
}
