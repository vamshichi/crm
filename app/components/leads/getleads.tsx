"use client";

import React, { useEffect, useState } from "react";
import LeadFilter from "@/app/components/employee/LeadFilter";

interface Lead {
  id: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
}

interface EmployeeLeadsProps {
  employeeId: string;
}

const EmployeeLeads: React.FC<EmployeeLeadsProps> = ({ employeeId }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await fetch(`/api/employee-leads?employeeId=${employeeId}`);
        if (!res.ok) {
          const errData = await res.json();
          setError(errData.error || "Failed to fetch leads");
          setLoading(false);
          return;
        }
        const data = await res.json();
        setLeads(data);
        setFilteredLeads(data);
      } catch (err) {
        console.error("Error fetching leads:", err);
        setError("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [employeeId]);

  // Filtering Logic
  useEffect(() => {
    let filtered = leads;

    // Filter by status
    if (selectedStatus) {
      filtered = filtered.filter((lead) => lead.status === selectedStatus);
    }

    // Filter by date range
    if (fromDate || toDate) {
      filtered = filtered.filter((lead) => {
        const leadDate = new Date(lead.createdAt).toISOString().split("T")[0];

        const isAfterFromDate = fromDate ? leadDate >= fromDate : true;
        const isBeforeToDate = toDate ? leadDate <= toDate : true;

        return isAfterFromDate && isBeforeToDate;
      });
    }

    setFilteredLeads(filtered);
  }, [selectedStatus, fromDate, toDate, leads]);

  if (loading) return <p>Loading leads...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (leads.length === 0) return <p>No leads found for this employee.</p>;

  return (
    <div className="my-6">
      <h3 className="text-xl font-semibold mb-4">Leads</h3>

      {/* Filter Component */}
      <LeadFilter
        selectedStatus={selectedStatus}
        fromDate={fromDate}
        toDate={toDate}
        onStatusChange={setSelectedStatus}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
      />

      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Created At</th>
          </tr>
        </thead>
        <tbody>
          {filteredLeads.map((lead) => (
            <tr key={lead.id} className="border-t">
              <td className="px-4 py-2">{lead.name}</td>
              <td className="px-4 py-2">{lead.email}</td>
              <td className="px-4 py-2">{lead.status}</td>
              <td className="px-4 py-2">
                {new Date(lead.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeLeads;
