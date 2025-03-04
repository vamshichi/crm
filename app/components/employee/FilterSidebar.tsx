"use client";

import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  UserPlus,
  FileText,
  ArrowLeft,
  LogOut,
} from "lucide-react";

interface EmployeeSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function EmployeeSidebar({
  activeTab,
  setActiveTab,
}: EmployeeSidebarProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token"); // ✅ Remove JWT token
    localStorage.removeItem("employee"); // ✅ Remove stored employee data
    localStorage.removeItem("isAuthenticated"); // ✅ Ensure session is cleared
    console.log("🔑 Token deleted successfully"); 
    router.push("/"); // ✅ Redirect to login page
  };

  return (
    <aside className="w-64 bg-green-900 text-white p-6 flex flex-col min-h-screen fixed">
      <h2 className="text-xl font-bold mb-16 text-center">Employee Panel</h2>

      {/* Dashboard */}
      <button
        className={`py-2 px-4 mb-2 rounded w-full text-left flex items-center gap-3 ${
          activeTab === "dashboard" ? "bg-green-700" : ""
        }`}
        onClick={() => setActiveTab("dashboard")}
      >
        <LayoutDashboard size={18} />
        Dashboard
      </button>

      {/* Add Lead */}
      <button
        className={`py-2 px-4 mb-2 rounded w-full text-left flex items-center gap-3 ${
          activeTab === "add-lead" ? "bg-green-700" : ""
        }`}
        onClick={() => setActiveTab("add-lead")}
      >
        <UserPlus size={18} />
        Add Lead
      </button>

      {/* Project Details */}
      <button
        className={`py-2 px-4 mb-2 rounded w-full text-left flex items-center gap-3 ${
          activeTab === "project-details" ? "bg-green-700" : ""
        }`}
        onClick={() => setActiveTab("project-details")}
      >
        <FileText size={18} />
        Project Details
      </button>

      <div className="flex-grow" />

      {/* Back Button */}
      <button
        className="py-2 px-4 bg-gray-600 hover:bg-gray-700 rounded mb-2 flex items-center gap-3"
        onClick={() => router.back()}
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* Logout Button */}
      <button
        className="py-2 px-4 bg-red-600 hover:bg-red-700 rounded flex items-center gap-3"
        onClick={handleLogout} // ✅ Use logout function
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}
