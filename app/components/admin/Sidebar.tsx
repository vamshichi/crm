"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { UserPlus, Users, FolderPlus, Target, LayoutDashboard, ArrowLeft, LogOut } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const router = useRouter();

  return (
    <aside className="w-64 bg-blue-900 text-white p-2 flex flex-col min-h-screen fixed">
      {/* Logo at the Top */}
      <div className="flex justify-center mb-2">
        <Image src="/maxpo.png" alt="Logo" height={150} width={160} className="object-contain" />
      </div>

      {/* Sidebar Buttons (Moved Up) */}
      <nav className="flex flex-col gap-2 mt-1">
        <button
          className={`py-2 px-3 rounded w-full text-left flex items-center gap-2 ${
            activeTab === "add-admin" ? "bg-blue-700" : ""
          }`}
          onClick={() => setActiveTab("add-admin")}
        >
          <UserPlus size={18} /> Add Admin
        </button>

        <button
          className={`py-2 px-3 rounded w-full text-left flex items-center gap-2 ${
            activeTab === "add-employee" ? "bg-blue-700" : ""
          }`}
          onClick={() => setActiveTab("add-employee")}
        >
          <Users size={18} /> Add Employee
        </button>

        <button
          className={`py-2 px-3 rounded w-full text-left flex items-center gap-2 ${
            activeTab === "set-department-target" ? "bg-blue-700" : ""
          }`}
          onClick={() => setActiveTab("set-department-target")}
        >
          <FolderPlus size={18} /> Add New Project
        </button>

        <button
          className={`py-2 px-3 rounded w-full text-left flex items-center gap-2 ${
            activeTab === "set-target" ? "bg-blue-700" : ""
          }`}
          onClick={() => setActiveTab("set-target")}
        >
          <Target size={18} /> Set Targets
        </button>

        <button
          className={`py-2 px-3 rounded w-full text-left flex items-center gap-2 ${
            activeTab === "dashboard" ? "bg-blue-700" : ""
          }`}
          onClick={() => setActiveTab("dashboard")}
        >
          <LayoutDashboard size={18} /> Dashboard
        </button>
      </nav>

      {/* Removed excessive flex-grow to prevent pushing buttons down */}
      <div className="mt-auto flex flex-col gap-2">
        {/* Back Button */}
        <button
          className="py-2 px-3 bg-gray-600 hover:bg-gray-700 rounded flex items-center gap-2"
          onClick={() => router.back()}
        >
          <ArrowLeft size={18} /> Back
        </button>

        {/* Logout Button */}
        <button
          className="py-2 px-3 bg-red-600 hover:bg-red-700 rounded flex items-center gap-2"
          onClick={() => {
            localStorage.removeItem("isAuthenticated");
            router.push("/");
          }}
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
}
