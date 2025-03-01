"use client";

import CircularProgress from "@/app/components/ui/CircularProgress"; // Adjust the path as needed
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDeleting, setIsDeleting ] = useState(false);

  const router = useRouter();

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
 
  const handleEmployeeSelect = (employee: Employee) => {
    setSelectedEmployee(employee)
  }

  const confirmDelete = async () => {
    if (!selectedEmployee) return;
    
    console.log("Deleting Employee ID:", selectedEmployee.id); // Debugging
    
    setIsDeleting(true);
    setError(null); // Clear previous errors
  
    try {
      const response = await fetch(`/api/delete_employee?id=${selectedEmployee.id}`, {
        method: "DELETE",
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete employee");
      }
  
      if (data.success) {
        setDepartments((prevDepartments) =>
          prevDepartments.map((dept) => ({
            ...dept,
            employees: dept.employees?.filter((emp) => emp.id !== selectedEmployee.id),
          }))
        );
        setSelectedEmployee(null);
      } else {
        throw new Error(data.message || "Failed to delete employee");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsDeleting(false);
    }
  };
  
  

  
  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-center">
          {error}
        </div>
      )}
      {departments.length === 0 && !error ? (
        <div className="text-gray-500 text-center p-4">No departments found.</div>
      ) : (
        departments.map((dept) => {
          const target = dept.target || 0;
          const targetPercentage = target > 0 ? 100 : 0;
          const totalLeadsPercentage =
            target > 0 ? Math.min(Math.round((dept.totalLeads / target) * 100), 100) : 0;
          const soldLeadsPercentage =
            target > 0 ? Math.min(Math.round((dept.soldLeads / target) * 100), 100) : 0;
          // Calculate hot leads across employees (case-insensitive)
          const hotLeads =
            dept.employees?.reduce((sum, emp) => {
              const empHot = emp.leads.filter(
                (lead) => lead.status && lead.status.toUpperCase() === "HOT"
              ).length;
              return sum + empHot;
            }, 0) || 0;
          const hotLeadsPercentage =
            target > 0 ? Math.min(Math.round((hotLeads / target) * 100), 100) : 0;
          // Calculate remaining: target minus sold leads
          const remaining = target > 0 ? Math.max(target - dept.soldLeads, 0) : 0;
          const remainingPercentage =
            target > 0 ? Math.min(Math.round((remaining / target) * 100), 100) : 0;

          const employeeDetails = dept.employees || [];
          const isExpanded = expandedDepartments.includes(dept.id);

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
                  aria-expanded={isExpanded}
                  aria-controls={`dept-${dept.id}-content`}
                >
                  {isExpanded ? "View Less" : "View More"}
                </button>
              </div>
              <div className="flex justify-around py-10">
                {/* Target Circle */}
                <div className="w-20 h-20">
                  <CircularProgress
                    value={targetPercentage}
                    text={target > 0 ? `${dept.target}` : "N/A"}
                  />
                  <p className="text-center mt-2 text-xs text-gray-600">Target</p>
                </div>
                {/* Total Leads Circle */}
                <div className="w-20 h-20">
                  <CircularProgress
                    value={totalLeadsPercentage}
                    text={`${dept.totalLeads}`}
                  />
                  <p className="text-center mt-2 text-xs text-gray-600">Total Leads</p>
                </div>
                {/* Sold Leads Circle */}
                <div className="w-20 h-20">
                  <CircularProgress
                    value={soldLeadsPercentage}
                    text={`${dept.soldLeads}`}
                  />
                  <p className="text-center mt-2 text-xs text-gray-600">Sold Leads</p>
                </div>
                {/* Hot Leads Circle */}
                <div className="w-20 h-20">
                  <CircularProgress
                    value={hotLeadsPercentage}
                    text={`${hotLeads}`}
                  />
                  <p className="text-center mt-2 text-xs text-gray-600">Prospects</p>
                </div>
                {/* Remaining Circle */}
                <div className="w-20 h-20">
                  <CircularProgress
                    value={remainingPercentage}
                    text={`${remaining}`}
                  />
                  <p className="text-center mt-2 text-xs text-gray-600">Remaining</p>
                </div>
              </div>
              {isExpanded && (
                <div id={`dept-${dept.id}-content`} className="mt-6">
                  <h4 className="text-lg font-semibold mb-2 text-center">
                    Employee Details
                  </h4>
                  {employeeDetails.length === 0 ? (
                    <p className="text-center text-gray-500">
                      No employees found in this department.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-collapse border border-gray-300">
                        <thead className="bg-gray-200">
                          <tr>
                            <th className="border p-2 text-left">Employee</th>
                            <th className="border p-2 text-center">Total Leads</th>
                            <th className="border p-2 text-center">Sold Leads</th>
                            <th className="border p-2 text-center">Hot Leads</th>
                            <th className="border p-2 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
  {employeeDetails.map((emp) => {
    const totalLeads = emp.leads.length;
    const soldLeads = emp.leads.filter((lead) => lead.status?.toUpperCase() === "SOLD").length;
    const empHotLeads = emp.leads.filter((lead) => lead.status?.toUpperCase() === "HOT").length;

    return (
      <tr key={emp.id} className="hover:bg-gray-50">
        <td className="border p-2">{emp.name}</td>
        <td className="border p-2 text-center">{totalLeads}</td>
        <td className="border p-2 text-center text-green-600 font-bold">{soldLeads}</td>
        <td className="border p-2 text-center text-red-600 font-bold">{empHotLeads}</td>
        <td className="border p-2 text-center flex justify-evenly">
          <button
            onClick={() => router.push(`/employee/${emp.id}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
          >
            View More
          </button>
          <button
            onClick={() => handleEmployeeSelect(emp)}
            className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
          >
            Delete
          </button>
        </td>
      </tr>
    );
  })}
</tbody>

                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-semibold">Confirm Deletion</h3>
            <p className="mt-2 text-gray-600">
              Are you sure you want to delete <strong>{selectedEmployee.name}</strong>?
            </p>
            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={() => setSelectedEmployee(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentList;
