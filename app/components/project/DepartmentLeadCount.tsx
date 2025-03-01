"use client";
import { useEffect, useState } from "react";
import { Users, AlertCircle } from "lucide-react";

interface DepartmentLeadCountProps {
  departmentId: string;
}

const DepartmentLeadCount: React.FC<DepartmentLeadCountProps> = ({ departmentId }) => {
  const [leadCount, setLeadCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeadCount = async () => {
      try {
        const response = await fetch(`/api/leads/department/${departmentId}`);
        if (!response.ok) throw new Error("Failed to fetch department lead count");

        const data = await response.json();
        setLeadCount(data.count);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchLeadCount();
  }, [departmentId]);

  return (
    <div className="p-4 border rounded-lg shadow-md flex items-center gap-2">
      <Users className="text-blue-600" size={24} />
      <div>
        <h2 className="text-lg font-semibold">Department Lead Count</h2>
        {error ? (
          <p className="text-red-500 flex items-center gap-1">
            <AlertCircle size={16} /> {error}
          </p>
        ) : (
          <p>Total Leads: {leadCount ?? "Loading..."}</p>
        )}
      </div>
    </div>
  );
};

export default DepartmentLeadCount;
