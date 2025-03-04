import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const manager = await prisma.manager.findUnique({
      where: { email },
      include: { department: true },
    });

    if (!manager) {
      return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, manager.password);
    if (!isPasswordValid) {
      return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { id: manager.id, email: manager.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    return NextResponse.json({
      success: true,
      message: "Login successful",
      token, // Send JWT token
      manager: {
        id: manager.id,
        name: manager.name,
        email: manager.email,
        department: manager.department?.name,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
