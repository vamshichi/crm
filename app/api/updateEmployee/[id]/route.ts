import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"; // ✅ Import bcrypt

const prisma = new PrismaClient();

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ Ensure params is a Promise
) {
  try {
    const resolvedParams = await context.params; // ✅ Await params
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json({ message: "Employee ID is required" }, { status: 400 });
    }

    const body = await req.json();
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ message: "No data provided for update" }, { status: 400 });
    }

    // ✅ Hash password if provided
    if (body.password) {
      const saltRounds = 10;
      body.password = await bcrypt.hash(body.password, saltRounds);
    }

    // ✅ Update employee in the database
    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(updatedEmployee, { status: 200 });
  } catch (error) {
    console.error("❌ Error updating employee:", error);

    // ✅ Proper error handling
    if (error instanceof Error) {
      if ("code" in error && error.code === "P2025") {
        return NextResponse.json({ message: "Employee not found" }, { status: 404 });
      }
      return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 });
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
