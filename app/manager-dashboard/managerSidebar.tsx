"use client"

import { ArrowLeft, Briefcase, LayoutDashboard, LogOut, Menu, Target, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("employee")
    localStorage.removeItem("isAuthenticated")
    console.log("🔑 Token deleted successfully")
    router.push("/")
  }

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-blue-900 text-white p-2 rounded-lg"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-64 bg-blue-900 text-white p-6 flex flex-col min-h-screen fixed left-0 top-0 z-40 transition-transform duration-300 ease-in-out`}
      >
        <h2 className="text-xl font-bold mb-16 text-center">Manager Panel</h2>

        <button
          className={`py-2 px-4 mb-2 rounded w-full flex items-center ${
            activeTab === "add-employee" ? "bg-blue-700" : ""
          }`}
          onClick={() => handleTabClick("add-employee")}
        >
          <Briefcase className="w-5 h-5 mr-2" />
          Add Employee
        </button>

        <button
          className={`py-2 px-4 mb-2 rounded w-full flex items-center ${
            activeTab === "set-target" ? "bg-blue-700" : ""
          }`}
          onClick={() => handleTabClick("set-target")}
        >
          <Target className="w-5 h-5 mr-2" />
          Set Targets
        </button>

        <button
          className={`py-2 px-4 mb-2 rounded w-full flex items-center ${
            activeTab === "dashboard" ? "bg-blue-700" : ""
          }`}
          onClick={() => handleTabClick("dashboard")}
        >
          <LayoutDashboard className="w-5 h-5 mr-2" />
          Dashboard
        </button>

        <div className="flex-grow" />

        <button
          className="py-2 px-4 bg-gray-600 hover:bg-gray-700 rounded mb-2 flex items-center"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        <button className="py-2 px-4 bg-red-600 hover:bg-red-700 rounded flex items-center" onClick={handleLogout}>
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </button>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}

