import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = "your_secret_key"; // Replace with an environment variable

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(405).end();

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    jwt.verify(token, SECRET_KEY);
    const leads = await prisma.lead.findMany();
    res.json(leads);
  } catch {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
}
