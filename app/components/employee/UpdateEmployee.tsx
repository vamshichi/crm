"use client";

import { useState, useEffect } from "react";
import { User, Mail, Lock, Briefcase, Building2 } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";

type Department = { id: string; name: string };
type Employee = {
  id: string;
  name: string;
  email: string;
  password?: string; // Password is optional
  role: string;
  departmentId: string;
};

export default function UpdateEmployee({ employeeId, onClose }: { employeeId: string; onClose: () => void }) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  // ✅ Fetch Employee Data
  useEffect(() => {
    if (!employeeId) return;

    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/getEmployee/${employeeId}`);
        if (!response.ok) throw new Error("Failed to fetch employee data");

        const data: Employee = await response.json();
        setEmployee(data);
      } catch (error) {
        console.error("❌ Error fetching employee details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  // ✅ Fetch Departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("/api/department");
        const data = await response.json();
        setDepartments(data);
      } catch (error) {
        console.error("❌ Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  // ✅ Handle Update Form Submission
 // ✅ Handle Update Form Submission
const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");
  
    if (!employee) return;
    if (!employee.departmentId) {
      setMessage("Please select a department.");
      setMessageType("error");
      return;
    }
  
    const updateData: Partial<Employee> = {
      name: employee.name,
      email: employee.email,
      role: employee.role,
      departmentId: employee.departmentId,
    };
  
    if (employee.password) {
      updateData.password = employee.password;
    }
  
    try {
      const response = await fetch(`/api/updateEmployee/${employeeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
  
      if (response.ok) {
        setMessage("✅ Employee updated successfully.");
        setMessageType("success");
        setTimeout(() => onClose(), 1000);
      } else {
        setMessage("❌ Update failed. Try again.");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("❌ Server error. Please try again later.");
      console.error("❌ Error updating employee:", error);
      setMessageType("error");
    }
  };
  

  if (loading) return <p className="text-center text-gray-600">🔄 Loading employee data...</p>;
  if (!employee) return <p className="text-center text-red-500">⚠️ Employee not found.</p>;

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Update Employee</h2>

      {message && <p className={`text-center mb-2 ${messageType === "success" ? "text-green-600" : "text-red-500"}`}>{message}</p>}

      <form onSubmit={handleUpdate} className="space-y-4">
        <div className="relative">
          <User className="absolute left-3 top-3 text-gray-500" size={20} />
          <input
            type="text"
            value={employee.name}
            onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
            required
            className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter name"
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-3 text-gray-500" size={20} />
          <input
            type="email"
            value={employee.email}
            onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
            required
            className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter email"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
          <input
  type={showPassword ? "text" : "password"}
  value={employee.password || ""}
  onChange={(e) => setEmployee({ ...employee, password: e.target.value })}
  className="w-full p-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  placeholder="Enter new password (optional)"
/>
<button
  type="button"
  onClick={() => setShowPassword(!showPassword)}
  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
>
  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
</button>
        </div>

        <div className="relative">
          <Briefcase className="absolute left-3 top-3 text-gray-500" size={20} />
          <input
            type="text"
            value={employee.role}
            onChange={(e) => setEmployee({ ...employee, role: e.target.value })}
            required
            className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter role"
          />
        </div>

        <div className="relative">
          <Building2 className="absolute left-3 top-3 text-gray-500" size={20} />
          <select
            value={employee.departmentId}
            onChange={(e) => setEmployee({ ...employee, departmentId: e.target.value })}
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

        <div className="flex gap-4">
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-200">
            Update Employee
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-gray-400 text-white p-2 rounded-lg hover:bg-gray-500 transition duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
