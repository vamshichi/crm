"use client";

import { ArrowLeft, Briefcase, LayoutDashboard, LogOut, Target } from "lucide-react"; // Importing necessary icons
import { useRouter } from "next/navigation";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token"); // ✅ Remove JWT token
    localStorage.removeItem("employee"); // ✅ Remove stored employee data
    localStorage.removeItem("isAuthenticated"); // ✅ Ensure session is cleared
    console.log("🔑 Token deleted successfully"); 
    router.push("/"); // ✅ Redirect to login page
  };

  return (
    <aside className="w-64 bg-blue-900 text-white p-6 flex flex-col min-h-screen fixed">
      <h2 className="text-xl font-bold mb-16 text-center">Manager Panel</h2>

      {/* Add Employee */}
      <button
        className={`py-2 px-4 mb-2 rounded w-full flex items-center ${
          activeTab === "add-employee" ? "bg-blue-700" : ""
        }`}
        onClick={() => setActiveTab("add-employee")}
      >
        <Briefcase className="w-5 h-5 mr-2" />
        Add Employee
      </button>

      {/* Set Targets */}
      <button
        className={`py-2 px-4 mb-2 rounded w-full flex items-center ${
          activeTab === "set-target" ? "bg-blue-700" : ""
        }`}
        onClick={() => setActiveTab("set-target")}
      >
        <Target className="w-5 h-5 mr-2" />
        Set Targets
      </button>

      {/* Dashboard */}
      <button
        className={`py-2 px-4 mb-2 rounded w-full flex items-center ${
          activeTab === "dashboard" ? "bg-blue-700" : ""
        }`}
        onClick={() => setActiveTab("dashboard")}
      >
        <LayoutDashboard className="w-5 h-5 mr-2" />
        Dashboard
      </button>

      <div className="flex-grow" />

      {/* Back Button */}
      <button
        className="py-2 px-4 bg-gray-600 hover:bg-gray-700 rounded mb-2 flex items-center"
        onClick={() => router.back()}
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>

      {/* Logout Button */}
      <button
        className="py-2 px-4 bg-red-600 hover:bg-red-700 rounded flex items-center"
        onClick={handleLogout}
      >
        <LogOut className="w-5 h-5 mr-2" />
        Logout
      </button>
    </aside>
  );
}
