"use client";

import CircularProgress from "@/app/components/ui/CircularProgress";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";

interface Lead {
  id: string;
  status: string;
  createdAt: string;
}

interface Manager {
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
  managers?: Manager[];
}

const ManagerDashboard = () => {
  const [department, setDepartment] = useState<Department | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchManagerData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Unauthorized: No token found");

        const response = await fetch("/api/manager_department", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch department data");
        const data = await response.json();
        setDepartment(data);
      } catch (err) {
        setError((err as Error).message);
      }
    };
    fetchManagerData();
  }, []);

  if (error) return <div className="text-red-600 text-center p-4">{error}</div>;
  if (!department) return <div className="text-gray-500 text-center p-4">Loading department data...</div>;

  const target = department.target || 0;
  const totalLeadsPercentage = target > 0 ? Math.min(Math.round((department.totalLeads / target) * 100), 100) : 0;
  const soldLeadsPercentage = target > 0 ? Math.min(Math.round((department.soldLeads / target) * 100), 100) : 0;
  const remaining = target > 0 ? Math.max(target - department.soldLeads, 0) : 0;
  const remainingPercentage = target > 0 ? Math.min(Math.round((remaining / target) * 100), 100) : 0;

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-center">{department.name} Department</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 py-6">
        <CircularProgress value={totalLeadsPercentage} text={`${department.totalLeads}`}  />
        <CircularProgress value={soldLeadsPercentage} text={`${department.soldLeads}`}  />
        <CircularProgress value={remainingPercentage} text={`${remaining}`}  />
      </div>

      <h4 className="text-lg font-semibold text-center">Managers</h4>
      {department.managers && department.managers.length > 0 ? (
        <ul className="border border-gray-300 rounded-lg p-4">
          {department.managers.map((manager) => (
            <li key={manager.id} className="flex justify-between p-2 border-b last:border-0">
              <span>{manager.name}</span>
              <button
                onClick={() => router.push(`/manager/${manager.id}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
              >
                <Eye size={14} className="mr-1" /> View
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No managers found.</p>
      )}
    </div>
  );
};

export default ManagerDashboard;
