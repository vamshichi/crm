import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 🔹 Find manager by email
    const manager = await prisma.manager.findUnique({
      where: { email },
      include: { department: true },
    });

    if (!manager) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 🔹 Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, manager.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // ✅ Return ID along with other details
    return NextResponse.json(
      {
        success: true,
        manager: {
          id: manager.id, // ✅ Ensure ID is included
          name: manager.name,
          email: manager.email,
          department: manager.department?.name,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
