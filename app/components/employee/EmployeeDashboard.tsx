'use client';

import { useState } from 'react';
import EmployeeSidebar from './FilterSidebar'; // Ensure correct import
import EmployeeLeads from '../leads/getleads';
import LeadForm from './LeadForm';
import DepartmentList from './DepartmentList';

interface EmployeeProps {
  employee: {
    id: string;
    name: string;
    email: string;
    role: string;
    department?: { name: string } | null;
  };
}

export default function EmployeeDashboard({ employee }: EmployeeProps) {
  const [activeTab, setActiveTab] = useState("dashboard"); // Default to "dashboard"

  return (
    <div className="flex">
      <EmployeeSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="ml-64 p-6 flex-grow">
        {activeTab === "dashboard" && (
          <div>
            <div className="bg-white shadow-md p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Employee Profile</h2>
              <p><strong>Name:</strong> {employee.name}</p>
              <p><strong>Email:</strong> {employee.email}</p>
              <p><strong>Role:</strong> {employee.role}</p>
              <p><strong>Project:</strong> {employee.department?.name || 'No department assigned'}</p>
            </div>
            <EmployeeLeads employeeId={employee.id} />
          </div>
        )}
        {activeTab === "add-lead" && <LeadForm />}
        {activeTab === "project-details" && <DepartmentList employeeId={employee.id} />}
      </main>
    </div>
  );
}
