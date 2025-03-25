"use client"

import { useRouter } from "next/navigation"
import { LayoutDashboard, UserPlus, FileText, ArrowLeft, LogOut, X } from "lucide-react"

interface EmployeeSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  isOpen?: boolean
  onClose?: () => void
}

export default function EmployeeSidebar({ activeTab, setActiveTab, isOpen = false, onClose }: EmployeeSidebarProps) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("employee")
    localStorage.removeItem("isAuthenticated")
    console.log("🔑 Token deleted successfully")
    router.push("/")
  }

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
    if (onClose && window.innerWidth < 1024) {
      onClose()
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />}

      <aside
        className={`
        w-64 bg-green-900 text-white p-6 flex flex-col min-h-screen
        fixed z-50 transition-all duration-300 ease-in-out
        ${isOpen ? "left-0" : "-left-64"} 
        lg:left-0 lg:z-30
      `}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold">Employee Panel</h2>
          <button className="lg:hidden text-white" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Dashboard */}
        <button
          className={`py-2 px-4 mb-2 rounded w-full text-left flex items-center gap-3 ${
            activeTab === "dashboard" ? "bg-green-700" : ""
          }`}
          onClick={() => handleTabClick("dashboard")}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </button>

        {/* Add Lead */}
        <button
          className={`py-2 px-4 mb-2 rounded w-full text-left flex items-center gap-3 ${
            activeTab === "add-lead" ? "bg-green-700" : ""
          }`}
          onClick={() => handleTabClick("add-lead")}
        >
          <UserPlus size={18} />
          Add Lead
        </button>

        {/* Project Details */}
        <button
          className={`py-2 px-4 mb-2 rounded w-full text-left flex items-center gap-3 ${
            activeTab === "project-details" ? "bg-green-700" : ""
          }`}
          onClick={() => handleTabClick("project-details")}
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
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>
    </>
  )
}

