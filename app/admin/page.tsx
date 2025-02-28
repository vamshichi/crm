"use client";

import { useState } from "react";
import { Users, UserPlus, Target, Building2 } from "lucide-react"; // Importing icons

import Sidebar from "@/app/components/admin/Sidebar";
import AddEmployee from "@/app/components/employee/AddEmployeeForm";
import AddDepartment from "@/app/components/admin/department"; 
import AddTarget from "@/app/components/admin/AddTarget";
import DepartmentList from "@/app/admin/DepartmentList";
import AdminForm from "../components/admin/adminform";
import ManagerForm from "../components/managers/addManagerForm";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "add-admin":
        return (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <UserPlus size={24} /> Add Admin
            </h2>
            <AdminForm />
          </div>
        );
        case "add-manager":
        return (
          <div className="mb-6">
            <ManagerForm />
          </div>
        );
      case "add-employee":
        return (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Users size={24} /> Add Employee
            </h2>
            <AddEmployee />
          </div>
        );
      case "set-department-target":
        return (
          <div className="mb-6 p-4 border rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Building2 size={24} /> Set Department Targets
            </h2>
            <AddDepartment />
          </div>
        );
      case "set-target":
        return (
          <div className="mb-6 p-4 border rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Target size={24} /> Set Target
            </h2>
            <AddTarget />
          </div>
        );
      case "dashboard":
      default:
        return (
          <>
<<<<<<< HEAD
            {/* <div className="mb-6">
              <AddEmployee />
            </div>
            <div className="mb-6 p-4 border rounded-lg shadow-md bg-white">
              <h2 className="text-xl font-semibold mb-2">Set Department Targets</h2>
              <AddDepartment />
            </div>
            <div className="mb-6 p-4 border rounded-lg shadow-md bg-white">
              <h2 className="text-xl font-semibold mb-2">Set Department Targets</h2>
              <AddTarget />
            </div> */}
            {/* <ManagerForm /> */}
=======
>>>>>>> d6f9d1e1feefd3d6976a2c08f0b45c8dbbd38d64
            <div className="p-4 border rounded-lg shadow-md bg-white">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Building2 size={24} /> Projects Overview
              </h2>
              <DepartmentList />
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 p-8 bg-blue-300 text-black ml-64 overflow-y-auto h-screen">
        <h1 className="text-3xl font-bold mb-10 text-white text-center">
          Super Admin Dashboard
        </h1>
        {renderContent()}
      </main>
    </div>
  );
}
