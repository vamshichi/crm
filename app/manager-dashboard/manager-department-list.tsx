"use client"

import CircularProgress from "@/app/components/ui/CircularProgress"
import { ChevronDown, ChevronUp, Eye, Trash2, Pencil, Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import UpdateEmployee from "../components/employee/UpdateEmployee"

interface Lead {
  id: string
  status: string
  createdAt: string
}

interface Employee {
  id: string
  name: string
  leads: Lead[]
}

interface Department {
  id: string
  name: string
  target?: number
  totalLeads: number
  soldLeads: number
  employees?: Employee[]
}

interface ManagerDepartmentListProps {
  managerDepartment: string
}

const ManagerDepartmentList = ({ managerDepartment }: ManagerDepartmentListProps) => {
  const [departments, setDepartments] = useState<Department[]>([])
  const [error, setError] = useState<string | null>(null)
  const [expandedDepartments, setExpandedDepartments] = useState<string[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [expandedEmployees, setExpandedEmployees] = useState<string[]>([])

  const router = useRouter()

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/departments")
        if (!response.ok) throw new Error("Failed to fetch department data")
        const data = await response.json()

        // Filter departments to only include the manager's department
        const filteredDepartments = data.filter(
          (dept: Department) => dept.name.toLowerCase() === managerDepartment.toLowerCase(),
        )

        setDepartments(filteredDepartments)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    if (managerDepartment) {
      fetchDepartments()
    }
  }, [managerDepartment])

  const toggleExpanded = (deptId: string) => {
    setExpandedDepartments((prev) => (prev.includes(deptId) ? prev.filter((id) => id !== deptId) : [...prev, deptId]))
  }

  const toggleEmployeeExpanded = (empId: string) => {
    setExpandedEmployees((prev) => (prev.includes(empId) ? prev.filter((id) => id !== empId) : [...prev, empId]))
  }

  const handleEmployeeSelect = (employee: Employee) => {
    setSelectedEmployee(employee)
  }

  const handleUpdateClick = (employeeId: string) => {
    setSelectedEmployeeId(employeeId)
    setShowUpdateModal(true)
  }

  const confirmDelete = async () => {
    if (!selectedEmployee) return

    setIsDeleting(true)
    setError(null) // Clear previous errors

    try {
      const response = await fetch(`/api/delete_employee?id=${selectedEmployee.id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete employee")
      }

      if (data.success) {
        setDepartments((prevDepartments) =>
          prevDepartments.map((dept) => ({
            ...dept,
            employees: dept.employees?.filter((emp) => emp.id !== selectedEmployee.id),
          })),
        )
        setSelectedEmployee(null)
      } else {
        throw new Error(data.message || "Failed to delete employee")
      }
    } catch (err) {
      console.error("Delete error:", err)
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4">
      {error && <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-center">{error}</div>}

      {departments.length === 0 && !error ? (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-lg text-center">
          No department data found for {managerDepartment}. Please contact an administrator.
        </div>
      ) : (
        departments.map((dept) => {
          const target = dept.target || 0
          const targetPercentage = target > 0 ? 100 : 0
          const totalLeadsPercentage = target > 0 ? Math.min(Math.round((dept.totalLeads / target) * 100), 100) : 0
          const soldLeadsPercentage = target > 0 ? Math.min(Math.round((dept.soldLeads / target) * 100), 100) : 0

          // Calculate hot leads across employees (case-insensitive)
          const hotLeads =
            dept.employees?.reduce((sum, emp) => {
              const empHot = emp.leads.filter((lead) => lead.status && lead.status.toUpperCase() === "HOT").length
              return sum + empHot
            }, 0) || 0
          const hotLeadsPercentage = target > 0 ? Math.min(Math.round((hotLeads / target) * 100), 100) : 0

          // Calculate remaining: target minus sold leads
          const remaining = target > 0 ? Math.max(target - dept.soldLeads, 0) : 0
          const remainingPercentage = target > 0 ? Math.min(Math.round((remaining / target) * 100), 100) : 0

          const employeeDetails = dept.employees || []
          const isExpanded = expandedDepartments.includes(dept.id)

          return (
            <div
              key={dept.id}
              className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mb-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-center sm:text-left border-b pb-2 w-full sm:w-auto">
                  {dept.name} Department
                </h3>
                <button
                  onClick={() => toggleExpanded(dept.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 rounded flex items-center gap-1 text-sm w-full sm:w-auto justify-center"
                  aria-expanded={isExpanded}
                  aria-controls={`dept-${dept.id}-content`}
                >
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  {isExpanded ? "Collapse" : "Expand"}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 py-4">
                {/* Target Circle */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20">
                    <CircularProgress value={targetPercentage} text={target > 0 ? `${dept.target}` : "N/A"} />
                  </div>
                  <p className="text-center mt-2 text-xs text-gray-600">Target</p>
                </div>
                {/* Total Leads Circle */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20">
                    <CircularProgress value={totalLeadsPercentage} text={`${dept.totalLeads}`} />
                  </div>
                  <p className="text-center mt-2 text-xs text-gray-600">Total Leads</p>
                </div>
                {/* Sold Leads Circle */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20">
                    <CircularProgress value={soldLeadsPercentage} text={`${dept.soldLeads}`} />
                  </div>
                  <p className="text-center mt-2 text-xs text-gray-600">Sold Leads</p>
                </div>
                {/* Hot Leads Circle */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20">
                    <CircularProgress value={hotLeadsPercentage} text={`${hotLeads}`} />
                  </div>
                  <p className="text-center mt-2 text-xs text-gray-600">Prospects</p>
                </div>
                {/* Remaining Circle */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20">
                    <CircularProgress value={remainingPercentage} text={`${remaining}`} />
                  </div>
                  <p className="text-center mt-2 text-xs text-gray-600">Remaining</p>
                </div>
              </div>

              {isExpanded && (
                <div id={`dept-${dept.id}-content`} className="mt-6">
                  <h4 className="text-lg font-semibold mb-4 text-center">Employee Details</h4>
                  {employeeDetails.length === 0 ? (
                    <p className="text-center text-gray-500">No employees found in this department.</p>
                  ) : (
                    <>
                      {/* Desktop Table View - Hidden on mobile */}
                      <div className="hidden md:block overflow-x-auto w-full">
                        <table className="w-full border-collapse border border-gray-300">
                          <thead className="bg-gray-200">
                            <tr>
                              <th className="border p-2 text-left text-sm whitespace-nowrap">Employee</th>
                              <th className="border p-2 text-center text-sm whitespace-nowrap">Total</th>
                              <th className="border p-2 text-center text-sm whitespace-nowrap">Sold</th>
                              <th className="border p-2 text-center text-sm whitespace-nowrap">Hot</th>
                              <th className="border p-2 text-center text-sm whitespace-nowrap">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {employeeDetails.map((emp) => {
                              const totalLeads = emp.leads.length
                              const soldLeads = emp.leads.filter((lead) => lead.status?.toUpperCase() === "SOLD").length
                              const empHotLeads = emp.leads.filter(
                                (lead) => lead.status?.toUpperCase() === "HOT",
                              ).length

                              return (
                                <tr key={emp.id} className="hover:bg-gray-50">
                                  <td className="border p-2 text-sm whitespace-nowrap">{emp.name}</td>
                                  <td className="border p-2 text-center text-sm whitespace-nowrap">{totalLeads}</td>
                                  <td className="border p-2 text-center text-green-600 font-bold text-sm whitespace-nowrap">
                                    {soldLeads}
                                  </td>
                                  <td className="border p-2 text-center text-red-600 font-bold text-sm whitespace-nowrap">
                                    {empHotLeads}
                                  </td>
                                  <td className="border p-2 text-center whitespace-nowrap">
                                    <div className="flex gap-2 justify-center">
                                      <button
                                        onClick={() => router.push(`/employee/${emp.id}`)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 text-sm rounded flex items-center justify-center"
                                      >
                                        <Eye size={14} className="mr-1" /> View
                                      </button>
                                      <button
                                        onClick={() => handleUpdateClick(emp.id)}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 text-sm rounded flex items-center justify-center"
                                      >
                                        <Pencil size={14} className="mr-1" /> Update
                                      </button>
                                      <button
                                        onClick={() => handleEmployeeSelect(emp)}
                                        className="bg-red-600 hover:bg-red-700 text-white py-1 px-2 text-sm rounded flex items-center justify-center"
                                      >
                                        <Trash2 size={14} className="mr-1" /> Delete
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile Card View - Visible only on small screens */}
                      <div className="md:hidden space-y-4">
                        {employeeDetails.map((emp) => {
                          const totalLeads = emp.leads.length
                          const soldLeads = emp.leads.filter((lead) => lead.status?.toUpperCase() === "SOLD").length
                          const empHotLeads = emp.leads.filter((lead) => lead.status?.toUpperCase() === "HOT").length
                          const isEmployeeExpanded = expandedEmployees.includes(emp.id)

                          return (
                            <div key={emp.id} className="border border-gray-300 rounded-lg overflow-hidden">
                              <div
                                className="bg-gray-100 p-3 flex justify-between items-center cursor-pointer"
                                onClick={() => toggleEmployeeExpanded(emp.id)}
                              >
                                <div className="font-medium">{emp.name}</div>
                                <div className="flex items-center gap-2">
                                  {isEmployeeExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </div>
                              </div>

                              <div className="p-3 flex justify-between items-center border-t border-gray-200">
                                <div className="grid grid-cols-3 w-full text-center text-sm">
                                  <div>
                                    <div className="font-semibold">{totalLeads}</div>
                                    <div className="text-xs text-gray-500">Total</div>
                                  </div>
                                  <div>
                                    <div className="font-semibold text-green-600">{soldLeads}</div>
                                    <div className="text-xs text-gray-500">Sold</div>
                                  </div>
                                  <div>
                                    <div className="font-semibold text-red-600">{empHotLeads}</div>
                                    <div className="text-xs text-gray-500">Hot</div>
                                  </div>
                                </div>
                              </div>

                              {isEmployeeExpanded && (
                                <div className="p-3 border-t border-gray-200 flex flex-col gap-2">
                                  <button
                                    onClick={() => router.push(`/employee/${emp.id}`)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded flex items-center justify-center gap-1"
                                  >
                                    <Eye size={16} /> View Details
                                  </button>
                                  <button
                                    onClick={() => handleUpdateClick(emp.id)}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-3 rounded flex items-center justify-center gap-1"
                                  >
                                    <Pencil size={16} /> Update Employee
                                  </button>
                                  <button
                                    onClick={() => handleEmployeeSelect(emp)}
                                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded flex items-center justify-center gap-1"
                                  >
                                    <Trash2 size={16} /> Delete Employee
                                  </button>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )
        })
      )}

      {/* Update Employee Modal */}
      {showUpdateModal && selectedEmployeeId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <UpdateEmployee employeeId={selectedEmployeeId} onClose={() => setShowUpdateModal(false)} />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg text-center w-full max-w-sm">
            <h3 className="text-lg font-semibold">Confirm Deletion</h3>
            <p className="mt-2 text-gray-600">
              Are you sure you want to delete <strong>{selectedEmployee.name}</strong>?
            </p>
            <div className="mt-4 flex flex-col sm:flex-row justify-center gap-2">
              <button
                onClick={() => setSelectedEmployee(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded order-1 sm:order-2"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManagerDepartmentList

