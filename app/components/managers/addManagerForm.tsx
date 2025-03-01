"use client";

import { useState, useEffect } from "react";
import { User, Mail, Lock, Building2, CheckCircle } from "lucide-react";

type Department = {
  id: string;
  name: string;
};

export default function ManagerForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [message, setMessage] = useState("");

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

    if (!name || !email || !password || !departmentId) {
      setMessage("All fields are required.");
      return;
    }

    const response = await fetch("/api/addManager", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, departmentId }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage("Manager added successfully.");
      setName("");
      setEmail("");
      setPassword("");
      setDepartmentId("");
    } else {
      setMessage(data.error || "Failed to add manager.");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800 flex items-center justify-center">
        <CheckCircle className="mr-2 text-green-600" /> Add Manager
      </h2>
      {message && <p className="text-red-500 text-center mb-2">{message}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center border border-gray-300 rounded-lg p-2">
          <User className="text-gray-500 mr-2" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full focus:outline-none"
            placeholder="Enter name"
          />
        </div>

        <div className="flex items-center border border-gray-300 rounded-lg p-2">
          <Mail className="text-gray-500 mr-2" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full focus:outline-none"
            placeholder="Enter email"
          />
        </div>

        <div className="flex items-center border border-gray-300 rounded-lg p-2">
          <Lock className="text-gray-500 mr-2" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full focus:outline-none"
            placeholder="Enter password"
          />
        </div>

        <div className="flex items-center border border-gray-300 rounded-lg p-2 bg-white">
          <Building2 className="text-gray-500 mr-2" />
          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            required
            className="w-full focus:outline-none bg-transparent"
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
          className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center"
        >
          <CheckCircle className="mr-2" /> Add Manager
        </button>
      </form>
    </div>
  );
}
