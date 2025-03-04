import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/app/lib/verifyToken"; // ✅ Import from lib

export async function GET(req: NextRequest) {
  const user = verifyToken(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized - Invalid token" }, { status: 401 });
  }

  return NextResponse.json({ message: "Access granted", user });
}
