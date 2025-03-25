import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || ""
    let body

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData()
      body = Object.fromEntries(formData)
    } else {
      body = await request.json()
    }

    // eslint-disable-next-line prefer-const
    let { name, email, company, phone, city, message, status, employeeId, designaction, callBackTime, soldAmount } = body
    console.log("Received Employee ID:", employeeId)

    // Ensure email is a string (to prevent array issues)
    if (Array.isArray(email)) {
      email = email[0]
    }

    // Validation
    if (!name || !employeeId) {
      return NextResponse.json({ error: "Name and Employee ID are required" }, { status: 400 })
    }

    // Check if employee exists
    const employeeExists = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: { leads: true } // Fetch existing leads
    })

    if (!employeeExists) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 })
    }

    // Create a new Lead
    const newLead = await prisma.lead.create({
      data: {
        name,
        email: email || null,
        company,
        phone: phone || null,
        city,
        message: message || null,
        designaction,
        status,
        employeeId,
        callBackTime: callBackTime ? new Date(callBackTime) : null,
        soldAmount: status === "SOLD" ? Number.parseFloat(soldAmount) || 0 : 0,
      },
    })

    // Update Employee to link the new lead
    await prisma.employee.update({
      where: { id: employeeId },
      data: {
        leads: {
          connect: { id: newLead.id }, // Correctly link the new lead
        },
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
