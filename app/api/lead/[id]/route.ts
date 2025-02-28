import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;

    if (!id) {
      return NextResponse.json({ error: "Missing Lead ID" }, { status: 400 });
    }

    const requestBody = await req.json();
    const {
      callBackTime: rawCallBackTime,
      createdAt: rawCreatedAt,
      id: _unusedId,
      status: rawStatus,
      employeeId, 
      ...rest 
    } = requestBody;

    // Ensure status is uppercase
    const status = rawStatus ? rawStatus.toUpperCase() : undefined;

    // Convert callBackTime to Date
    const callBackTime = rawCallBackTime
      ? new Date(rawCallBackTime)
      : undefined;
    if (callBackTime && isNaN(callBackTime.getTime())) {
      return NextResponse.json({ error: "Invalid callBackTime" }, { status: 400 });
    }

    // Convert createdAt to Date
    const createdAt = rawCreatedAt ? new Date(rawCreatedAt) : undefined;
    if (createdAt && isNaN(createdAt.getTime())) {
      return NextResponse.json({ error: "Invalid createdAt" }, { status: 400 });
    }

    // Validate employeeId
    if (!employeeId) {
      return NextResponse.json(
        { error: "Employee ID is required" },
        { status: 400 }
      );
    }

    console.log("Updating Lead with ID:", id);
    console.log("Updated Data:", {
      ...rest,
      status,
      callBackTime,
      createdAt,
      employeeId,
    });

    // Perform update with Prisma
    const updatedLead = await prisma.lead.update({
      where: { id: id.toString() },
      data: {
        ...rest,
        status,
        callBackTime,
        createdAt,
        employee: { connect: { id: employeeId } },
      },
    });

    return NextResponse.json(updatedLead, { status: 200 });
  } catch (error) {
    console.error("Error updating lead:", error);
    return NextResponse.json({ error: "Error updating lead" }, { status: 500 });
  }
}
