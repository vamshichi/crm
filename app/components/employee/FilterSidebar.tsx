"use client";

import { useRouter } from "next/navigation";

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
      <h2 className="text-xl font-bold mb-16 text-center">Employee Panel</h2>

      {/* My Leads */}
      {/* <button
        className={`py-2 px-4 mb-2 rounded w-full text-left ${
          activeTab === "my-leads" ? "bg-green-700" : ""
        }`}
        onClick={() => setActiveTab("my-leads")}
      >
        My Leads
      </button> */}

      {/* Add Lead */}
      <button
        className={`py-2 px-4 mb-2 rounded w-full text-left ${
          activeTab === "add-lead" ? "bg-green-700" : ""
        }`}
        onClick={() => setActiveTab("add-lead")}
      >
        Add Lead
      </button>

      {/* Project Details */}
      <button
        className={`py-2 px-4 mb-2 rounded w-full text-left ${
          activeTab === "project-details" ? "bg-green-700" : ""
        }`}
        onClick={() => setActiveTab("project-details")}
      >
        Project Details
      </button>

      {/* Profile */}
      <button
        className={`py-2 px-4 mb-2 rounded w-full text-left ${
          activeTab === "dashboard" ? "bg-green-700" : ""
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
          router.push("/employee-login");
        }}
      >
        Logout
      </button>
    </aside>
  );
}
