import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, email, role, phone, password, company } = await req.json();
    const employee = await prisma.employee.create({
      data: { name, email, role, phone, password, company },
    });
    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error creating employee" }, { status: 500 });
  }
}
