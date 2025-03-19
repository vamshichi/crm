"use client"

import { useState, useEffect } from "react"
import { User, Mail, Briefcase, FolderKanban, LayoutDashboard, PlusCircle, ClipboardList, Menu } from "lucide-react"
import EmployeeSidebar from "./FilterSidebar"
import EmployeeLeads from "../leads/getleads"
import LeadForm from "./LeadForm"
import DepartmentList from "./DepartmentList"
interface EmployeeProps {
  employee: {
    id: string
    name: string
    email: string
    role: string
    department?: { name: string } | null
  }
}

export default function EmployeeDashboard({ employee }: EmployeeProps) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Close sidebar when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* <GlobalSearch/> */}
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-green-700 text-white"
        onClick={toggleSidebar}
      >
        <Menu size={24} />
      </button>

      {/* Employee Sidebar with icons */}
      <EmployeeSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="w-full lg:ml-64 p-4 md:p-6 flex-grow">
        <div className="mt-12 lg:mt-0">
          {activeTab === "dashboard" && (
            <div>
              <div className="bg-white shadow-md p-4 md:p-6 rounded-lg">
                <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-2">
                  <LayoutDashboard className="text-green-600" size={24} /> Employee Profile
                </h2>
                <div className="space-y-2">
                  <p className="flex items-center gap-2">
                    <User className="text-blue-500 shrink-0" size={20} /> <strong>Name:</strong> {employee.name}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="text-red-500 shrink-0" size={20} /> <strong>Email:</strong>
                    <span className="break-all">{employee.email}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Briefcase className="text-yellow-500 shrink-0" size={20} /> <strong>Role:</strong> {employee.role}
                  </p>
                  <p className="flex items-center gap-2">
                    <FolderKanban className="text-purple-500 shrink-0" size={20} /> <strong>Project:</strong>{" "}
                    {employee.department?.name || "No department assigned"}
                  </p>
                </div>
              </div>
              <EmployeeLeads employeeId={employee.id} />
            </div>
          )}

          {activeTab === "add-lead" && (
            <div>
              <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-2">
                <PlusCircle className="text-green-500" size={24} /> Add New Lead
              </h2>
              <LeadForm />
            </div>
          )}

          {activeTab === "project-details" && (
            <div>
              <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-2">
                <ClipboardList className="text-blue-500" size={24} /> Project Details
              </h2>
              <DepartmentList employeeId={employee.id} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

