import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

// ✅ Handle GET requests
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const companyName = searchParams.get("company");

    if (!companyName) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 });
    }

    const leads = await prisma.lead.findMany({
      where: {
        company: {
          contains: companyName,
          mode: "insensitive",
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            department: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    
    return NextResponse.json({ success: true, leads }, { status: 200 });
  } catch (error) {
    console.error("Error searching leads:", error);
    return NextResponse.json({ success: false, error: "Failed to search leads" }, { status: 500 });
  }
}
