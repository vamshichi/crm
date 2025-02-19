"use client";
import { useEffect, useState } from "react";

interface Department {
  id: string;
  name: string;
  target?: number;
  totalLeads: number;
  soldLeads: number;
}

const DepartmentList = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("/api/departments");
        if (!response.ok) throw new Error("Failed to fetch department data");

        const data = await response.json();
        setDepartments(data);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchDepartments();
  }, []);

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Department</th>
            <th className="border p-2">Target</th>
            <th className="border p-2">Total Leads</th>
            <th className="border p-2">SOLD Leads</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dept) => (
            <tr key={dept.id} className="text-center border">
              <td className="border p-2">{dept.name}</td>
              <td className="border p-2">{dept.target ?? "N/A"}</td>
              <td className="border p-2">{dept.totalLeads}</td>
              <td className="border p-2 text-green-600 font-bold">{dept.soldLeads}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DepartmentList;
