import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "Employee ID is required" }, { status: 400 });
    }

    const employee = await prisma.employee.findUnique({
      where: { id },
      include: { department: true },
    });

    if (!employee) {
      return NextResponse.json({ message: "Employee not found" }, { status: 404 });
    }

    return NextResponse.json(employee, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching employee:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
