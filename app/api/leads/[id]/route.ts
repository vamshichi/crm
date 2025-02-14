// import { NextResponse } from "next/server"
// import { PrismaClient } from "@prisma/client"
// import { getServerSession } from "next-auth/next"
// // import { authOptions } from "../../auth/[...nextauth]/route"

// const prisma = new PrismaClient()

// export async function GET(request: Request, { params }: { params: { id: string } }) {
//   const session = await getServerSession(authOptions)
//   if (!session) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//   }

//   try {
//     const lead = await prisma.lead.findUnique({
//       where: { id: params.id },
//     })
//     if (!lead) {
//       return NextResponse.json({ error: "Lead not found" }, { status: 404 })
//     }
//     return NextResponse.json(lead)
//   } catch (error) {
//     console.error("Error fetching lead:", error)
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
//   }
// }

// export async function PUT(request: Request, { params }: { params: { id: string } }) {
//   const session = await getServerSession(authOptions)
//   if (!session) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//   }

//   try {
//     const body = await request.json()
//     const updatedLead = await prisma.lead.update({
//       where: { id: params.id },
//       data: body,
//     })
//     return NextResponse.json(updatedLead)
//   } catch (error) {
//     console.error("Error updating lead:", error)
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
//   }
// }

// export async function DELETE(request: Request, { params }: { params: { id: string } }) {
//   const session = await getServerSession(authOptions)
//   if (!session) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//   }

//   try {
//     await prisma.lead.delete({
//       where: { id: params.id },
//     })
//     return NextResponse.json({ message: "Lead deleted successfully" })
//   } catch (error) {
//     console.error("Error deleting lead:", error)
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
//   }
// }

