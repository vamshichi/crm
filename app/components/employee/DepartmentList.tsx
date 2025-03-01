"use client";

import { useState, useEffect } from "react";
import { Building, Target, Users, CheckCircle } from "lucide-react"; 
import CircularProgress from "@/app/components/ui/CircularProgress"; 

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
  employeeId: string; 
}

const DepartmentList = ({ employeeId }: DepartmentListProps) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("/api/departments");
        if (!response.ok) throw new Error("Failed to fetch department data");
        const data: Department[] = await response.json();

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
        <div className="text-gray-500 text-center p-4">Loading...</div>
      ) : (
        departments.map((dept) => (
          <div
            key={dept.id}
            className="bg-white p-6 rounded-lg shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300"
          >
            <h3 className="text-2xl font-semibold mb-4 text-center border-b pb-2 flex items-center justify-center gap-2">
              <Building className="text-green-600" size={24} /> {dept.name}
            </h3>
            <div className="flex justify-around py-10">
              <div className="w-20 h-20 flex flex-col items-center">
                <CircularProgress
                  value={dept.target ? 100 : 0}
                  text={dept.target ? `${dept.target}` : "N/A"}
                />
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-600">
                  <Target size={16} className="text-blue-500" /> Target
                </div>
              </div>
              <div className="w-20 h-20 flex flex-col items-center">
                <CircularProgress value={100} text={`${dept.totalLeads}`} />
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-600">
                  <Users size={16} className="text-yellow-500" /> Total Leads
                </div>
              </div>
              <div className="w-20 h-20 flex flex-col items-center">
                <CircularProgress value={100} text={`${dept.soldLeads}`} />
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-600">
                  <CheckCircle size={16} className="text-green-500" /> Sold Leads
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DepartmentList;
