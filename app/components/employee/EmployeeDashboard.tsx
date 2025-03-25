"use client";

import { useState, useEffect } from "react";
import { PlusCircle, ClipboardList, Menu } from "lucide-react";
import EmployeeSidebar from "./FilterSidebar";
import EmployeeLeads from "../leads/getleads";
import LeadForm from "./LeadForm";
import DepartmentList from "./DepartmentList";
// import CallbackLeadsCount from "./CallbackLeadsCount";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import EmployeeProfile from "./EmployeeProfile";

interface EmployeeProps {
  employee: {
    id: string;
    name: string;
    email: string;
    // phone:string;
    role: string;
    department?: { name: string } | null;
  };
}

// Define TypeScript Interface for Lead Data
interface Lead {
  id: string;
  name: string;
  // phone: string;
  callBackTime?: string;
}

export default function EmployeeDashboard({ employee }: EmployeeProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  

  // Inside your useEffect
 useEffect(() => {
  async function fetchCallbackLeads() {
    try {
      const response = await fetch(`/api/leads/callback-details?employeeId=${employee.id}`);
      const data: { leads: Lead[] } = await response.json();

      if (data.leads.length > 0) {
        toast.success(`📞 You have ${data.leads.length} pending callback leads!`, {
          duration: 5000,
          position: "top-right",
          style: {
            background: "#2d2d2d",
            color: "#fff",
            borderRadius: "8px",
            padding: "12px",
            fontSize: "16px",
          },
        });
      }

      // 🔔 Schedule reminders for upcoming calls (30 min before callBackTime)
      data.leads.forEach((lead) => {
        if (lead.callBackTime) {
          const callBackDate = new Date(lead.callBackTime); // Convert to Date
          const notificationTime = new Date(callBackDate.getTime() - 30 * 60 * 1000); // 30 mins before callback
          const timeUntilNotification = notificationTime.getTime() - new Date().getTime(); // Use Date() directly

          if (timeUntilNotification > 0) {
            console.log(`⏳ Notification scheduled for: ${notificationTime.toLocaleString()}`);

            setTimeout(() => {
              alert(`⏳ Reminder: Call ${lead.name} at ${callBackDate.toLocaleTimeString()}`, );
            }, timeUntilNotification);
          } else {
            console.log(`⚠️ Skipping notification: ${callBackDate.toLocaleString()} (Too close or past)`);
          }
        }
      });
    } catch (error) {
      console.error("❌ Error fetching callback leads details:", error);
    }
  }

  if (employee.id) {
    fetchCallbackLeads();
  }
}, [employee.id]);

useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <Toaster/>
      <button className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-green-700 text-white" onClick={toggleSidebar}>
        <Menu size={24} />
      </button>

      <EmployeeSidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="w-full lg:ml-64 p-4 md:p-6 flex-grow">
        <div className="mt-12 lg:mt-0">
          {activeTab === "dashboard" && (
            <div>
              <EmployeeProfile employee={employee}/>
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
  );
}

