import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ Get all departments


export async function GET() {
    try {
      const departments = await prisma.department.findMany();
      return NextResponse.json(departments);
    } catch (error) {
      console.error("Error fetching departments:", error);
      return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
  }


// ✅ Create a new department
export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ message: "Department name is required" }, { status: 400 });
    }

    const department = await prisma.department.create({
      data: { name },
    });

    return NextResponse.json({ message: "Department created successfully", department }, { status: 201 });
  } catch (error) {
    console.error("Error creating department:", error);
    return NextResponse.json({ message: "Error creating department" }, { status: 500 });
  }
}

// ✅ Update a department
export async function PUT(req: NextRequest) {
  try {
    const { id, name } = await req.json();

    if (!id || !name) {
      return NextResponse.json({ message: "Department ID and name are required" }, { status: 400 });
    }

    const updatedDepartment = await prisma.department.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json({ message: "Department updated successfully", department: updatedDepartment }, { status: 200 });
  } catch (error) {
    console.error("Error updating department:", error);
    return NextResponse.json({ message: "Error updating department" }, { status: 500 });
  }
}

// ✅ Delete a department
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ message: "Department ID is required" }, { status: 400 });
    }

    await prisma.department.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Department deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting department:", error);
    return NextResponse.json({ message: "Error deleting department" }, { status: 500 });
  }
}
