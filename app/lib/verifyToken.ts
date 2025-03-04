import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export function verifyToken(req: NextRequest): string | JwtPayload | null {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null; // Return null instead of NextResponse
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded; // Return decoded payload
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null; // Return null if verification fails
  }
}
