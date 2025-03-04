"use client";

import { useState, useEffect } from "react";
import { User, Mail, Lock, Briefcase, Building2 } from "lucide-react";

type Department = {
  id: string;
  name: string;
};

export default function EmployeeForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("/api/department");
        const data = await response.json();
        setDepartments(data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    if (!departmentId) {
      setMessage("Please select a department.");
      setMessageType("error");
      return;
    }

    const response = await fetch("/api/addEmployee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role, departmentId }),
    });

    if (response.ok) {
      setMessage("New employee added successfully.");
      setMessageType("success");
      setName("");
      setEmail("");
      setPassword("");
      setRole("");
      setDepartmentId("");
    } else {
      setMessage("Failed to create employee. Please try again.");
      setMessageType("error");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Add Employee</h2>

      {message && (
        <p
          className={`text-center mb-2 ${
            messageType === "success" ? "text-green-600" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Name Field */}
        <div className="relative">
          <User className="absolute left-3 top-3 text-gray-500" size={20} />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter name"
          />
        </div>

        {/* Email Field */}
        <div className="relative">
          <Mail className="absolute left-3 top-3 text-gray-500" size={20} />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter email"
          />
        </div>

        {/* Password Field */}
        <div className="relative">
          <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter password"
          />
        </div>

        {/* Role Field */}
        <div className="relative">
          <Briefcase className="absolute left-3 top-3 text-gray-500" size={20} />
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter role"
          />
        </div>

        {/* Department Dropdown */}
        <div className="relative">
          <Building2 className="absolute left-3 top-3 text-gray-500" size={20} />
          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            required
            className="w-full p-2 pl-10 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Add Employee
        </button>
      </form>
    </div>
  );
}
