"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "./managerSidebar"; // Sidebar Component
import EmployeeForm from "../components/employee/AddEmployeeForm"; // Employee Form Component
import AddTarget from "../components/admin/AddTarget";
import { User, Mail, Briefcase, Building2, PlusCircle, Target } from "lucide-react"; // Icons

interface Manager {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
}

function ManagerDashboardContent({ activeTab }: { activeTab: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [manager, setManager] = useState<Manager | null>(null);

  useEffect(() => {
    const storedManager = localStorage.getItem("manager");

    if (storedManager) {
      setManager(JSON.parse(storedManager));
    } else {
      const managerId = searchParams.get("id");
      if (!managerId) {
        router.push("/manager-login");
      }
    }
  }, [router, searchParams]);

  if (!manager) {
    return <p>Loading...</p>;
  }

  return (
    <main className="ml-64 p-6 flex-grow bg-gray-100 min-h-screen">
      {activeTab === "dashboard" && (
        <div>
          {/* Manager Profile Card */}
          <div className="bg-white shadow-md p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <User className="text-blue-600" size={28} /> Manager Profile
            </h2>
            <p className="flex items-center gap-2 text-lg">
              <User className="text-blue-500" size={20} /> <strong>Name:</strong> {manager.name}
            </p>
            <p className="flex items-center gap-2 text-lg">
              <Mail className="text-red-500" size={20} /> <strong>Email:</strong> {manager.email}
            </p>
            <p className="flex items-center gap-2 text-lg">
              <Briefcase className="text-yellow-500" size={20} /> <strong>Role:</strong> {manager.role || "Manager"}
            </p>
            <p className="flex items-center gap-2 text-lg">
              <Building2 className="text-purple-500" size={20} /> <strong>Department:</strong> {manager.department}
            </p>
          </div>
        </div>
      )}

      {activeTab === "add-employee" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <PlusCircle className="text-green-500" size={28} /> Add New Employee
          </h2>
          <EmployeeForm />
        </div>
      )}

      {activeTab === "set-target" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Target className="text-blue-500" size={28} /> Set Target
          </h2>
          <AddTarget />
        </div>
      )}
    </main>
  );
}

export default function ManagerDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex h-screen">
      {/* Sidebar on the Left */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content Area */}
      <Suspense fallback={<p>Loading dashboard...</p>}>
        <ManagerDashboardContent activeTab={activeTab} />
      </Suspense>
    </div>
  );
}
