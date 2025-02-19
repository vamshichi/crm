import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role, departmentId } = await req.json();

    if (!name || !email || !password || !role || !departmentId) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the employee with the correct Prisma structure
    const newEmployee = await prisma.employee.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        department: {
          connect: { id: departmentId }, // Correctly linking to the department
        },
      },
    });

    return NextResponse.json({ message: "Employee added successfully", employee: newEmployee }, { status: 201 });
  } catch (error) {
    console.error("Error adding employee:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
