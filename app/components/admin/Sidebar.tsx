"use client";

import { useRouter } from "next/navigation";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const router = useRouter();

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

      <button
        className={`py-2 px-4 mb-2 rounded w-full text-left ${
          activeTab === "add-manager" ? "bg-blue-700" : ""
        }`}
        onClick={() => setActiveTab("add-manager")}
      >
        Add Manager
      </button>

      <button
        className={`py-2 px-4 mb-2 rounded w-full text-left ${
          activeTab === "add-employee" ? "bg-blue-700" : ""
        }`}
        onClick={() => setActiveTab("add-employee")}
      >
        Add Employee
      </button>

      <button
        className={`py-2 px-4 mb-2 rounded w-full text-left ${
          activeTab === "set-department-target" ? "bg-blue-700" : ""
        }`}
        onClick={() => setActiveTab("set-department-target")}
      >
        Add new project
      </button>

      <button
        className={`py-2 px-4 mb-2 rounded w-full text-left ${
          activeTab === "set-target" ? "bg-blue-700" : ""
        }`}
        onClick={() => setActiveTab("set-target")}
      >
        Set Targets
      </button>

      <button
        className={`py-2 px-4 mb-2 rounded w-full text-left ${
          activeTab === "dashboard" ? "bg-blue-700" : ""
        }`}
        onClick={() => setActiveTab("dashboard")}
      >
        Dashboard
      </button>

      <div className="flex-grow" />

      {/* Back Button */}
      <button
        className="py-2 px-4 bg-gray-600 hover:bg-gray-700 rounded mb-2"
        onClick={() => router.back()}
      >
        Back
      </button>

      {/* Logout Button */}
      <button
        className="py-2 px-4 bg-red-600 hover:bg-red-700 rounded"
        onClick={() => {
          localStorage.removeItem("isAuthenticated");
          router.push("/");
        }}
      >
        Logout
      </button>
    </aside>
  );
}
