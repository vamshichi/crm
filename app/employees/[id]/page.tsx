import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function EmployeeDashboard({ params }: { params: { id: string } }) {
  const employeeId = params.id;

  // Fetch leads for the logged-in employee
  const leads = await prisma.lead.findMany({
    where: { employeeId },
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Your Leads</h1>
      {leads.length === 0 ? (
        <p>No leads assigned.</p>
      ) : (
        <ul className="space-y-2">
          {leads.map((lead) => (
            <li key={lead.id} className="p-4 bg-gray-100 rounded shadow">
              {lead.name} - {lead.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
