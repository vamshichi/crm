// app/api/employee-leads/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const employeeId = searchParams.get('employeeId');

  if (!employeeId) {
    return NextResponse.json({ error: 'employeeId is required' }, { status: 400 });
  }

  try {
    // Option 1: Find the employee and include their leads
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: { leads: true },
    });
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }
    return NextResponse.json(employee.leads);
    
    // Option 2: Query the Lead model directly (uncomment if preferred)
    // const leads = await prisma.lead.findMany({
    //   where: { employeeId },
    // });
    // return NextResponse.json(leads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
