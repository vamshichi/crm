import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, departmentId } = await req.json();

    if (!name || !email || !password || !departmentId) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const department = await prisma.department.findUnique({
      where: { id: departmentId },
    });

    if (!department) {
      return NextResponse.json({ error: "Invalid department ID" }, { status: 404 });
    }

    const existingManager = await prisma.manager.findUnique({
      where: { email },
    });

    if (existingManager) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const manager = await prisma.manager.create({
      data: {
        name,
        email,
        password: hashedPassword,
        departmentId,
      },
    });

    return NextResponse.json({ message: "Manager added successfully", manager }, { status: 201 });
  } catch (error) {
    console.error("Error adding manager:", error);
    return NextResponse.json({ error: "Failed to add manager" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
