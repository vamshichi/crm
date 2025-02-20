import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(req: Request, { params }: { params: { departmentId: string } }) {
  try {
    const count = await prisma.lead.count({
      where: { employee: { departmentId: params.departmentId } },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error fetching department lead count:", error);
    return NextResponse.json({ error: "Failed to fetch department lead count" }, { status: 500 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
