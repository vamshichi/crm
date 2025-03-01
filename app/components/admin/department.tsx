"use client";

import { useEffect, useState } from "react";
import { Edit, Trash2, PlusCircle } from "lucide-react"; // Importing icons

interface DepartmentType {
  id: string;
  name: string;
}

export default function DepartmentPage() {
  const [departments, setDepartments] = useState<DepartmentType[]>([]);
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
    await fetch("/api/department", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchDepartments();
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Manage Departments</h2>

      <form onSubmit={handleSubmit} className="space-y-4 flex">
        <input
          type="text"
          placeholder="Department Name"
          className="flex-1 p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          {editId ? "Update" : "Add"}
        </button>
      </form>

      <ul className="mt-4">
        {departments.map((dept: DepartmentType) => (
          <li key={dept.id} className="flex justify-between items-center p-2 border-b">
            <span>{dept.name}</span>
            <div className="flex items-center">
              <button
                className="text-blue-500 hover:text-blue-700 p-2"
                onClick={() => {
                  setEditId(dept.id);
                  setName(dept.name);
                }}
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                className="text-red-500 hover:text-red-700 p-2"
                onClick={() => handleDelete(dept.id)}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
