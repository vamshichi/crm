import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(req: NextRequest, context: unknown): Promise<NextResponse> {
  // Cast context to our expected shape
  const { params } = context as { params: { id: string } };

  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Missing employee ID" }, { status: 400 });
    }

    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        department: true,
        leads: true, // Include the leads relation
      },
    });

    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    return NextResponse.json(employee, { status: 200 });
  } catch (error) {
    console.error("Error fetching employee:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
