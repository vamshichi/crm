"use client";

import { useState } from "react";
// import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/admin/Sidebar";
import AddEmployee from "@/app/components/employee/AddEmployeeForm";
import AddDepartment from "@/app/components/admin/department"; // Component to add department
import AddTarget from "@/app/components/admin/AddTarget";
import DepartmentList from "./DepartmentList";
import AdminForm from "../components/admin/adminform";
import ManagerForm from "../components/managers/addManagerForm";

export default function AdminPage() {
  // Define activeTab values. You can adjust these values as needed.
  const [activeTab, setActiveTab] = useState("dashboard");

  // Render main content based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case "add-admin":
        return (
          <div className="mb-6">
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
            <AddEmployee />
          </div>
        );
      case "set-department-target":
        return (
          <div className="mb-6 p-4 border rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-semibold mb-2">Set Department Targets</h2>
            <AddDepartment />
          </div>
        );
      case "set-target":
        return (
          <div className="mb-6 p-4 border rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-semibold mb-2">Set Department Targets</h2>
            <AddTarget />
          </div>
        );
    //   case "departments":
    //     return (
    //       <div className="p-4 border rounded-lg shadow-md bg-white">
    //         <h2 className="text-xl font-semibold mb-4">Departments Overview</h2>
    //         <DepartmentList />
    //       </div>
    //     );
      case "dashboard":
      default:
        // Default dashboard shows all components
        return (
          <>
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
            <div className="p-4 border rounded-lg shadow-md bg-white">
              <h2 className="text-xl font-semibold mb-4">Projects Overview</h2>
              <DepartmentList/>
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
        <h1 className="text-3xl font-bold mb-10 text-white text-center">Super Admin Dashboard</h1>
        {renderContent()}
      </main>
    </div>
  );
}
