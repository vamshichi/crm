"use client";

import { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface Lead {
  id: string;
  status: string;
  createdAt: string;
}

interface Employee {
  id: string;
  name: string;
  leads: Lead[];
}

interface Department {
  id: string;
  name: string;
  target?: number;
  totalLeads: number;
  soldLeads: number;
  employees?: Employee[];
}

const DepartmentList = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expandedDepartments, setExpandedDepartments] = useState<string[]>([]);

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

  const toggleExpanded = (deptId: string) => {
    setExpandedDepartments((prev) =>
      prev.includes(deptId)
        ? prev.filter((id) => id !== deptId)
        : [...prev, deptId]
    );
  };

  return (
    <div className="space-y-6">
      {/* <h2 className="text-3xl font-bold mb-6 text-center">Projects Overview</h2> */}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {departments.length === 0 ? (
        <p className="text-center">No departments found.</p>
      ) : (
        departments.map((dept) => {
          // Calculate percentages relative to the target
          const target = dept.target || 0;
          const targetPercentage = target > 0 ? 100 : 0;
          const totalLeadsPercentage =
            target > 0 ? Math.min(Math.round((dept.totalLeads / target) * 100), 100) : 0;
          const soldLeadsPercentage =
            target > 0 ? Math.min(Math.round((dept.soldLeads / target) * 100), 100) : 0;

          // Employee details: If not provided, fallback to empty array.
          const employeeDetails = dept.employees || [];

          return (
            <div
              key={dept.id}
              className="bg-white p-6 rounded-lg shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold mb-4 text-center border-b pb-2 flex-1">
                  {dept.name}
                </h3>
                <button
                  onClick={() => toggleExpanded(dept.id)}
                  className="ml-4 bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
                >
                  {expandedDepartments.includes(dept.id) ? "View Less" : "View More"}
                </button>
              </div>
              <div className="flex justify-around">
                {/* Target Circle */}
                <div className="w-24 h-24">
                  <CircularProgressbar
                    value={targetPercentage}
                    text={target > 0 ? `${dept.target}` : "N/A"}
                    styles={buildStyles({
                      textColor: "#1F2937", // Gray-800
                      pathColor: "#3b82f6", // Blue-500
                      trailColor: "#e5e7eb", // Gray-200
                    })}
                  />
                  <p className="text-center mt-2 text-sm text-gray-600">Target</p>
                </div>
                {/* Total Leads Circle */}
                <div className="w-24 h-24">
                  <CircularProgressbar
                    value={totalLeadsPercentage}
                    text={`${dept.totalLeads}`}
                    styles={buildStyles({
                      textColor: "#1F2937",
                      pathColor: "#f59e0b", // Amber-500
                      trailColor: "#e5e7eb",
                    })}
                  />
                  <p className="text-center mt-2 text-sm text-gray-600">Total Leads</p>
                </div>
                {/* Sold Leads Circle */}
                <div className="w-24 h-24">
                  <CircularProgressbar
                    value={soldLeadsPercentage}
                    text={`${dept.soldLeads}`}
                    styles={buildStyles({
                      textColor: "#1F2937",
                      pathColor: "#10b981", // Green-500
                      trailColor: "#e5e7eb",
                    })}
                  />
                  <p className="text-center mt-2 text-sm text-gray-600">Sold Leads</p>
                </div>
              </div>
              {/* Expanded Section: Employee Details */}
              {expandedDepartments.includes(dept.id) && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold mb-2 text-center">
                    Employee Details
                  </h4>
                  {employeeDetails.length === 0 ? (
                    <p className="text-center">No employees found in this department.</p>
                  ) : (
                    <table className="min-w-full border-collapse border border-gray-300">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="border p-2">Employee</th>
                          <th className="border p-2">Total Leads</th>
                          <th className="border p-2">Sold Leads</th>
                          <th className="border p-2">Hot Leads</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employeeDetails.map((emp) => {
                          const totalLeads = emp.leads.length;
                          const soldLeads = emp.leads.filter(
                            (lead) => lead.status === "SOLD"
                          ).length;
                          const hotLeads = emp.leads.filter(
                            (lead) => lead.status === "HOT"
                          ).length;
                          return (
                            <tr key={emp.id} className="text-center border-t">
                              <td className="border p-2">{emp.name}</td>
                              <td className="border p-2">{totalLeads}</td>
                              <td className="border p-2 text-green-600 font-bold">
                                {soldLeads}
                              </td>
                              <td className="border p-2 text-red-600 font-bold">
                                {hotLeads}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default DepartmentList;
