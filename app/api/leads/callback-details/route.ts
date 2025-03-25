import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get("employeeId");

    if (!employeeId) {
      return NextResponse.json({ error: "Employee ID is required" }, { status: 400 });
    }
    const leads = await prisma.lead.findMany({
      where: {
        employeeId: employeeId,
        status: "CALL_BACK",
      },
      select: {
        id: true,
        name: true,
        phone: true,
        callBackTime: true,
      },
    });
    const leadsWithNotificationTime = leads.map((lead) => {
      if (lead.callBackTime) {
        const callBackDate = new Date(lead.callBackTime);
        const notificationTime = new Date(callBackDate.getTime() - 30 * 60 * 1000); // 30 mins before
        return { ...lead, notificationTime };
      }
      return lead;
    });

    return NextResponse.json({ leads: leadsWithNotificationTime });
  } catch (error) {
    console.error("❌ Error fetching callback leads details:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
