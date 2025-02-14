"use client";
import { useState, useEffect } from "react";

const companies = ["IPS", "GMEC", "TASCON", "FPS"];

// Define the Employee type
type Employee = {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [company, setCompany] = useState("");

  useEffect(() => {
    if (company) {
      fetch(`/api/employees/${company}`)
        .then((res) => res.json())
        .then((data: Employee[]) => setEmployees(data)); // Explicitly type the fetched data
    }
  }, [company]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Employee Management</h1>

      {/* Company Dropdown */}
      <select
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="border p-2 mb-4"
      >
        <option value="">Select Company</option>
        {companies.map((comp) => (
          <option key={comp} value={comp}>
            {comp}
          </option>
        ))}
      </select>

      {/* Employee List */}
      <table className="w-full border-collapse border border-gray-400">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((emp) => (
              <tr key={emp.id} className="text-center">
                <td className="border p-2">{emp.name}</td>
                <td className="border p-2">{emp.email}</td>
                <td className="border p-2">{emp.role}</td>
                <td className="border p-2">{emp.phone}</td>
                <td className="border p-2">
                  <button
                    className="bg-red-500 text-white p-1 rounded"
                    onClick={() => handleDelete(emp.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="p-4 text-center">
                No Employees Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  function handleDelete(id: string) {
    fetch(`/api/employees/${id}`, { method: "DELETE" }).then(() => {
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    });
  }
}
