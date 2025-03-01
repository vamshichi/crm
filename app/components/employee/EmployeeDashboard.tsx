'use client';

import { useState } from 'react';
import { 
  User, 
  Mail, 
  Briefcase, 
  FolderKanban,  // Better for Projects
  LayoutDashboard, // Dashboard Icon
  PlusCircle, // Add Lead Icon
  ClipboardList // Project Details Icon
} from 'lucide-react';
import EmployeeSidebar from './FilterSidebar';
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
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex">
      {/* Employee Sidebar with icons */}
      <EmployeeSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="ml-64 p-6 flex-grow">
        {activeTab === "dashboard" && (
          <div>
            <div className="bg-white shadow-md p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <LayoutDashboard className="text-green-600" size={28} /> Employee Profile
              </h2>
              <p className="flex items-center gap-2">
                <User className="text-blue-500" size={20} /> <strong>Name:</strong> {employee.name}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="text-red-500" size={20} /> <strong>Email:</strong> {employee.email}
              </p>
              <p className="flex items-center gap-2">
                <Briefcase className="text-yellow-500" size={20} /> <strong>Role:</strong> {employee.role}
              </p>
              <p className="flex items-center gap-2">
                <FolderKanban className="text-purple-500" size={20} /> <strong>Project:</strong> {employee.department?.name || 'No department assigned'}
              </p>
            </div>
            <EmployeeLeads employeeId={employee.id} />
          </div>
        )}

        {activeTab === "add-lead" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <PlusCircle className="text-green-500" size={28} /> Add New Lead
            </h2>
            <LeadForm />
          </div>
        )}

        {activeTab === "project-details" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <ClipboardList className="text-blue-500" size={28} /> Project Details
            </h2>
            <DepartmentList employeeId={employee.id} />
          </div>
        )}
      </main>
    </div>
  );
}
