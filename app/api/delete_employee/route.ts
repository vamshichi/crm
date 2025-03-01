import { prisma } from "@/app/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
    console.log('data')
    
    try {
      const url = new URL(request.url);
      const id = url.searchParams.get("id");
  
      if (!id) {
        return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
      }
  
      console.log("Deleting Employee ID:", id);
  
      // First, delete all leads of the employee
      await prisma.lead.deleteMany({
        where: { employeeId: id },
      });
  
      // Then, delete the employee
      await prisma.employee.delete({
        where: { id },
      });
  
      return NextResponse.json({ success: true, message: "Employee and their leads deleted successfully" }, { status: 200 });
  
    } catch (error) {
      console.error("Delete employee error:", error);
      return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
  }
  