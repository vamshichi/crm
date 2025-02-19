"use client";

import { useEffect, useState } from "react";

export default function DepartmentPage() {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState("");

  // Fetch departments
  const fetchDepartments = async () => {
    const res = await fetch("/api/department");
    const data = await res.json();
    setDepartments(data);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Handle Create/Update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editId ? "PUT" : "POST";
    const body = JSON.stringify(editId ? { id: editId, name } : { name });

    await fetch("/api/department", { method, headers: { "Content-Type": "application/json" }, body });

    setName("");
    setEditId("");
    fetchDepartments();
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    await fetch("/api/department", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    fetchDepartments();
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Manage Departments</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Department Name" className="w-full p-2 border rounded" value={name} onChange={(e) => setName(e.target.value)} required />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">{editId ? "Update" : "Add"} Department</button>
      </form>

      <ul className="mt-4">
        {departments.map((dept: any) => (
          <li key={dept.id} className="flex justify-between p-2 border-b">
            {dept.name}
            <div>
              <button className="text-blue-500 mr-2" onClick={() => { setEditId(dept.id); setName(dept.name); }}>Edit</button>
              <button className="text-red-500" onClick={() => handleDelete(dept.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
