"use client";

import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  UserPlus, 
  FileText, 
  ArrowLeft, 
  LogOut 
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

  return (
    <aside className="w-64 bg-green-900 text-white p-6 flex flex-col min-h-screen fixed">
           
              <img src="/maxpo.png" alt="Logo" height={300} width={160}  />
       

      {/* Dashboard (Default) */}
      <button
        className={`py-2 px-4 mb-2 flex items-center gap-2 rounded w-full text-left ${
          activeTab === "dashboard" ? "bg-green-700" : ""
        }`}
        onClick={() => setActiveTab("dashboard")}
      >
        <LayoutDashboard size={20} />
        Dashboard
      </button>

      {/* Add Lead */}
      <button
        className={`py-2 px-4 mb-2 flex items-center gap-2 rounded w-full text-left ${
          activeTab === "add-lead" ? "bg-green-700" : ""
        }`}
        onClick={() => setActiveTab("add-lead")}
      >
        <UserPlus size={20} />
        Add Lead
      </button>

      {/* Project Details */}
      <button
        className={`py-2 px-4 mb-2 flex items-center gap-2 rounded w-full text-left ${
          activeTab === "project-details" ? "bg-green-700" : ""
        }`}
        onClick={() => setActiveTab("project-details")}
      >
        <FileText size={20} />
        Project Details
      </button>

      <div className="flex-grow" />

      {/* Back Button */}
      <button
        className="py-2 px-4 bg-gray-600 hover:bg-gray-700 rounded mb-2 flex items-center gap-2"
        onClick={() => router.back()}
      >
        <ArrowLeft size={20} />
        Back
      </button>

      {/* Logout Button */}
      <button
        className="py-2 px-4 bg-red-600 hover:bg-red-700 rounded flex items-center gap-2"
        onClick={() => {
          localStorage.removeItem("isAuthenticated");
          router.push("/");
        }}
      >
        <LogOut size={20} />
        Logout
      </button>
    </aside>
  );
}
