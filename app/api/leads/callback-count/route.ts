import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma"; // Adjust the path to your Prisma instance

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get("employeeId");

    if (!employeeId) {
      return NextResponse.json({ error: "Employee ID is required" }, { status: 400 });
    }

    // 🛠 Fetching callback leads count for the given employee
    const callbackLeadsCount = await prisma.lead.count({
      where: {
        employeeId: employeeId,
        status: "CALL_BACK", // Ensure this matches your LeadStatus enum
      },
    });

    // 🏷 Fetch all leads with callBackTime for this employee, sorted by callBackTime
    const maxLeads = await prisma.lead.findMany({
      where: { 
        employeeId: employeeId, 
        callBackTime: { not: null } 
      },
      select: {
        id: true,
        name: true,
        phone: true,
        callBackTime: true,
      },
      orderBy: {
        callBackTime: "asc", // Sorting by earliest callback time
      },
    });

    return NextResponse.json({ callbackLeadsCount, maxLeads });
  } catch (error) {
    console.error("❌ Error fetching callback leads count:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
