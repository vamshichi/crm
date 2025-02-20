import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET() {
    try {
      const departments = await prisma.employee.findMany();
      return NextResponse.json(departments);
    } catch (error) {
      console.error("Error fetching departments:", error);
      return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
  }