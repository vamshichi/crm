import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Set secret key with a fallback
const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Find manager by email
    const manager = await prisma.manager.findUnique({
      where: { email },
      include: { department: true },
    });

    if (!manager) {
      return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, manager.password);
    if (!isPasswordValid) {
      return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
    }

    // Generate JWT Token
    const token = jwt.sign(
      {
        id: manager.id,
        email: manager.email,
        role: "manager", // Assuming manager role
        department: manager.department?.name,
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    console.log("Generated Token:", token); // ✅ Debugging token

    return NextResponse.json({
      success: true,
      token, // ✅ Send token in response
      manager: {
        id: manager.id,
        name: manager.name,
        email: manager.email,
        role: "manager",
        department: manager.department?.name,
      },
    }, { status: 200 });

  } catch (error) {
    console.error("Manager Login Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
