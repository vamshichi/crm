"use client";

import { useRouter } from "next/navigation";
import { UserPlus, Users, FolderPlus, Target, LayoutDashboard, ArrowLeft, LogOut } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const router = useRouter();

  return (
    <aside className="w-64 bg-blue-900 text-white p-4 flex flex-col min-h-screen fixed">
      {/* Logo at the Top (Reduced Gap) */}
      
        <img src="/maxpo.png" alt="Logo" height={300} width={200}   />


      {/* Sidebar Buttons (Reduced Margin Above) */}
      <nav className="flex flex-col gap-1 mt-1">
        <button
          className={`py-2 px-3 rounded w-full text-left flex items-center gap-2 ${
            activeTab === "add-admin" ? "bg-blue-700" : ""
          }`}
          onClick={() => setActiveTab("add-admin")}
        >
          <UserPlus size={20} /> Add Admin
        </button>

        <button
          className={`py-2 px-3 rounded w-full text-left flex items-center gap-2 ${
            activeTab === "add-employee" ? "bg-blue-700" : ""
          }`}
          onClick={() => setActiveTab("add-employee")}
        >
          <Users size={20} /> Add Employee
        </button>

        <button
          className={`py-2 px-3 rounded w-full text-left flex items-center gap-2 ${
            activeTab === "set-department-target" ? "bg-blue-700" : ""
          }`}
          onClick={() => setActiveTab("set-department-target")}
        >
          <FolderPlus size={20} /> Add New Project
        </button>

        <button
          className={`py-2 px-3 rounded w-full text-left flex items-center gap-2 ${
            activeTab === "set-target" ? "bg-blue-700" : ""
          }`}
          onClick={() => setActiveTab("set-target")}
        >
          <Target size={20} /> Set Targets
        </button>

        <button
          className={`py-2 px-3 rounded w-full text-left flex items-center gap-2 ${
            activeTab === "dashboard" ? "bg-blue-700" : ""
          }`}
          onClick={() => setActiveTab("dashboard")}
        >
          <LayoutDashboard size={20} /> Dashboard
        </button>
      </nav>

      {/* Footer Buttons */}
      <div className="mt-auto flex flex-col gap-2">
        {/* Back Button */}
        <button
          className="py-2 px-3 bg-gray-600 hover:bg-gray-700 rounded flex items-center gap-2"
          onClick={() => router.back()}
        >
          <ArrowLeft size={20} /> Back
        </button>

        {/* Logout Button */}
        <button
          className="py-2 px-3 bg-red-600 hover:bg-red-700 rounded flex items-center gap-2"
          onClick={() => {
            localStorage.removeItem("isAuthenticated");
            router.push("/");
          }}
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
}
