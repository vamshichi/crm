import { NextResponse } from 'next/server';
import {prisma} from '@/app/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Find the employee by email
    const employee = await prisma.employee.findUnique({
      where: { email },
      include: { department: true },
    });

    if (!employee) {
      return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 401 });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid) {
      return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 401 });
    }

    // Return employee data
    return NextResponse.json({
      success: true,
      employee: {
        id: employee.id,
        email: employee.email,
        role: employee.role,
        department: employee.department?.name,
      },
    }, { status: 200 });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
