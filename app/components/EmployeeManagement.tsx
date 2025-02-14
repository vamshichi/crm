import { useState } from "react";

type Employee = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type Category = "gmec" | "fps" | "ips" | "tascon";

export default function EmployeeManagement({ category }: { category: Category }) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newEmployee, setNewEmployee] = useState<Omit<Employee, "id">>({
    name: "",
    email: "",
    role: "",
  });

  const addEmployee = () => {
    if (newEmployee.name && newEmployee.email && newEmployee.role) {
      setEmployees([...employees, { ...newEmployee, id: Date.now().toString() }]);
      setNewEmployee({ name: "", email: "", role: "" });
    }
  };

  const updateEmployee = (id: string, field: keyof Employee, value: string) => {
    setEmployees(employees.map((emp) => (emp.id === id ? { ...emp, [field]: value } : emp)));
  };

  const deleteEmployee = (id: string) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Employee Management</h2>
      <div className="mb-4 flex space-x-2">
        <input
          type="text"
          placeholder="Name"
          value={newEmployee.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewEmployee({ ...newEmployee, name: e.target.value })
          }
          className="border p-2 rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={newEmployee.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewEmployee({ ...newEmployee, email: e.target.value })
          }
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Role"
          value={newEmployee.role}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewEmployee({ ...newEmployee, role: e.target.value })
          }
          className="border p-2 rounded"
        />
        <button onClick={addEmployee} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Add Employee
        </button>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td className="border p-2">
                <input
                  type="text"
                  value={employee.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateEmployee(employee.id, "name", e.target.value)
                  }
                  className="w-full"
                />
              </td>
              <td className="border p-2">
                <input
                  type="email"
                  value={employee.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateEmployee(employee.id, "email", e.target.value)
                  }
                  className="w-full"
                />
              </td>
              <td className="border p-2">
                <input
                  type="text"
                  value={employee.role}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateEmployee(employee.id, "role", e.target.value)
                  }
                  className="w-full"
                />
              </td>
              <td className="border p-2">
                <button
                  onClick={() => deleteEmployee(employee.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
