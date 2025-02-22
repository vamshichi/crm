"use client";

import React from "react";

interface LeadFilterProps {
  selectedStatus: string | null;
  fromDate: string | null;
  toDate: string | null;
  onStatusChange: (status: string | null) => void;
  onFromDateChange: (date: string | null) => void;
  onToDateChange: (date: string | null) => void;
}

const statuses = ["HOT", "COLD", "WARM", "SOLD", "CALL_BACK"];

const LeadFilter: React.FC<LeadFilterProps> = ({
  selectedStatus,
  fromDate,
  toDate,
  onStatusChange,
  onFromDateChange,
  onToDateChange,
}) => {
  return (
    <div className="mb-4 flex flex-wrap gap-2 items-center">
      {/* Status Filter */}
      {statuses.map((status) => (
        <button
          key={status}
          onClick={() => onStatusChange(status === selectedStatus ? null : status)}
          className={`px-4 py-2 rounded-md border ${
            selectedStatus === status ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          {status}
        </button>
      ))}

      {/* From Date Picker */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-semibold">From:</label>
        <input
          type="date"
          value={fromDate || ""}
          onChange={(e) => onFromDateChange(e.target.value || null)}
          className="px-4 py-2 border rounded-md"
        />
      </div>

      {/* To Date Picker */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-semibold">To:</label>
        <input
          type="date"
          value={toDate || ""}
          onChange={(e) => onToDateChange(e.target.value || null)}
          className="px-4 py-2 border rounded-md"
        />
      </div>
    </div>
  );
};

export default LeadFilter;
