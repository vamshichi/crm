import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); // ✅ Make sure this is correctly initialized

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Find employee by email
    const employee = await prisma.employee.findUnique({ where: { email } });

    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 401 });
    }

    // Directly compare passwords
    if (password !== employee.password) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    return NextResponse.json({ id: employee.id });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
