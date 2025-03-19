import { LeadStatus, PrismaClient } from "@prisma/client"
import { type NextRequest, NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()

    // Ensure required fields are present
    if (!data.id) {
      return NextResponse.json({ error: "Lead ID is required" }, { status: 400 })
    }

    // Define a type for the updateable fields of a Lead
    type LeadUpdateData = {
      name?: string
      email?: string
      company?: string
      phone?: string
      city?: string
      designaction?: string | null
      message?: string
      status?: LeadStatus
      callBackTime?: Date | null
      soldAmount?: number  // ✅ Added soldAmount
    }

    const updateData: LeadUpdateData = {}

    // Prepare the data for update
    if (data.name !== undefined) updateData.name = data.name
    if (data.email !== undefined) updateData.email = data.email
    if (data.company !== undefined) updateData.company = data.company
    if (data.phone !== undefined) updateData.phone = data.phone
    if (data.city !== undefined) updateData.city = data.city
    if (data.designaction !== undefined) updateData.designaction = data.designaction
    if (data.message !== undefined) updateData.message = data.message

    // Handle status update - ensure it's a valid enum value
    if (data.status !== undefined) {
      const statusValue = data.status.toUpperCase()
      if (Object.values(LeadStatus).includes(statusValue as LeadStatus)) {
        updateData.status = statusValue as LeadStatus
      } else {
        return NextResponse.json({ error: "Invalid status value" }, { status: 400 })
      }
    }

    // Handle callBackTime if provided
    if (data.callBackTime !== undefined) {
      updateData.callBackTime = new Date(data.callBackTime)
    }

    // ✅ Handle soldAmount if provided and is a valid number
    if (data.soldAmount !== undefined) {
      const soldAmountValue = Number(data.soldAmount)
      if (!isNaN(soldAmountValue) && soldAmountValue >= 0) {
        updateData.soldAmount = soldAmountValue
      } else {
        return NextResponse.json({ error: "Invalid soldAmount value" }, { status: 400 })
      }
    }

    // Update the lead in the database
    const updatedLead = await prisma.lead.update({
      where: {
        id: data.id,
      },
      data: updateData,
    })

    return NextResponse.json(updatedLead)
  } catch (error) {
    console.error("Error updating lead:", error)
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
