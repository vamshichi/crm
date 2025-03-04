import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; // Keep this secret and use .env

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Find admin by email
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: "admin" },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    console.log("🔑 Generated Token:", token); // ✅ Print Token in Console

    return NextResponse.json({
      success: true,
      message: "Login successful",
      token,
    });

  } catch (error) {
    console.error("❌ Login Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
