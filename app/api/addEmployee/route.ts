import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    // Log the raw request body for debugging
    const rawBody = await req.text();
    console.log("🔍 Raw Request Body:", rawBody);

    // Ensure the body is not empty
    if (!rawBody) {
      return NextResponse.json({ message: "Request body is missing" }, { status: 400 });
    }

    // Parse JSON safely
    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (jsonError) {
      console.error("❌ Invalid JSON:", jsonError);
      return NextResponse.json({ message: "Invalid JSON format" }, { status: 400 });
    }

    const { name, email, password, role, departmentId } = body;

    // Validate required fields
    if (!name || !email || !password || !role || !departmentId) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // Check if department exists
    const department = await prisma.department.findUnique({
      where: { id: departmentId },
    });

    if (!department) {
      return NextResponse.json({ message: "Invalid department ID" }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the employee
    const newEmployee = await prisma.employee.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        department: {
          connect: { id: departmentId }, // Ensure department exists before connecting
        },
      },
    });

    return NextResponse.json({ message: "Employee added successfully", employee: newEmployee }, { status: 201 });

  } catch (error) {
    console.error("❌ Error adding employee:", error);

    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
