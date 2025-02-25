import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient, LeadStatus } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const leads = await request.json()

    if (!Array.isArray(leads)) {
      return NextResponse.json({ message: "Invalid data format" }, { status: 400 })
    }

    const createdLeads = await prisma.$transaction(
      leads.map((lead) => {
        const { name, email, company, phone, city, designaction, message, status, callBackTime } = lead

        // Validate required fields
        if (!name || !email || !company || !phone || !city || !message || !status) {
          throw new Error("Missing required fields")
        }

        // Validate status
        if (!Object.values(LeadStatus).includes(status)) {
          throw new Error(`Invalid status: ${status}`)
        }

        return prisma.lead.create({
          data: {
            name,
            email,
            company,
            phone,
            city,
            designaction: designaction || null,
            message,
            status: status as LeadStatus,
            callBackTime: callBackTime ? new Date(callBackTime) : null,
            employee: {
              connect: {
                id: lead.employeeId || undefined,
              },
            },
          },
        })
      })
    )

    return NextResponse.json({ message: "Leads imported successfully", count: createdLeads.length }, { status: 200 })
  } catch (error) {
    console.error("Error importing leads:", error)
    return NextResponse.json({ message: "Error importing leads", error: (error as Error).message }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
