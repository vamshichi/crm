// app/api/employee/oneemployee/route.ts file  ........
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Employee id is required" }, { status: 400 });
  }

  try {
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: { department: true },
    });

    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    return NextResponse.json(employee);
  } catch (error) {
    console.error("Error fetching employee:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
