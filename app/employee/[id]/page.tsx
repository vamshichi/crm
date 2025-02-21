// app/employee/[id]/page.tsx
import { notFound } from "next/navigation";
import EmployeeLeads from "@/app/components/leads/getleads";
import LeadForm from "@/app/components/employee/LeadForm";

export default async function EmployeePage({
  params,
}: {
  params: { id: string };
}) {
  // Call the new API route by passing the employee id as a query parameter
  const res = await fetch(`/api/oneemployee?id=${params.id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return notFound();
  }

  const employee = await res.json();

  if (!employee) {
    return notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">
        Welcome to Your Dashboard, {employee.name}
      </h2>
      <p>
        <strong>Email:</strong> {employee.email}
      </p>
      <p>
        <strong>Role:</strong> {employee.role}
      </p>
      <p>
        <strong>Project:</strong> {employee.department?.name || "No department"}
      </p>
      <LeadForm />
      <EmployeeLeads employeeId={employee.id} />
    </div>
  );
}
