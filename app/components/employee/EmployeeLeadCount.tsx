"use client";
import { useEffect, useState } from "react";

interface EmployeeLeadCountProps {
  employeeId: string;
}

const EmployeeLeadCount: React.FC<EmployeeLeadCountProps> = ({ employeeId }) => {
  const [leadCount, setLeadCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeadCount = async () => {
      try {
        const response = await fetch(`/api/leads/employee/${employeeId}`);
        if (!response.ok) throw new Error("Failed to fetch lead count");
        
        const data = await response.json();
        setLeadCount(data.count);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchLeadCount();
  }, [employeeId]);

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-lg font-semibold">Employee Lead Count</h2>
      {error ? <p className="text-red-500">{error}</p> : <p>Total Leads: {leadCount ?? "Loading..."}</p>}
    </div>
  );
};

export default EmployeeLeadCount;
