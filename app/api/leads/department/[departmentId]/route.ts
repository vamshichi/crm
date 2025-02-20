import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET() {
  try {
    const leadCount = await prisma.lead.count({});
    return NextResponse.json({ count: leadCount }, { status: 200 });
  } catch (error) {
    console.error("Error fetching leads count:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
