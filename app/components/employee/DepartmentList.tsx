"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CircularProgress from "@/app/components/ui/CircularProgress"; // Adjust the path as needed

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

interface DepartmentListProps {
  employeeId: string; // Employee ID to filter departments
}

const DepartmentList = ({ employeeId }: DepartmentListProps) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("/api/departments");
        if (!response.ok) throw new Error("Failed to fetch department data");
        const data: Department[] = await response.json();

        // Find the department where the employee exists
        const filteredDepartment = data.find((dept) =>
          dept.employees?.some((emp) => emp.id === employeeId)
        );

        setDepartments(filteredDepartment ? [filteredDepartment] : []);
      } catch (err) {
        setError((err as Error).message);
      }
    };
    fetchDepartments();
  }, [employeeId]);

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-center">
          {error}
        </div>
      )}
      {departments.length === 0 && !error ? (
        <div className="text-gray-500 text-center p-4">Loding.</div>
      ) : (
        departments.map((dept) => (
          <div
            key={dept.id}
            className="bg-white p-6 rounded-lg shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300"
          >
            <h3 className="text-2xl font-semibold mb-4 text-center border-b pb-2">
              {dept.name}
            </h3>
            <div className="flex justify-around py-10">
              <div className="w-20 h-20">
                <CircularProgress
                  value={dept.target ? 100 : 0}
                  text={dept.target ? `${dept.target}` : "N/A"}
                />
                <p className="text-center mt-2 text-xs text-gray-600">Target</p>
              </div>
              <div className="w-20 h-20">
                <CircularProgress value={100} text={`${dept.totalLeads}`} />
                <p className="text-center mt-2 text-xs text-gray-600">Total Leads</p>
              </div>
              <div className="w-20 h-20">
                <CircularProgress value={100} text={`${dept.soldLeads}`} />
                <p className="text-center mt-2 text-xs text-gray-600">Sold Leads</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DepartmentList;
