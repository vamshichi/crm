import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Company } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { company: string } }
) {
  try {
    // ✅ Ensure `params` is awaited before accessing
    if (!params || !params.company) {
      return NextResponse.json(
        { success: false, message: "Company parameter is missing" },
        { status: 400 }
      );
    }

    const company = params.company as Company;

    // ✅ Validate the company parameter before querying Prisma
    if (!Object.values(Company).includes(company)) {
      return NextResponse.json(
        { success: false, message: "Invalid company name" },
        { status: 400 }
      );
    }

    // ✅ Fetch employees based on the selected company
    const employees = await prisma.employee.findMany({
      where: { company },
    });

    return NextResponse.json(employees, { status: 200 });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
