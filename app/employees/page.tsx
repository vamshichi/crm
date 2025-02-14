"use client";
import { useState } from "react";

const companies: string[] = ["IPS", "GMEC", "TASCON", "FPS"];

export default function AddEmployee() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    phone: "",
    password: "",
    company: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetch("/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    }).then(() => alert("Employee added successfully"));
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Add Employee</h2>

        {/* Name Field */}
        <label className="block mb-2 font-semibold">Name</label>
        <input 
          name="name" 
          placeholder="Enter full name" 
          onChange={handleChange} 
          className="border p-2 w-full rounded mb-3"
        />

        {/* Email Field */}
        <label className="block mb-2 font-semibold">Email</label>
        <input 
          name="email" 
          type="email" 
          placeholder="Enter email" 
          onChange={handleChange} 
          className="border p-2 w-full rounded mb-3"
        />

        {/* Role Field */}
        <label className="block mb-2 font-semibold">Role</label>
        <input 
          name="role" 
          placeholder="Enter role" 
          onChange={handleChange} 
          className="border p-2 w-full rounded mb-3"
        />

        {/* Phone Field */}
        <label className="block mb-2 font-semibold">Phone</label>
        <input 
          name="phone" 
          type="tel" 
          placeholder="Enter phone number" 
          onChange={handleChange} 
          className="border p-2 w-full rounded mb-3"
        />

        {/* Password Field */}
        <label className="block mb-2 font-semibold">Password</label>
        <input 
          name="password" 
          type="password" 
          placeholder="Enter password" 
          onChange={handleChange} 
          className="border p-2 w-full rounded mb-3"
        />

        {/* Company Dropdown */}
        <label className="block mb-2 font-semibold">Company</label>
        <select 
          name="company" 
          onChange={handleChange} 
          className="border p-2 w-full rounded mb-4"
        >
          <option value="">Select Company</option>
          {companies.map((comp: string) => (
            <option key={comp} value={comp}>{comp}</option>
          ))}
        </select>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 w-full rounded"
        >
          Add Employee
        </button>
      </form>
    </div>
  );
}
