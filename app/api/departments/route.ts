import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma"; // Adjust the import path if needed

export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      include: {
        target: true, // Include target amount
        employees: {
          include: {
            leads: true, // Ensure leads are included in the employees relation
          },
        },
      },
    });

    // Transform the data to calculate totalLeads and soldLeads
    const formattedDepartments = departments.map((dept) => ({
      id: dept.id,
      name: dept.name,
      target: dept.target ? dept.target.amount : null,
      totalLeads: dept.employees.reduce((sum, emp) => sum + emp.leads.length, 0),
      soldLeads: dept.employees.reduce(
        (sum, emp) => sum + emp.leads.filter((lead) => lead.status === "SOLD").length,
        0
      ),
    }));

    return NextResponse.json(formattedDepartments);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch departments" }, { status: 500 });
  }
}
