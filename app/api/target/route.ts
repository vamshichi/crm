import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    if (req.method !== "POST") {
      return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }

    const body = await req.json().catch(() => null); // Catch parsing errors
    console.log("Received Payload:", body); // Debugging log

    if (!body) {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const { departmentId, amount, startDate, endDate } = body;

    // Validate input
    if (!departmentId || !amount || !startDate || !endDate) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Ensure amount is a valid number
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json({ error: "Amount must be a valid number greater than 0" }, { status: 400 });
    }

    // Validate date format
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }
    if (start >= end) {
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
        amount: numericAmount,
        startDate: start,
        endDate: end,
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
