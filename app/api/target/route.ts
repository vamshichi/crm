import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { departmentId, amount, startDate, endDate } = await req.json();

    // Validate input
    if (!departmentId || !amount || !startDate || !endDate) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      return NextResponse.json({ error: "Amount must be a valid number greater than 0" }, { status: 400 });
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return NextResponse.json({ error: "Start date must be before end date" }, { status: 400 });
    }

    // Check if department exists
    const department = await prisma.department.findUnique({
      where: { id: departmentId },
    });

    if (!department) {
      return NextResponse.json({ error: "Invalid department ID" }, { status: 404 });
    }

    // Create target
    const target = await prisma.target.create({
      data: {
        departmentId,
        amount: parseFloat(amount),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });

    return NextResponse.json({ message: "Target created successfully", target }, { status: 201 });
  } catch (error) {
    console.error("Error adding target:", error);
    return NextResponse.json({ error: "Failed to add target" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
