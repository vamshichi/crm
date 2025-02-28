import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PUT(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params; // ✅ Correctly getting `id` from context

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid or missing Lead ID" }, { status: 400 });
    }

    const requestBody = await req.json();
    // eslint-disable-next-line prefer-const, @typescript-eslint/no-unused-vars
    let { callBackTime, createdAt, id: _unusedId, ...rest } = requestBody; 
    // ✅ Exclude `id` from data (Prisma does not allow updating `id`)

    if (callBackTime) {
      callBackTime = new Date(callBackTime);
      if (isNaN(callBackTime.getTime())) {
        return NextResponse.json({ error: "Invalid callBackTime format" }, { status: 400 });
      }
    }

    if (createdAt) {
      createdAt = new Date(createdAt);
      if (isNaN(createdAt.getTime())) {
        return NextResponse.json({ error: "Invalid createdAt format" }, { status: 400 });
      }
    }

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: { ...rest, callBackTime, createdAt }, // ✅ Excluding `id`
    });

    return NextResponse.json(updatedLead, { status: 200 });
  } catch (error: any) {
    console.error("Error updating lead:", error.message || error);
    return NextResponse.json({ error: error.message || "Error updating lead" }, { status: 500 });
  }
}
