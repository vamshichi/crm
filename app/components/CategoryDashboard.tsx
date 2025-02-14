import { useState } from "react"
import LeadManagement from "./LeadManagement"
import EmployeeManagement from "./EmployeeManagement"
import SalesTargetTracking from "./SalesTargetTracking"

type Category = "gmec" | "fps" | "ips" | "tascon"

export default function CategoryDashboard({ category }: { category: Category }) {
  const [activeTab, setActiveTab] = useState<"leads" | "employees" | "targets">("leads")

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{category.toUpperCase()} Dashboard</h1>
      <div className="mb-4">
        <button
          onClick={() => setActiveTab("leads")}
          className={`mr-2 px-4 py-2 rounded ${activeTab === "leads" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Leads
        </button>
        <button
          onClick={() => setActiveTab("employees")}
          className={`mr-2 px-4 py-2 rounded ${activeTab === "employees" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Employees
        </button>
        <button
          onClick={() => setActiveTab("targets")}
          className={`px-4 py-2 rounded ${activeTab === "targets" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Targets
        </button>
      </div>
      {activeTab === "leads" && <LeadManagement category={category} />}
      {activeTab === "employees" && <EmployeeManagement category={category} />}
      {activeTab === "targets" && <SalesTargetTracking category={category} />}
    </div>
  )
}

