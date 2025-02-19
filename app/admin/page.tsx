import AddTarget from "@/app/components/admin/AddTarget";
import DepartmentList from "@/app/admin/DepartmentList";
import AddEmployee from "@/app/components/employee/AddEmployeeForm";
import AddDepartment from '@/app/components/admin/department'

const AdminPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Add Employee Button */}
      <div className="mb-6">
        <AddEmployee />
      </div>
      <div className="mb-6 p-4 border rounded-lg shadow-md bg-white">
        <h2 className="text-xl font-semibold mb-2">Set Department Targets</h2>
        <AddDepartment />
      </div>
      {/* Add Target Section */}
      <div className="mb-6 p-4 border rounded-lg shadow-md bg-white">
        <h2 className="text-xl font-semibold mb-2">Set Department Targets</h2>
        <AddTarget />
      </div>

      {/* Department List with Targets & Leads */}
      <div className="p-4 border rounded-lg shadow-md bg-white">
        <h2 className="text-xl font-semibold mb-4">Departments Overview</h2>
        <DepartmentList />
      </div>
    </div>
  );
};

export default AdminPage;
