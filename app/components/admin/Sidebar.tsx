"use client";

// import { useState } from "react";
import { useRouter } from "next/navigation";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const router = useRouter();
//   const [showDropdown, setShowDropdown] = useState(false);

  return (
    <aside className="w-64 bg-blue-900 text-white p-6 flex flex-col min-h-screen fixed">
      <h2 className="text-xl font-bold mb-16 text-center">Admin Panel</h2>

      <button
        className={`py-2 px-4 mb-2 rounded w-full text-left ${
          activeTab === "add-admin" ? "bg-blue-700" : ""
        }`}
        onClick={() => setActiveTab("add-admin")}
      >
        Add Admin
      </button>

      {/* Add Employee */}
      <button
        className={`py-2 px-4 mb-2 rounded w-full text-left ${
          activeTab === "add-employee" ? "bg-blue-700" : ""
        }`}
        onClick={() => setActiveTab("add-employee")}
      >
        Add Employee
      </button>

      {/* Set Department Targets (Add Department) */}
      <button
        className={`py-2 px-4 mb-2 rounded w-full text-left ${
          activeTab === "set-department-target" ? "bg-blue-700" : ""
        }`}
        onClick={() => setActiveTab("set-department-target")}
      >
        Add new project
      </button>

      {/* Set Department Targets (Add Target) */}
      <button
        className={`py-2 px-4 mb-2 rounded w-full text-left ${
          activeTab === "set-target" ? "bg-blue-700" : ""
        }`}
        onClick={() => setActiveTab("set-target")}
      >
        Set Targets
      </button>

      {/* Departments Overview */}
      {/* <button
        className={`py-2 px-4 mb-2 rounded w-full text-left ${
          activeTab === "departments" ? "bg-blue-700" : ""
        }`}
        onClick={() => setActiveTab("departments")}
      >
        Departments Overview
      </button> */}

      {/* Dashboard: All components */}
      <button
        className={`py-2 px-4 mb-2 rounded w-full text-left ${
          activeTab === "dashboard" ? "bg-blue-700" : ""
        }`}
        onClick={() => setActiveTab("dashboard")}
      >
        Dashboard
      </button>

      <div className="flex-grow" />

      {/* Logout Button */}
      <button
        className="py-2 px-4 bg-red-600 hover:bg-red-700 rounded mt-auto"
        onClick={() => {
          localStorage.removeItem("isAuthenticated");
          router.push("/admin-login");
        }}
      >
        Logout
      </button>
    </aside>
  );
}
