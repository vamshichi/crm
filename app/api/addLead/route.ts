import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    // Check if the request is multipart/form-data
    const contentType = request.headers.get("content-type") || ""

    let body

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData()
      body = Object.fromEntries(formData)

      // Handle the email attachment if it exists
    } else {
      body = await request.json()
    }

    const { name, email, company, phone, city, message, status, employeeId, designaction, callBackTime, soldAmount } =
      body

    // Validation
    if (!name || !employeeId) {
      return NextResponse.json({ error: "Name and employee ID are required" }, { status: 400 })
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
        email: email || null, // ✅ Ensures optional field
        company,
        phone: phone || null, // ✅ Ensures optional field
        city,
        message: message || null, // ✅ Ensures optional field
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