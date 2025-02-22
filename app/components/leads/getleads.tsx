"use client";

import React, { useEffect, useState } from "react";
import LeadFilter from "@/app/components/employee/LeadFilter"; // Your filter component
import * as XLSX from "xlsx"; // Import for Excel export

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

  // Fetch leads data
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await fetch(`/api/employee-leads?employeeId=${employeeId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch leads");
        }
        const data = await res.json();
        setLeads(data);
        setFilteredLeads(data);
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };
    fetchLeads();
  }, [employeeId]);

  // Apply filters
  useEffect(() => {
    let updatedLeads = leads;

    if (selectedStatus) {
      updatedLeads = updatedLeads.filter((lead) => lead.status.toLowerCase() === selectedStatus.toLowerCase());
    }

    if (fromDate) {
      updatedLeads = updatedLeads.filter((lead) => new Date(lead.createdAt) >= new Date(fromDate));
    }

    if (toDate) {
      updatedLeads = updatedLeads.filter((lead) => new Date(lead.createdAt) <= new Date(toDate));
    }

    setFilteredLeads(updatedLeads);
  }, [selectedStatus, fromDate, toDate, leads]);

  // Count Calculation
  const totalLeads = filteredLeads.length;
  const hotLeads = filteredLeads.filter((lead) => lead.status.toLowerCase() === "hot").length;
  const soldLeads = filteredLeads.filter((lead) => lead.status.toLowerCase() === "sold").length;
  const target = 50; // Example target, change as needed
  const remainingTarget = target > soldLeads ? target - soldLeads : 0;

  // ✅ Function to filter leads for the current week
  const handleWeekFilter = () => {
    const today = new Date();
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay()); // Start of the week (Sunday)
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6); // End of the week (Saturday)

    setFromDate(firstDayOfWeek.toISOString().split("T")[0]);
    setToDate(lastDayOfWeek.toISOString().split("T")[0]);
  };

  // ✅ Function to export filtered leads to an Excel file
  const handleExportToExcel = () => {
    if (filteredLeads.length === 0) {
      alert("No leads available to export.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(filteredLeads);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

    XLSX.writeFile(workbook, "leads.xlsx");
  };

  return (
    <div className="p-10 mt-10 bg-white shadow-lg rounded-lg">
      {/* Display Counts */}
      <div className="grid grid-cols-5 gap-4 mt-4 p-20">
        <div className="text-center p-4 bg-gray-100 rounded-lg">
          <p className="text-lg font-bold">{totalLeads}</p>
          <p className="text-sm text-gray-500">Total Leads</p>
        </div>
        <div className="text-center p-4 bg-yellow-100 rounded-lg">
          <p className="text-lg font-bold">{hotLeads}</p>
          <p className="text-sm text-gray-500">Hot Leads</p>
        </div>
        <div className="text-center p-4 bg-green-100 rounded-lg">
          <p className="text-lg font-bold">{soldLeads}</p>
          <p className="text-sm text-gray-500">Sold Leads</p>
        </div>
        <div className="text-center p-4 bg-blue-100 rounded-lg">
          <p className="text-lg font-bold">{target}</p>
          <p className="text-sm text-gray-500">Target</p>
        </div>
        <div className="text-center p-4 bg-red-100 rounded-lg">
          <p className="text-lg font-bold">{remainingTarget}</p>
          <p className="text-sm text-gray-500">Remaining Target</p>
        </div>
      </div>
      <h2 className="text-2xl font-semibold mb-4">Employee Leads</h2>

      {/* Filter Component */}
      <LeadFilter
        selectedStatus={selectedStatus}
        fromDate={fromDate}
        toDate={toDate}
        onStatusChange={setSelectedStatus}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onWeekFilter={handleWeekFilter}
        onExport={handleExportToExcel}
      />

      {/* Lead List */}
      <div className="mt-6">
        {loading ? (
          <p>Loading leads...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filteredLeads.length === 0 ? (
          <p className="text-gray-500">No leads found.</p>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default EmployeeLeads;
