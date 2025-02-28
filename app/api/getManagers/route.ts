import { NextResponse } from "next/server";
import {prisma} from "@/app/lib/prisma"; // Ensure you have a Prisma instance configured

export async function GET() {
  try {
    const managers = await prisma.manager.findMany({
      include: {
        department: true, // Assuming there is a relation to the Department model
      },
    });

    return NextResponse.json(managers, { status: 200 });
  } catch (error) {
    console.error("Error fetching managers:", error);
    return NextResponse.json({ error: "Failed to fetch managers" }, { status: 500 });
  }
}
