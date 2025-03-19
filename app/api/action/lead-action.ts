"use server";

import { prisma } from "@/app/lib/prisma";

export async function searchLeadsByCompany(companyName: string) {
  try {
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
          include: {
            department: true, // ✅ Fetch department from Employee
          },
        },
      },
    });

    return leads;
  } catch (error) {
    console.error("Error searching leads:", error);
    throw new Error("Failed to search leads");
  }
}
