import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, company, phone, city, message, status, employeeId, designaction, callBackTime, soldAmount } =
      body

    // Validation
    if (!name || !email || !employeeId) {
      return NextResponse.json({ error: "Name, email, and employee ID are required" }, { status: 400 })
    }

    // Check if the employee exists
    const employeeExists = await prisma.employee.findUnique({
      where: { id: employeeId },
    })

    if (!employeeExists) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 })
    }

    // Create new lead with proper soldAmount handling
    const newLead = await prisma.lead.create({
      data: {
        name,
        email,
        company,
        phone,
        city,
        message,
        designaction,
        status,
        employeeId,
        callBackTime: callBackTime ? new Date(callBackTime) : null,
        soldAmount: status === "SOLD" ? Number.parseFloat(soldAmount) || 0 : 0,
      },
    })

    return NextResponse.json(newLead, { status: 201 })
  } catch (error) {
    console.error("Error creating lead:", error)
    return NextResponse.json({ error: "Error creating lead" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

